import { getDbPool } from "@/lib/db";

export async function writeAuditLog({
  actorUserId,
  action,
  resourceType,
  resourceId,
  before,
  after
}: {
  actorUserId?: number | null;
  action: string;
  resourceType: string;
  resourceId?: string | number | null;
  before?: unknown;
  after?: unknown;
}) {
  try {
    const pool = getDbPool();
    await pool.execute(
      `
      INSERT INTO audit_logs (actor_user_id, action, resource_type, resource_id, before_json, after_json)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        actorUserId ?? null,
        action,
        resourceType,
        resourceId == null ? null : String(resourceId),
        before === undefined ? null : JSON.stringify(before),
        after === undefined ? null : JSON.stringify(after)
      ]
    );
  } catch (error) {
    console.error("writeAuditLog error:", error);
  }
}
