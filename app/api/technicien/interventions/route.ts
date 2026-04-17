import { RowDataPacket } from "mysql2";
import { getCurrentUser } from "@/lib/auth";
import { getDbPool } from "@/lib/db";
import { fail, ok } from "@/lib/api-response";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "technicien" && user.role !== "admin")) {
    return fail("Non autorisé.", "UNAUTHORIZED", 401);
  }
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT id, titre, statut, scheduled_at, eta_at, checkin_at, checkout_at, labor_minutes, labor_cost
    FROM maintenance_interventions
    WHERE assigned_technician_user_id = ?
    ORDER BY COALESCE(eta_at, scheduled_at) ASC
    `,
    [user.id]
  );
  return ok(rows);
}
