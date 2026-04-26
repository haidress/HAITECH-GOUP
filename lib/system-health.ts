import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";

export type DbHealth = { ok: true; latencyMs: number } | { ok: false; message: string };

export async function checkDatabaseHealth(): Promise<DbHealth> {
  const started = Date.now();
  try {
    const pool = getDbPool();
    await pool.query("SELECT 1 AS ok");
    return { ok: true, latencyMs: Date.now() - started };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur inconnue";
    return { ok: false, message };
  }
}

export async function listRecentMigrations(limit = 12): Promise<Array<{ filename: string; applied_at: string }>> {
  try {
    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT filename, applied_at
      FROM schema_migrations
      ORDER BY applied_at DESC, id DESC
      LIMIT ?
      `,
      [limit]
    );
    return rows as Array<{ filename: string; applied_at: string }>;
  } catch {
    return [];
  }
}

export type RedisHealth =
  | { configured: false; ok: false; message: string }
  | { configured: true; ok: true; latencyMs: number }
  | { configured: true; ok: false; message: string };

export async function checkRedisHealth(): Promise<RedisHealth> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return { configured: false, ok: false, message: "Upstash non configuré (limites distribuées désactivées)." };
  }
  const started = Date.now();
  try {
    const response = await fetch(url.replace(/\/$/, ""), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(["PING"])
    });
    if (!response.ok) {
      return { configured: true, ok: false, message: `HTTP ${response.status}` };
    }
    return { configured: true, ok: true, latencyMs: Date.now() - started };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur réseau";
    return { configured: true, ok: false, message };
  }
}

export function getSmtpConfigSummary() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const configured = Boolean(host && user && pass);
  return {
    configured,
    host: host ? "(défini)" : "(absent)",
    from: process.env.SMTP_FROM ?? "no-reply@haitech-group.ci"
  };
}
