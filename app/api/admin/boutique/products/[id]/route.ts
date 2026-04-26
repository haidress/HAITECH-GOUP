import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { getCurrentUser } from "@/lib/auth";
import { ensureSameOrigin } from "@/lib/request-security";
import { hasPermission } from "@/lib/permissions";

const patchSchema = z.object({
  name: z.string().min(2).max(190).optional(),
  short_description: z.string().max(2000).optional().nullable(),
  long_description: z.string().max(30000).optional().nullable(),
  category: z.string().min(2).max(120).optional(),
  brand: z.string().max(120).optional().nullable(),
  product_condition: z.enum(["neuf", "reconditionne"]).optional(),
  image_url: z.string().max(500).optional().nullable(),
  gallery_json: z.string().max(30000).optional().nullable(),
  base_price: z.coerce.number().min(0).optional(),
  initial_price: z.coerce.number().min(0).optional().nullable(),
  promo_price: z.coerce.number().min(0).optional().nullable(),
  promo_start_at: z.string().optional().nullable(),
  promo_end_at: z.string().optional().nullable(),
  stock: z.coerce.number().int().min(0).optional(),
  low_stock_threshold: z.coerce.number().int().min(0).optional(),
  allow_backorder: z.boolean().optional(),
  warranty_months: z.coerce.number().int().min(0).optional().nullable(),
  is_published: z.boolean().optional(),
  seo_title: z.string().max(220).optional().nullable(),
  seo_description: z.string().max(320).optional().nullable(),
  canonical_url: z.string().max(500).optional().nullable()
});

function parseId(idRaw: string) {
  const id = Number(idRaw);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function PATCH(
  request: Request,
  context: {
    params: { id: string };
  }
) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  if (!(await hasPermission("catalog.manage"))) {
    return NextResponse.json({ success: false, message: "Permission insuffisante." }, { status: 403 });
  }
  const id = parseId(context.params.id);
  if (!id) return NextResponse.json({ success: false, message: "Identifiant invalide." }, { status: 400 });

  try {
    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides.", errors: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const entries = Object.entries(data);
    if (!entries.length) return NextResponse.json({ success: true });

    const user = await getCurrentUser();
    const sets = entries.map(([key]) => `${key} = ?`);
    const values = entries.map(([_, value]) => (typeof value === "boolean" ? (value ? 1 : 0) : value));

    const pool = getDbPool();
    await pool.execute(`UPDATE boutique_products SET ${sets.join(", ")}, updated_by = ? WHERE id = ?`, [...values, user?.id ?? null, id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur PATCH /api/admin/boutique/products/[id]:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
