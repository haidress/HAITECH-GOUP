import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import * as XLSX from "xlsx";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  try {
    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT
        id, slug, name, category, brand, product_condition, base_price, initial_price,
        promo_price, promo_start_at, promo_end_at, stock, low_stock_threshold, allow_backorder,
        is_published, created_at, updated_at
      FROM boutique_products
      ORDER BY created_at DESC
      `
    );
    const worksheet = XLSX.utils.json_to_sheet(rows as unknown as Record<string, unknown>[]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Boutique IT");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="boutique-products.xlsx"'
      }
    });
  } catch (error) {
    console.error("Erreur GET /api/admin/boutique/products/export/xlsx:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
