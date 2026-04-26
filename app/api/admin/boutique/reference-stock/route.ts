import { NextResponse } from "next/server";
import { z } from "zod";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { hasPermission } from "@/lib/permissions";
import { ensureSameOrigin } from "@/lib/request-security";
import { boutiqueItValidatedCatalog } from "@/lib/boutique-it-validated-catalog";

const patchSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.coerce.number().int(),
        quantity: z.coerce.number().int().min(0)
      })
    )
    .max(600)
});

const validCatalogIds = new Set(boutiqueItValidatedCatalog.map((p) => p.id));

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  if (!(await hasPermission("catalog.manage"))) {
    return NextResponse.json({ success: false, message: "Permission insuffisante." }, { status: 403 });
  }
  try {
    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>("SELECT product_id, quantity FROM boutique_reference_stock");
    const stock: Record<string, number> = {};
    for (const r of rows as RowDataPacket[]) {
      stock[String(r.product_id)] = Number(r.quantity);
    }
    const products = boutiqueItValidatedCatalog.map(({ id, name, category }) => ({ id, name, category }));
    return NextResponse.json({ success: true, data: { products, stock } });
  } catch (error) {
    console.error("GET /api/admin/boutique/reference-stock:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  if (!(await hasPermission("catalog.manage"))) {
    return NextResponse.json({ success: false, message: "Permission insuffisante." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "JSON invalide." }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });
  }

  for (const row of parsed.data.items) {
    if (!validCatalogIds.has(row.product_id)) {
      return NextResponse.json({ success: false, message: `ID inconnu : ${row.product_id}` }, { status: 400 });
    }
  }

  const pool = getDbPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const { product_id, quantity } of parsed.data.items) {
      await conn.execute(
        "INSERT INTO boutique_reference_stock (product_id, quantity) VALUES (?, ?) ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)",
        [product_id, quantity]
      );
    }
    await conn.commit();
    return NextResponse.json({ success: true, message: "Stock enregistré." });
  } catch (error) {
    await conn.rollback();
    console.error("PATCH /api/admin/boutique/reference-stock:", error);
    return NextResponse.json({ success: false, message: "Erreur sauvegarde." }, { status: 500 });
  } finally {
    conn.release();
  }
}
