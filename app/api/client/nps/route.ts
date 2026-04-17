import { z } from "zod";
import { RowDataPacket } from "mysql2";
import { getCurrentUser } from "@/lib/auth";
import { getDbPool } from "@/lib/db";
import { ensureSameOrigin } from "@/lib/request-security";
import { fail, ok } from "@/lib/api-response";

const schema = z.object({
  score: z.number().int().min(0).max(10),
  comment: z.string().trim().max(2000).optional()
});

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  const user = await getCurrentUser();
  if (!user || user.role !== "client") return fail("Non autorisé.", "UNAUTHORIZED", 401);
  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return fail("Données invalides.", "VALIDATION_ERROR", 400);
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>("SELECT id FROM clients WHERE user_id = ? LIMIT 1", [user.id]);
  const clientId = rows[0]?.id ? Number(rows[0].id) : null;
  if (!clientId) return fail("Client introuvable.", "NOT_FOUND", 404);
  await pool.execute("INSERT INTO nps_feedback (client_id, score, comment) VALUES (?, ?, ?)", [clientId, parsed.data.score, parsed.data.comment ?? null]);
  return ok({ saved: true });
}
