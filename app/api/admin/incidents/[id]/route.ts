import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { getCurrentUser } from "@/lib/auth";
import { ensureSameOrigin } from "@/lib/request-security";
import { fail, ok } from "@/lib/api-response";
import { writeAuditLog } from "@/lib/audit-log";

const patchSchema = z.object({
  status: z.enum(["ouvert", "en_cours", "en_attente_client", "resolu", "ferme"]).optional(),
  priority: z.enum(["basse", "moyenne", "haute", "critique"]).optional(),
  escalate: z.boolean().optional(),
  note: z.string().trim().max(2000).optional(),
  resolutionMode: z.enum(["pending", "remote", "onsite", "hybrid"]).optional(),
  remoteTool: z.string().trim().max(80).optional(),
  remoteSessionLink: z.string().trim().max(255).optional(),
  assignedTechnicianUserId: z.number().int().positive().nullable().optional(),
  etaAt: z.string().trim().min(10).max(40).optional(),
  onsiteRequired: z.boolean().optional(),
  onsiteAddress: z.string().trim().max(255).optional(),
  onsiteScheduledAt: z.string().trim().min(10).max(40).optional()
});

export async function PATCH(
  request: Request,
  context: {
    params: { id: string };
  }
) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  if (!(await isAdminAuthenticated())) return fail("Non autorisé.", "UNAUTHORIZED", 401);
  const id = Number(context.params.id);
  if (!Number.isFinite(id) || id <= 0) return fail("Identifiant invalide.", "VALIDATION_ERROR", 400);
  const payload = await request.json();
  const parsed = patchSchema.safeParse(payload);
  if (!parsed.success) return fail("Données invalides.", "VALIDATION_ERROR", 400);

  const user = await getCurrentUser();
  const pool = getDbPool();
  const changes: string[] = [];
  const values: Array<string | number | null> = [];
  if (parsed.data.status) {
    changes.push("status = ?");
    values.push(parsed.data.status);
  }
  if (parsed.data.priority) {
    changes.push("priority = ?");
    values.push(parsed.data.priority);
  }
  if (parsed.data.resolutionMode) {
    changes.push("resolution_mode = ?");
    values.push(parsed.data.resolutionMode);
  }
  if (parsed.data.remoteTool !== undefined) {
    changes.push("remote_tool = ?");
    values.push(parsed.data.remoteTool || null);
  }
  if (parsed.data.remoteSessionLink !== undefined) {
    changes.push("remote_session_link = ?");
    values.push(parsed.data.remoteSessionLink || null);
  }
  if (parsed.data.assignedTechnicianUserId !== undefined) {
    changes.push("assigned_technician_user_id = ?");
    values.push(parsed.data.assignedTechnicianUserId ?? null);
  }
  if (parsed.data.etaAt !== undefined) {
    changes.push("eta_at = ?");
    values.push(parsed.data.etaAt || null);
  }
  if (parsed.data.onsiteRequired !== undefined) {
    changes.push("onsite_required = ?");
    values.push(parsed.data.onsiteRequired ? 1 : 0);
  }
  if (parsed.data.onsiteAddress !== undefined) {
    changes.push("onsite_address = ?");
    values.push(parsed.data.onsiteAddress || null);
  }
  if (parsed.data.onsiteScheduledAt !== undefined) {
    changes.push("onsite_scheduled_at = ?");
    values.push(parsed.data.onsiteScheduledAt || null);
  }
  if (parsed.data.escalate) {
    changes.push("escalation_level = escalation_level + 1");
  }
  if (changes.length) {
    await pool.execute(
      `
      UPDATE incident_tickets
      SET ${changes.join(", ")}
      WHERE id = ?
      `,
      [...values, id]
    );
  }
  if (parsed.data.etaAt !== undefined || parsed.data.assignedTechnicianUserId !== undefined || parsed.data.status !== undefined) {
    const [clientRows] = await pool.query(
      `
      SELECT u.id AS user_id
      FROM incident_tickets i
      INNER JOIN clients c ON c.id = i.client_id
      INNER JOIN users u ON u.id = c.user_id
      WHERE i.id = ?
      LIMIT 1
      `,
      [id]
    );
    const userId = (clientRows as Array<{ user_id?: number }>)[0]?.user_id;
    if (userId) {
      await pool.execute(
        `
        INSERT INTO notification_events (user_id, channel, event_type, payload_json, status)
        VALUES (?, 'in_app', 'incident_update', ?, 'queued')
        `,
        [userId, JSON.stringify({ incidentId: id, etaAt: parsed.data.etaAt, status: parsed.data.status })]
      );
    }
  }
  if (parsed.data.note) {
    await pool.execute(
      `
      INSERT INTO incident_comments (ticket_id, author_user_id, comment, is_internal)
      VALUES (?, ?, ?, 1)
      `,
      [id, user?.id ?? 0, parsed.data.note]
    );
  }
  await writeAuditLog({
    actorUserId: user?.id ?? null,
    action: "INCIDENT_UPDATED",
    resourceType: "incident",
    resourceId: id,
    after: parsed.data
  });
  return ok({ updated: true });
}

export async function GET(
  _request: Request,
  context: {
    params: { id: string };
  }
) {
  if (!(await isAdminAuthenticated())) return fail("Non autorisé.", "UNAUTHORIZED", 401);
  const id = Number(context.params.id);
  if (!Number.isFinite(id) || id <= 0) return fail("Identifiant invalide.", "VALIDATION_ERROR", 400);
  const pool = getDbPool();
  const [ticketRows] = await pool.query(
    `
    SELECT id, title, description, priority, status, escalation_level, due_at, updated_at,
           asset_name, os_version, remote_possible, remote_tool, remote_session_link,
           onsite_required, onsite_address, onsite_scheduled_at, resolution_mode, eta_at, assigned_technician_user_id
    FROM incident_tickets
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );
  const [commentRows] = await pool.query(
    `
    SELECT c.id, c.comment, c.is_internal, c.created_at, u.nom, u.prenom
    FROM incident_comments c
    INNER JOIN users u ON u.id = c.author_user_id
    WHERE c.ticket_id = ?
    ORDER BY c.created_at DESC
    `,
    [id]
  );
  return NextResponse.json({ success: true, data: { ticket: (ticketRows as Array<unknown>)[0] ?? null, comments: commentRows } });
}
