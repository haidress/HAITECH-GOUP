import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { verifyCronRequest } from "@/lib/cron-auth";
import { getDbPool } from "@/lib/db";
import { sendLeadNurtureEmail } from "@/lib/email";
import { acquireCronLock, releaseCronLock } from "@/lib/cron-lock";

async function runFollowups() {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT id, nom, email
    FROM leads
    WHERE statut = 'nouveau'
      AND created_at <= DATE_SUB(NOW(), INTERVAL 2 DAY)
      AND last_followup_email_at IS NULL
    ORDER BY created_at ASC
    LIMIT 40
    `
  );

  let sent = 0;
  let skipped = 0;
  for (const row of rows as Array<{ id: number; nom: string; email: string }>) {
    const [claim] = await pool.execute(
      "INSERT IGNORE INTO lead_followup_logs (lead_id, followup_type, status) VALUES (?, 'j2_email', 'claimed')",
      [row.id]
    );
    const claimResult = claim as { affectedRows?: number };
    if (!claimResult.affectedRows) {
      skipped += 1;
      continue;
    }

    const result = await sendLeadNurtureEmail(row.email, row.nom.split(/\s+/)[0] || "Bonjour");
    if (result.delivered) {
      await pool.execute("UPDATE leads SET last_followup_email_at = NOW() WHERE id = ? AND last_followup_email_at IS NULL", [row.id]);
      await pool.execute(
        "UPDATE lead_followup_logs SET status = 'sent', details_json = ? WHERE lead_id = ? AND followup_type = 'j2_email'",
        [JSON.stringify(result), row.id]
      );
      sent += 1;
    } else {
      await pool.execute(
        "UPDATE lead_followup_logs SET status = 'skipped', details_json = ? WHERE lead_id = ? AND followup_type = 'j2_email'",
        [JSON.stringify(result), row.id]
      );
      skipped += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    processed: rows.length,
    sent,
    skipped
  });
}

export async function GET(request: Request) {
  const denied = verifyCronRequest(request);
  if (denied) return denied;
  try {
    const lock = await acquireCronLock("cron:lead-followups", 300);
    if (!lock.acquired) {
      return NextResponse.json({ ok: true, skipped: true, reason: "job already running" });
    }
    try {
      return await runFollowups();
    } finally {
      await releaseCronLock("cron:lead-followups", lock.ownerToken);
    }
  } catch (error) {
    console.error("cron lead-followups:", error);
    return NextResponse.json({ ok: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = verifyCronRequest(request);
  if (denied) return denied;
  try {
    const lock = await acquireCronLock("cron:lead-followups", 300);
    if (!lock.acquired) {
      return NextResponse.json({ ok: true, skipped: true, reason: "job already running" });
    }
    try {
      return await runFollowups();
    } finally {
      await releaseCronLock("cron:lead-followups", lock.ownerToken);
    }
  } catch (error) {
    console.error("cron lead-followups:", error);
    return NextResponse.json({ ok: false, message: "Erreur serveur." }, { status: 500 });
  }
}
