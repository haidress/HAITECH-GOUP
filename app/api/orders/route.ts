import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { getDbPool } from "@/lib/db";
import { checkRateLimitSmart } from "@/lib/rate-limit";
import { ensureSameOrigin } from "@/lib/request-security";
import { computeOrderAmountWithOffers } from "@/lib/boutique-order-pricing";
import { incrementMetric, logApiCompletion, nowMs } from "@/lib/observability";

const createOrderSchema = z.object({
  sourceType: z.enum(["business_center", "boutique_it", "formation", "services_it"]),
  productName: z.string().min(2).max(190),
  amount: z.coerce.number().min(0),
  couponCode: z.string().max(80).optional(),
  bundleId: z.coerce.number().int().positive().optional(),
  nom: z.string().min(2).max(120),
  contact: z.string().min(5).max(40),
  email: z.string().email().max(190)
});

export async function POST(request: Request) {
  const startedAt = nowMs();
  incrementMetric("api_requests_total");
  const originGuard = ensureSameOrigin(request);
  if (originGuard) {
    logApiCompletion({ route: "/api/orders", method: "POST", status: originGuard.status, startedAt });
    return originGuard;
  }

  const rate = await checkRateLimitSmart(request, "public-orders", 8, 60_000);
  if (!rate.ok) {
    incrementMetric("api_errors_total");
    logApiCompletion({ route: "/api/orders", method: "POST", status: 429, startedAt });
    return NextResponse.json(
      { success: false, message: `Trop de commandes envoyées. Réessayez dans ${rate.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    const payload = await request.json();
    const parsed = createOrderSchema.safeParse(payload);
    if (!parsed.success) {
      incrementMetric("api_errors_total");
      logApiCompletion({ route: "/api/orders", method: "POST", status: 400, startedAt });
      return NextResponse.json({ success: false, message: "Informations invalides." }, { status: 400 });
    }

    const data = parsed.data;
    const pool = getDbPool();
    let coupon:
      | {
          code: string;
          discount_type: "fixed" | "percent";
          discount_value: number;
          id: number;
        }
      | null = null;
    let bundle:
      | {
          id: number;
          name: string;
          discount_type: "fixed" | "percent";
          discount_value: number;
        }
      | null = null;

    if (data.sourceType === "boutique_it" && data.couponCode) {
      const [rows] = await pool.query(
        `
        SELECT id, code, discount_type, discount_value
        FROM boutique_coupons
        WHERE code = ?
          AND is_active = 1
          AND (starts_at IS NULL OR starts_at <= NOW())
          AND (ends_at IS NULL OR ends_at >= NOW())
          AND (max_uses IS NULL OR uses_count < max_uses)
        LIMIT 1
        `,
        [data.couponCode.trim().toUpperCase()]
      );
      if (Array.isArray(rows) && rows.length > 0) {
        const row = rows[0] as {
          id: number;
          code: string;
          discount_type: "fixed" | "percent";
          discount_value: number;
        };
        coupon = {
          id: Number(row.id),
          code: String(row.code),
          discount_type: row.discount_type,
          discount_value: Number(row.discount_value)
        };
      }
    }

    if (data.sourceType === "boutique_it" && data.bundleId) {
      const [rows] = await pool.query(
        `
        SELECT id, name, discount_type, discount_value
        FROM boutique_bundles
        WHERE id = ? AND is_active = 1
        LIMIT 1
        `,
        [data.bundleId]
      );
      if (Array.isArray(rows) && rows.length > 0) {
        const row = rows[0] as {
          id: number;
          name: string;
          discount_type: "fixed" | "percent";
          discount_value: number;
        };
        bundle = {
          id: Number(row.id),
          name: String(row.name),
          discount_type: row.discount_type,
          discount_value: Number(row.discount_value)
        };
      }
    }

    const priceResult = computeOrderAmountWithOffers({
      baseAmount: data.amount,
      coupon,
      bundle
    });
    const finalProductName = [data.productName, ...priceResult.notes].join(" | ");

    const referenceCode = `CMD-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
    const [result] = await pool.execute(
      `
      INSERT INTO customer_orders (
        reference_code,
        source_type,
        product_name,
        amount,
        nom,
        contact,
        email,
        status,
        last_status_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'nouvelle', NOW())
      `,
      [referenceCode, data.sourceType, finalProductName, priceResult.finalAmount, data.nom, data.contact, data.email.toLowerCase()]
    );

    if (coupon) {
      await pool.execute("UPDATE boutique_coupons SET uses_count = uses_count + 1 WHERE id = ?", [coupon.id]);
    }

    logApiCompletion({ route: "/api/orders", method: "POST", status: 200, startedAt });
    return NextResponse.json({
      success: true,
      message: "Commande enregistrée.",
      orderId: (result as { insertId: number }).insertId,
      referenceCode
    });
  } catch (error) {
    console.error("Erreur POST /api/orders:", error);
    incrementMetric("api_errors_total");
    logApiCompletion({ route: "/api/orders", method: "POST", status: 500, startedAt });
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
