import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";
import { fail, ok } from "@/lib/api-response";
import { writeAuditLog } from "@/lib/audit-log";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  if (!(await isAdminAuthenticated())) return fail("Non autorisé.", "UNAUTHORIZED", 401);

  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT mpi.id, mpi.title, mpi.frequency_days, mpi.next_run_at, cc.client_id
    FROM maintenance_plan_items mpi
    INNER JOIN client_contracts cc ON cc.id = mpi.contract_id
    WHERE mpi.next_run_at <= NOW() AND cc.status = 'actif'
    LIMIT 100
    `
  );

  let created = 0;
  for (const row of rows) {
    await pool.execute(
      `
      INSERT INTO maintenance_interventions (client_id, titre, details, intervention_type, statut, scheduled_at)
      VALUES (?, ?, ?, 'preventive', 'planifiee', ?)
      `,
      [Number(row.client_id), String(row.title), "Générée automatiquement depuis le plan de maintenance.", row.next_run_at]
    );
    await pool.execute(
      `
      UPDATE maintenance_plan_items
      SET next_run_at = DATE_ADD(next_run_at, INTERVAL ? DAY), status = 'planifie'
      WHERE id = ?
      `,
      [Number(row.frequency_days), Number(row.id)]
    );
    created += 1;
  }

  const user = await getCurrentUser();
  await writeAuditLog({
    actorUserId: user?.id ?? null,
    action: "MAINTENANCE_AUTOGENERATE_RUN",
    resourceType: "maintenance_plan",
    after: { created }
  });
  return ok({ created });
}
