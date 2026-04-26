import { NextResponse } from "next/server";
import { z } from "zod";
import { RowDataPacket } from "mysql2";
import { getCurrentUser } from "@/lib/auth";
import { getDbPool } from "@/lib/db";
import { ensureSameOrigin } from "@/lib/request-security";
import { checkRateLimitSmart } from "@/lib/rate-limit";
import { fail, ok } from "@/lib/api-response";
import { writeAuditLog } from "@/lib/audit-log";
import { incrementMetric } from "@/lib/observability";

const createSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(5).max(4000),
  priority: z.enum(["basse", "moyenne", "haute", "critique"]),
  assetName: z.string().trim().max(180).optional(),
  osVersion: z.string().trim().max(120).optional(),
  remotePossible: z.boolean().optional(),
  onsiteAddress: z.string().trim().max(255).optional()
});

async function getClientIdForUser(userId: number) {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>("SELECT id FROM clients WHERE user_id = ? LIMIT 1", [userId]);
  return rows[0]?.id ? Number(rows[0].id) : null;
}

export async function GET(request: Request) {
  incrementMetric("api_requests_total");
  const user = await getCurrentUser();
  if (!user || (user.role !== "client" && user.role !== "admin")) {
    return fail("Non autorisé.", "UNAUTHORIZED", 401);
  }
  const clientId = await getClientIdForUser(user.id);
  if (!clientId) return ok({ items: [], total: 0 });

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get("pageSize") ?? "10")));
  const offset = (page - 1) * pageSize;

  const pool = getDbPool();
  const [items] = await pool.query<RowDataPacket[]>(
    `
    SELECT id, title, description, priority, status, escalation_level, due_at, created_at, updated_at,
           asset_name, os_version, remote_possible, remote_tool, remote_session_link,
           onsite_required, onsite_address, onsite_scheduled_at, resolution_mode
    FROM incident_tickets
    WHERE client_id = ?
    ORDER BY updated_at DESC
    LIMIT ? OFFSET ?
    `,
    [clientId, pageSize, offset]
  );
  const [countRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS total FROM incident_tickets WHERE client_id = ?", [clientId]);
  return ok({ items, total: Number(countRows[0]?.total ?? 0), page, pageSize });
}

export async function POST(request: Request) {
  incrementMetric("api_requests_total");
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;

  const user = await getCurrentUser();
  if (!user || user.role !== "client") {
    return fail("Non autorisé.", "UNAUTHORIZED", 401);
  }

  const rate = await checkRateLimitSmart(request, `client-incidents:${user.id}`, 10, 60_000);
  if (!rate.ok) {
    return fail(`Trop de requêtes. Réessayez dans ${rate.retryAfterSec}s.`, "RATE_LIMITED", 429);
  }

  const payload = await request.json();
  const parsed = createSchema.safeParse(payload);
  if (!parsed.success) {
    incrementMetric("api_errors_total");
    return fail("Données invalides.", "VALIDATION_ERROR", 400);
  }
  if (parsed.data.remotePossible === false && !parsed.data.onsiteAddress?.trim()) {
    return fail("Adresse de déplacement requise si intervention à distance impossible.", "VALIDATION_ERROR", 400);
  }

  const clientId = await getClientIdForUser(user.id);
  if (!clientId) return fail("Profil client introuvable.", "NOT_FOUND", 404);

  const pool = getDbPool();
  const [result] = await pool.execute(
    `
    INSERT INTO incident_tickets (
      client_id, created_by_user_id, title, description, priority, status,
      asset_name, os_version, remote_possible, onsite_required, onsite_address, resolution_mode
    )
    VALUES (?, ?, ?, ?, ?, 'ouvert', ?, ?, ?, ?, ?, 'pending')
    `,
    [
      clientId,
      user.id,
      parsed.data.title,
      parsed.data.description,
      parsed.data.priority,
      parsed.data.assetName ?? null,
      parsed.data.osVersion ?? null,
      parsed.data.remotePossible ?? true,
      parsed.data.remotePossible === false,
      parsed.data.onsiteAddress ?? null
    ]
  );
  const ticketId = (result as { insertId: number }).insertId;
  await pool.execute(
    `
    INSERT INTO notification_events (user_id, channel, event_type, payload_json, status)
    VALUES (?, 'in_app', 'incident_created', ?, 'queued')
    `,
    [user.id, JSON.stringify({ ticketId, priority: parsed.data.priority })]
  );
  await writeAuditLog({
    actorUserId: user.id,
    action: "INCIDENT_CREATED",
    resourceType: "incident",
    resourceId: ticketId,
    after: parsed.data
  });
  return ok({ ticketId });
}
