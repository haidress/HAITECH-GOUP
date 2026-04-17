import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { fail, ok } from "@/lib/api-response";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return fail("Non autorisé.", "UNAUTHORIZED", 401);
  }
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const priority = url.searchParams.get("priority");
  const where: string[] = [];
  const values: Array<string | number> = [];
  if (status) {
    where.push("i.status = ?");
    values.push(status);
  }
  if (priority) {
    where.push("i.priority = ?");
    values.push(priority);
  }
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT i.id, i.title, i.priority, i.status, i.escalation_level, i.updated_at,
           i.asset_name, i.remote_possible, i.remote_session_link, i.onsite_required, i.onsite_scheduled_at, i.resolution_mode,
           i.eta_at, i.assigned_technician_user_id,
           c.entreprise, u.email AS client_email,
           CONCAT(COALESCE(tu.nom, ''), ' ', COALESCE(tu.prenom, '')) AS technician_name
    FROM incident_tickets i
    INNER JOIN clients c ON c.id = i.client_id
    INNER JOIN users u ON u.id = c.user_id
    LEFT JOIN users tu ON tu.id = i.assigned_technician_user_id
    ${whereClause}
    ORDER BY i.updated_at DESC
    `,
    values
  );
  return ok(rows);
}
