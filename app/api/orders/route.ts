import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { getDbPool } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { ensureSameOrigin } from "@/lib/request-security";

const createOrderSchema = z.object({
  sourceType: z.enum(["business_center", "boutique_it", "formation", "services_it"]),
  productName: z.string().min(2).max(190),
  amount: z.coerce.number().min(0),
  nom: z.string().min(2).max(120),
  contact: z.string().min(5).max(40),
  email: z.string().email().max(190)
});

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;

  const rate = checkRateLimit(request, "public-orders", 8, 60_000);
  if (!rate.ok) {
    return NextResponse.json(
      { success: false, message: `Trop de commandes envoyées. Réessayez dans ${rate.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    const payload = await request.json();
    const parsed = createOrderSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Informations invalides." }, { status: 400 });
    }

    const data = parsed.data;
    const pool = getDbPool();
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
      [referenceCode, data.sourceType, data.productName, data.amount, data.nom, data.contact, data.email.toLowerCase()]
    );

    return NextResponse.json({
      success: true,
      message: "Commande enregistrée.",
      orderId: (result as { insertId: number }).insertId,
      referenceCode
    });
  } catch (error) {
    console.error("Erreur POST /api/orders:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
