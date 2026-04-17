import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { z } from "zod";
import { getDbPool } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { ensureSameOrigin } from "@/lib/request-security";

const schema = z.object({
  referenceCode: z.string().trim().min(5).max(50),
  email: z.string().email()
});

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;

  const rate = checkRateLimit(request, "orders-track", 12, 60_000);
  if (!rate.ok) {
    return NextResponse.json(
      { success: false, message: `Trop de tentatives. Réessayez dans ${rate.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    const payload = await request.json();
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Informations invalides." }, { status: 400 });
    }

    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT id, reference_code, source_type, product_name, amount, status, created_at, last_status_at
      FROM customer_orders
      WHERE reference_code = ? AND email = ?
      LIMIT 1
      `,
      [parsed.data.referenceCode.toUpperCase(), parsed.data.email.toLowerCase()]
    );

    if (!rows.length) {
      return NextResponse.json({ success: false, message: "Commande introuvable." }, { status: 404 });
    }

    const order = rows[0];
    const [notes] = await pool.query<RowDataPacket[]>(
      `
      SELECT note, action_type, created_at
      FROM order_notes
      WHERE order_id = ?
      ORDER BY created_at DESC
      LIMIT 10
      `,
      [order.id]
    );

    return NextResponse.json({
      success: true,
      data: {
        referenceCode: order.reference_code,
        sourceType: order.source_type,
        productName: order.product_name,
        amount: Number(order.amount),
        status: order.status,
        createdAt: order.created_at,
        lastStatusAt: order.last_status_at,
        history: notes
      }
    });
  } catch (error) {
    console.error("Erreur POST /api/orders/track:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
