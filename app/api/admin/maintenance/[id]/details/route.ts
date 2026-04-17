import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { fail, ok } from "@/lib/api-response";

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
  const [checklistRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT arrived_ok, diagnostic_ok, action_done_ok, client_test_ok, client_signature_name, updated_at
    FROM intervention_checklists
    WHERE intervention_id = ?
    LIMIT 1
    `,
    [id]
  );
  const [partsRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT id, part_name, quantity, unit_cost, created_at
    FROM intervention_parts
    WHERE intervention_id = ?
    ORDER BY created_at DESC
    `,
    [id]
  );
  const [photosRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT id, photo_url, caption, created_at
    FROM intervention_photos
    WHERE intervention_id = ?
    ORDER BY created_at DESC
    `,
    [id]
  );
  return ok({ checklist: checklistRows[0] ?? null, parts: partsRows, photos: photosRows });
}
