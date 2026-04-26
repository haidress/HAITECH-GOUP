import { NextResponse } from "next/server";
import { z } from "zod";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { getCurrentUser } from "@/lib/auth";
import { ensureSameOrigin } from "@/lib/request-security";
import { hasPermission } from "@/lib/permissions";

const productSchema = z.object({
  slug: z.string().min(3).max(220),
  name: z.string().min(2).max(190),
  short_description: z.string().max(2000).optional().nullable(),
  long_description: z.string().max(30000).optional().nullable(),
  category: z.string().min(2).max(120),
  brand: z.string().max(120).optional().nullable(),
  product_condition: z.enum(["neuf", "reconditionne"]).default("neuf"),
  image_url: z.string().max(500).optional().nullable(),
  gallery_json: z.string().max(30000).optional().nullable(),
  base_price: z.coerce.number().min(0),
  initial_price: z.coerce.number().min(0).optional().nullable(),
  promo_price: z.coerce.number().min(0).optional().nullable(),
  promo_start_at: z.string().optional().nullable(),
  promo_end_at: z.string().optional().nullable(),
  stock: z.coerce.number().int().min(0).default(0),
  low_stock_threshold: z.coerce.number().int().min(0).default(5),
  allow_backorder: z.boolean().default(false),
  warranty_months: z.coerce.number().int().min(0).optional().nullable(),
  is_published: z.boolean().default(true),
  seo_title: z.string().max(220).optional().nullable(),
  seo_description: z.string().max(320).optional().nullable(),
  canonical_url: z.string().max(500).optional().nullable()
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  if (!(await hasPermission("catalog.manage"))) {
    return NextResponse.json({ success: false, message: "Permission insuffisante." }, { status: 403 });
  }
  try {
    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM boutique_products ORDER BY created_at DESC LIMIT 500");
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Erreur GET /api/admin/boutique/products:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  if (!(await hasPermission("catalog.manage"))) {
    return NextResponse.json({ success: false, message: "Permission insuffisante." }, { status: 403 });
  }
  try {
    const payload = await request.json();
    const parsed = productSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides.", errors: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const user = await getCurrentUser();
    const pool = getDbPool();
    const [res] = await pool.execute(
      `
      INSERT INTO boutique_products (
        slug, name, short_description, long_description, category, brand, product_condition,
        image_url, gallery_json, base_price, initial_price, promo_price, promo_start_at, promo_end_at,
        stock, low_stock_threshold, allow_backorder, warranty_months, is_published,
        seo_title, seo_description, canonical_url, created_by, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.slug,
        data.name,
        data.short_description ?? null,
        data.long_description ?? null,
        data.category,
        data.brand ?? null,
        data.product_condition,
        data.image_url ?? null,
        data.gallery_json ?? null,
        data.base_price,
        data.initial_price ?? null,
        data.promo_price ?? null,
        data.promo_start_at ?? null,
        data.promo_end_at ?? null,
        data.stock,
        data.low_stock_threshold,
        data.allow_backorder ? 1 : 0,
        data.warranty_months ?? null,
        data.is_published ? 1 : 0,
        data.seo_title ?? null,
        data.seo_description ?? null,
        data.canonical_url ?? null,
        user?.id ?? null,
        user?.id ?? null
      ]
    );
    return NextResponse.json({ success: true, id: (res as { insertId: number }).insertId });
  } catch (error) {
    console.error("Erreur POST /api/admin/boutique/products:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
