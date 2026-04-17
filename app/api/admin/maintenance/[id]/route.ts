import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";

const updateSchema = z.object({
  statut: z.enum(["planifiee", "en_cours", "terminee", "reportee"]).optional(),
  scheduledAt: z.string().trim().min(10).optional(),
  assignedTechnicianUserId: z.number().int().positive().nullable().optional(),
  etaAt: z.string().trim().min(10).optional(),
  checkinAt: z.string().trim().min(10).optional(),
  checkoutAt: z.string().trim().min(10).optional(),
  laborMinutes: z.number().int().min(0).optional(),
  laborCost: z.number().min(0).optional(),
  interventionSummary: z.string().trim().max(4000).optional(),
  checklist: z
    .object({
      arrivedOk: z.boolean(),
      diagnosticOk: z.boolean(),
      actionDoneOk: z.boolean(),
      clientTestOk: z.boolean(),
      clientSignatureName: z.string().trim().max(180).optional()
    })
    .optional(),
  part: z
    .object({
      partName: z.string().trim().min(2).max(180),
      quantity: z.number().int().min(1).max(999),
      unitCost: z.number().min(0)
    })
    .optional(),
  photo: z
    .object({
      photoUrl: z.string().trim().min(5).max(255),
      caption: z.string().trim().max(180).optional()
    })
    .optional()
});

export async function PATCH(
  request: Request,
  context: {
    params: { id: string };
  }
) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  const id = Number(context.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ success: false, message: "Identifiant invalide." }, { status: 400 });
  }
  try {
    const payload = await request.json();
    const parsed = updateSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });
    }
    const changes: string[] = [];
    const values: Array<string | number | null> = [];
    if (parsed.data.statut) {
      changes.push("statut = ?");
      values.push(parsed.data.statut);
    }
    if (parsed.data.scheduledAt) {
      changes.push("scheduled_at = ?");
      values.push(parsed.data.scheduledAt);
    }
    if (parsed.data.assignedTechnicianUserId !== undefined) {
      changes.push("assigned_technician_user_id = ?");
      values.push(parsed.data.assignedTechnicianUserId ?? null);
    }
    if (parsed.data.etaAt !== undefined) {
      changes.push("eta_at = ?");
      values.push(parsed.data.etaAt || null);
    }
    if (parsed.data.checkinAt !== undefined) {
      changes.push("checkin_at = ?");
      values.push(parsed.data.checkinAt || null);
    }
    if (parsed.data.checkoutAt !== undefined) {
      changes.push("checkout_at = ?");
      values.push(parsed.data.checkoutAt || null);
    }
    if (parsed.data.laborMinutes !== undefined) {
      changes.push("labor_minutes = ?");
      values.push(parsed.data.laborMinutes);
    }
    if (parsed.data.laborCost !== undefined) {
      changes.push("labor_cost = ?");
      values.push(parsed.data.laborCost);
    }
    if (parsed.data.interventionSummary !== undefined) {
      changes.push("intervention_summary = ?");
      values.push(parsed.data.interventionSummary || null);
    }
    if (!changes.length) {
      return NextResponse.json({ success: false, message: "Aucune modification reçue." }, { status: 400 });
    }
    const pool = getDbPool();
    await pool.execute(
      `
      UPDATE maintenance_interventions
      SET ${changes.join(", ")}
      WHERE id = ?
      `,
      [...values, id]
    );
    if (parsed.data.checklist) {
      await pool.execute(
        `
        INSERT INTO intervention_checklists (
          intervention_id, arrived_ok, diagnostic_ok, action_done_ok, client_test_ok, client_signature_name
        )
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          arrived_ok = VALUES(arrived_ok),
          diagnostic_ok = VALUES(diagnostic_ok),
          action_done_ok = VALUES(action_done_ok),
          client_test_ok = VALUES(client_test_ok),
          client_signature_name = VALUES(client_signature_name)
        `,
        [
          id,
          parsed.data.checklist.arrivedOk ? 1 : 0,
          parsed.data.checklist.diagnosticOk ? 1 : 0,
          parsed.data.checklist.actionDoneOk ? 1 : 0,
          parsed.data.checklist.clientTestOk ? 1 : 0,
          parsed.data.checklist.clientSignatureName ?? null
        ]
      );
    }
    if (parsed.data.part) {
      await pool.execute(
        `
        INSERT INTO intervention_parts (intervention_id, part_name, quantity, unit_cost)
        VALUES (?, ?, ?, ?)
        `,
        [id, parsed.data.part.partName, parsed.data.part.quantity, parsed.data.part.unitCost]
      );
    }
    if (parsed.data.photo) {
      await pool.execute(
        `
        INSERT INTO intervention_photos (intervention_id, photo_url, caption)
        VALUES (?, ?, ?)
        `,
        [id, parsed.data.photo.photoUrl, parsed.data.photo.caption ?? null]
      );
    }
    if (parsed.data.etaAt !== undefined || parsed.data.assignedTechnicianUserId !== undefined || parsed.data.statut !== undefined) {
      const [clientRows] = await pool.query(
        `
        SELECT u.id AS user_id
        FROM maintenance_interventions m
        INNER JOIN clients c ON c.id = m.client_id
        INNER JOIN users u ON u.id = c.user_id
        WHERE m.id = ?
        LIMIT 1
        `,
        [id]
      );
      const userId = (clientRows as Array<{ user_id?: number }>)[0]?.user_id;
      if (userId) {
        await pool.execute(
          `
          INSERT INTO notification_events (user_id, channel, event_type, payload_json, status)
          VALUES (?, 'in_app', 'intervention_update', ?, 'queued')
          `,
          [userId, JSON.stringify({ interventionId: id, etaAt: parsed.data.etaAt, statut: parsed.data.statut })]
        );
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur PATCH /api/admin/maintenance/[id]:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
