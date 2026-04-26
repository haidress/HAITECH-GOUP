import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { getCurrentUser } from "@/lib/auth";
import { ensureSameOrigin } from "@/lib/request-security";

type Row = {
  slug?: string;
  name?: string;
  category?: string;
  base_price?: number;
  stock?: number;
  low_stock_threshold?: number;
  is_published?: number | boolean;
  brand?: string;
  product_condition?: "neuf" | "reconditionne";
};

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: "Fichier manquant." }, { status: 400 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(bytes, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Row>(sheet);
    if (!rows.length) {
      return NextResponse.json({ success: false, message: "Fichier vide." }, { status: 400 });
    }

    const user = await getCurrentUser();
    const pool = getDbPool();
    let imported = 0;
    for (const row of rows) {
      const slug = String(row.slug ?? "").trim();
      const name = String(row.name ?? "").trim();
      const category = String(row.category ?? "").trim();
      if (!slug || !name || !category) continue;
      const basePrice = Number(row.base_price ?? 0);
      const stock = Number(row.stock ?? 0);
      const low = Number(row.low_stock_threshold ?? 5);
      const brand = row.brand ? String(row.brand) : null;
      const condition = row.product_condition === "reconditionne" ? "reconditionne" : "neuf";
      const published = row.is_published === 0 || row.is_published === false ? 0 : 1;

      await pool.execute(
        `
        INSERT INTO boutique_products (
          slug, name, category, base_price, stock, low_stock_threshold, is_published, brand, product_condition, created_by, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          category = VALUES(category),
          base_price = VALUES(base_price),
          stock = VALUES(stock),
          low_stock_threshold = VALUES(low_stock_threshold),
          is_published = VALUES(is_published),
          brand = VALUES(brand),
          product_condition = VALUES(product_condition),
          updated_by = VALUES(updated_by)
        `,
        [slug, name, category, basePrice, stock, low, published, brand, condition, user?.id ?? null, user?.id ?? null]
      );
      imported += 1;
    }

    return NextResponse.json({ success: true, message: `${imported} produit(s) importé(s).` });
  } catch (error) {
    console.error("Erreur POST /api/admin/boutique/products/import:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
