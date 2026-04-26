import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getDbPool();
    const [coupons] = await pool.query<RowDataPacket[]>(
      `
      SELECT id, code, discount_type, discount_value, starts_at, ends_at
      FROM boutique_coupons
      WHERE is_active = 1
        AND (starts_at IS NULL OR starts_at <= NOW())
        AND (ends_at IS NULL OR ends_at >= NOW())
        AND (max_uses IS NULL OR uses_count < max_uses)
      ORDER BY id DESC
      LIMIT 20
      `
    );
    const [bundles] = await pool.query<RowDataPacket[]>(
      `
      SELECT id, name, discount_type, discount_value
      FROM boutique_bundles
      WHERE is_active = 1
      ORDER BY id DESC
      LIMIT 20
      `
    );
    return NextResponse.json({ success: true, data: { coupons, bundles } });
  } catch (error) {
    console.error("Erreur GET /api/boutique/offers:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
