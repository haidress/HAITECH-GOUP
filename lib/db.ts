import mysql, { type Pool, type PoolOptions } from "mysql2/promise";

let pool: Pool | null = null;

function parseConnectionLimit(): number {
  const raw = process.env.DB_CONNECTION_LIMIT ?? process.env.DB_POOL_MAX;
  const n = raw ? Number(raw) : NaN;
  if (Number.isFinite(n) && n > 0) {
    return Math.min(30, Math.max(1, Math.floor(n)));
  }
  return 5;
}

function getDbConfig(): PoolOptions {
  const host = process.env.DB_HOST ?? "127.0.0.1";
  const user = process.env.DB_USER ?? "root";
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME ?? "haitech_group";
  const port = Number(process.env.DB_PORT ?? "3306");
  const connectionLimit = parseConnectionLimit();
  const maxIdle = Math.max(1, connectionLimit - 1);

  return {
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit,
    maxIdle,
    idleTimeout: 60_000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  };
}

/** Erreurs MySQL côté serveur : trop de connexions ou limite utilisateur. */
export function isMysqlConnectionCapacityError(error: unknown): boolean {
  const code =
    error && typeof error === "object" && "code" in error && typeof (error as { code: unknown }).code === "string"
      ? (error as { code: string }).code
      : undefined;
  if (code === "ER_CON_COUNT_ERROR" || code === "ER_USER_LIMIT_REACHED" || code === "ER_TOO_MANY_USER_CONNECTIONS") {
    return true;
  }
  const msg = error instanceof Error ? error.message : "";
  return /too many connections/i.test(msg);
}

export function getDbPool(): Pool {
  if (!pool) {
    pool = mysql.createPool(getDbConfig());
  }
  return pool;
}
