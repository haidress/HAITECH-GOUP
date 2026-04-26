import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { verifyCronRequest } from "@/lib/cron-auth";
import { getDbPool } from "@/lib/db";

async function runRetentionPurge() {
  const pool = getDbPool();
  const [settingRows] = await pool.query<RowDataPacket[]>(
    "SELECT valeur FROM settings WHERE cle = 'leads_retention_days' LIMIT 1"
  );
  const raw = settingRows[0] as { valeur: string } | undefined;
  const days = Math.max(30, Math.min(3650, Number.parseInt(raw?.valeur ?? "730", 10) || 730));

  const [result] = await pool.execute(
    `
      DELETE FROM leads
      WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
      LIMIT 500
      `,
    [days]
  );

  const header = result as { affectedRows?: number };
  return NextResponse.json({
    ok: true,
    retentionDays: days,
    deletedApprox: header.affectedRows ?? 0
  });
}

export async function GET(request: Request) {
  const denied = verifyCronRequest(request);
  if (denied) return denied;
  try {
    return await runRetentionPurge();
  } catch (error) {
    console.error("cron leads-retention-purge GET:", error);
    return NextResponse.json({ ok: false, message: "Purge impossible." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = verifyCronRequest(request);
  if (denied) return denied;
  try {
    return await runRetentionPurge();
  } catch (error) {
    console.error("cron leads-retention-purge POST:", error);
    return NextResponse.json({ ok: false, message: "Purge impossible." }, { status: 500 });
  }
}
