import { randomUUID } from "crypto";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";

export async function acquireCronLock(lockKey: string, ttlSec = 300) {
  const pool = getDbPool();
  const ownerToken = randomUUID();

  const [result] = await pool.execute(
    `
    INSERT INTO cron_execution_locks (lock_key, owner_token, expires_at)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND))
    ON DUPLICATE KEY UPDATE
      owner_token = IF(expires_at <= NOW(), VALUES(owner_token), owner_token),
      expires_at = IF(expires_at <= NOW(), VALUES(expires_at), expires_at)
    `,
    [lockKey, ownerToken, ttlSec]
  );

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT owner_token FROM cron_execution_locks WHERE lock_key = ? LIMIT 1",
    [lockKey]
  );
  const currentOwner = (rows[0] as { owner_token?: string } | undefined)?.owner_token;
  const acquired = currentOwner === ownerToken;
  return { acquired, ownerToken, result };
}

export async function releaseCronLock(lockKey: string, ownerToken: string) {
  const pool = getDbPool();
  await pool.execute("DELETE FROM cron_execution_locks WHERE lock_key = ? AND owner_token = ?", [lockKey, ownerToken]);
}
