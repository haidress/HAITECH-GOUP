import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { verifyCronRequest } from "@/lib/cron-auth";
import { getDbPool } from "@/lib/db";
import { sendOrderRelanceEmail } from "@/lib/email";
import { sendWhatsAppNotification } from "@/lib/notifications";
import { acquireCronLock, releaseCronLock } from "@/lib/cron-lock";

async function processDayMark(dayMark: number) {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT o.id, o.reference_code, o.product_name, o.email, o.contact
    FROM customer_orders o
    WHERE o.created_at <= DATE_SUB(NOW(), INTERVAL ? DAY)
      AND o.status IN ('nouvelle', 'en_cours', 'en_attente_client')
      AND NOT EXISTS (
        SELECT 1
        FROM order_followup_logs l
        WHERE l.order_id = o.id
          AND l.day_mark = ?
          AND l.channel = 'email'
      )
    ORDER BY o.created_at ASC
    LIMIT 100
    `,
    [dayMark, dayMark]
  );

  let sent = 0;
  let skipped = 0;
  for (const row of rows as Array<{ id: number; reference_code: string; product_name: string; email: string; contact: string }>) {
    try {
      const [emailClaim] = await pool.execute(
        "INSERT IGNORE INTO order_followup_logs (order_id, day_mark, channel, status, details_json) VALUES (?, ?, 'email', 'skipped', ?)",
        [row.id, dayMark, JSON.stringify({ phase: "claimed-before-send" })]
      );
      const emailClaimResult = emailClaim as { affectedRows?: number };
      if (!emailClaimResult.affectedRows) {
        skipped += 1;
        continue;
      }

      const emailResult = await sendOrderRelanceEmail({
        to: row.email,
        referenceCode: row.reference_code,
        productName: row.product_name,
        dayMark
      });
      await pool.execute(
        "UPDATE order_followup_logs SET status = ?, details_json = ? WHERE order_id = ? AND day_mark = ? AND channel = 'email'",
        [emailResult.delivered ? "sent" : "skipped", JSON.stringify(emailResult), row.id, dayMark]
      );

      const [waClaim] = await pool.execute(
        "INSERT IGNORE INTO order_followup_logs (order_id, day_mark, channel, status, details_json) VALUES (?, ?, 'whatsapp', 'skipped', ?)",
        [row.id, dayMark, JSON.stringify({ phase: "claimed-before-send" })]
      );
      const waClaimResult = waClaim as { affectedRows?: number };
      if (!waClaimResult.affectedRows) {
        sent += 1;
        continue;
      }

      const waResult = await sendWhatsAppNotification({
        to: row.contact,
        message: `Relance HAITECH J+${dayMark}: commande ${row.reference_code} (${row.product_name}). Nous restons disponibles.`,
        eventType: "order_followup"
      });
      await pool.execute(
        "UPDATE order_followup_logs SET status = ?, details_json = ? WHERE order_id = ? AND day_mark = ? AND channel = 'whatsapp'",
        [waResult.sent ? "sent" : "skipped", JSON.stringify(waResult), row.id, dayMark]
      );
      sent += 1;
    } catch (error) {
      skipped += 1;
      await pool.execute(
        "UPDATE order_followup_logs SET status = 'error', details_json = ? WHERE order_id = ? AND day_mark = ? AND channel = 'email'",
        [JSON.stringify({ error: String(error) }), row.id, dayMark]
      );
    }
  }

  return { dayMark, candidates: rows.length, sent, skipped };
}

async function run() {
  const j1 = await processDayMark(1);
  const j3 = await processDayMark(3);
  const j7 = await processDayMark(7);
  return NextResponse.json({ ok: true, results: [j1, j3, j7] });
}

export async function GET(request: Request) {
  const denied = verifyCronRequest(request);
  if (denied) return denied;
  try {
    const lock = await acquireCronLock("cron:orders-followups", 300);
    if (!lock.acquired) {
      return NextResponse.json({ ok: true, skipped: true, reason: "job already running" });
    }
    try {
      return await run();
    } finally {
      await releaseCronLock("cron:orders-followups", lock.ownerToken);
    }
  } catch (error) {
    console.error("cron orders-followups:", error);
    return NextResponse.json({ ok: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = verifyCronRequest(request);
  if (denied) return denied;
  try {
    const lock = await acquireCronLock("cron:orders-followups", 300);
    if (!lock.acquired) {
      return NextResponse.json({ ok: true, skipped: true, reason: "job already running" });
    }
    try {
      return await run();
    } finally {
      await releaseCronLock("cron:orders-followups", lock.ownerToken);
    }
  } catch (error) {
    console.error("cron orders-followups:", error);
    return NextResponse.json({ ok: false, message: "Erreur serveur." }, { status: 500 });
  }
}
