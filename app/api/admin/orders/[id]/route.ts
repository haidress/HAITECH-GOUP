import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";
import { getCurrentUser } from "@/lib/auth";
import { RowDataPacket } from "mysql2";
import { hasPermission } from "@/lib/permissions";
import { fail, ok } from "@/lib/api-response";
import { writeAuditLog } from "@/lib/audit-log";
import { getOrderById } from "@/lib/repositories/order-repository";
import { upsertOrderClosureChecklist } from "@/lib/services/order-service";
import { incrementMetric } from "@/lib/observability";
import { notifyOrderCriticalUpdate } from "@/lib/notifications";

const updateStatusSchema = z.object({
  status: z.enum(["nouvelle", "en_cours", "en_attente_client", "validee_client", "livree", "traitee", "cloturee", "annulee"]).optional(),
  assignedUserId: z.number().int().positive().nullable().optional(),
  note: z.string().trim().max(2000).optional(),
  closeOrder: z.boolean().optional(),
  closeNote: z.string().trim().max(2000).optional(),
  closureChecklist: z
    .object({
      clientValidationOk: z.boolean(),
      reportSentOk: z.boolean(),
      proofAttachedOk: z.boolean(),
      proofUrl: z.string().trim().max(255).optional()
    })
    .optional()
});

export async function PATCH(
  request: Request,
  context: {
    params: { id: string };
  }
) {
  incrementMetric("api_requests_total");
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;

  if (!(await isAdminAuthenticated())) {
    return fail("Non autorisé.", "UNAUTHORIZED", 401);
  }

  const id = Number(context.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return fail("Identifiant invalide.", "VALIDATION_ERROR", 400);
  }

  try {
    const user = await getCurrentUser();
    const payload = await request.json();
    const parsed = updateStatusSchema.safeParse(payload);
    if (!parsed.success) {
      incrementMetric("api_errors_total");
      return fail("Statut invalide.", "VALIDATION_ERROR", 400);
    }

    const current = await getOrderById(id);
    if (!current) {
      return fail("Commande introuvable.", "NOT_FOUND", 404);
    }
    const pool = getDbPool();

    const nextStatus = parsed.data.status ?? current.status;
    const nextAssigned = parsed.data.assignedUserId === undefined ? current.assigned_user_id : parsed.data.assignedUserId;
    const shouldCloseOrder = Boolean(parsed.data.closeOrder);
    if (shouldCloseOrder && !(await hasPermission("orders.close"))) {
      return fail("Permission insuffisante pour clôturer.", "FORBIDDEN", 403);
    }
    const handledAt = nextStatus === "traitee" || shouldCloseOrder ? "NOW()" : "NULL";
    const closeFields = shouldCloseOrder ? ", is_closed = 1, closed_at = NOW(), closed_by_user_id = ?, status = 'cloturee'" : "";
    await pool.query(
      `
      UPDATE customer_orders
      SET status = ?, assigned_user_id = ?, last_status_at = NOW(), handled_at = ${handledAt}${closeFields}
      WHERE id = ?
      `,
      shouldCloseOrder ? [nextStatus, nextAssigned, user?.id ?? null, id] : [nextStatus, nextAssigned, id]
    );

    if (parsed.data.closureChecklist) {
      await upsertOrderClosureChecklist({
        orderId: id,
        actorUserId: user?.id ?? null,
        clientValidationOk: parsed.data.closureChecklist.clientValidationOk,
        reportSentOk: parsed.data.closureChecklist.reportSentOk,
        proofAttachedOk: parsed.data.closureChecklist.proofAttachedOk,
        proofUrl: parsed.data.closureChecklist.proofUrl,
        closureNote: parsed.data.closeNote
      });
    }

    if (parsed.data.status && parsed.data.status !== current.status) {
      await pool.execute(
        `
        INSERT INTO order_notes (order_id, actor_user_id, note, action_type)
        VALUES (?, ?, ?, 'status_change')
        `,
        [id, user?.id ?? null, `Statut modifié: ${current.status} -> ${parsed.data.status}`]
      );

      const [adminRows] = await pool.query<RowDataPacket[]>(
        `
        SELECT u.email
        FROM users u
        INNER JOIN roles r ON r.id = u.role_id
        WHERE r.nom = 'admin' AND u.statut = 'actif'
        `
      );
      const adminEmails = adminRows.map((row) => String(row.email)).filter(Boolean);
      const [clientRows] = await pool.query<RowDataPacket[]>(
        `
        SELECT o.contact, u.id AS user_id
        FROM customer_orders o
        LEFT JOIN users u ON u.email = o.email
        WHERE o.id = ?
        LIMIT 1
        `,
        [id]
      );
      try {
        await notifyOrderCriticalUpdate({
          clientEmail: String(current.email),
          clientContact: String(clientRows[0]?.contact ?? ""),
          referenceCode: String(current.reference_code),
          productName: String(current.product_name),
          nextStatus: parsed.data.status,
          adminEmails,
          clientUserId: clientRows[0]?.user_id ? Number(clientRows[0].user_id) : null
        });
      } catch (mailError) {
        console.error("Erreur notification statut commande:", mailError);
      }
    }

    if (parsed.data.assignedUserId !== undefined && parsed.data.assignedUserId !== current.assigned_user_id) {
      await pool.execute(
        `
        INSERT INTO order_notes (order_id, actor_user_id, note, action_type)
        VALUES (?, ?, ?, 'assignment')
        `,
        [id, user?.id ?? null, parsed.data.assignedUserId ? `Commande assignée à admin #${parsed.data.assignedUserId}` : "Assignation retirée"]
      );
    }

    if (parsed.data.note) {
      await pool.execute(
        `
        INSERT INTO order_notes (order_id, actor_user_id, note, action_type)
        VALUES (?, ?, ?, 'comment')
        `,
        [id, user?.id ?? null, parsed.data.note]
      );
    }

    if (shouldCloseOrder && !current.is_closed) {
      await pool.execute(
        `
        INSERT INTO order_notes (order_id, actor_user_id, note, action_type)
        VALUES (?, ?, ?, 'status_change')
        `,
        [id, user?.id ?? null, parsed.data.closeNote?.trim() || "Commande clôturée après validation client."]
      );
    }

    await writeAuditLog({
      actorUserId: user?.id ?? null,
      action: shouldCloseOrder ? "ORDER_CLOSED" : "ORDER_UPDATED",
      resourceType: "order",
      resourceId: id,
      before: current,
      after: { status: nextStatus, assigned_user_id: nextAssigned, closeOrder: shouldCloseOrder }
    });

    return ok({ updated: true });
  } catch (error) {
    incrementMetric("api_errors_total");
    console.error("Erreur PATCH /api/admin/orders/[id]:", error);
    return fail("Erreur serveur.", "INTERNAL_ERROR", 500);
  }
}
