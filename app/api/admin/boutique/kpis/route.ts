import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  try {
    const pool = getDbPool();
    const [productsRows] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS total, SUM(CASE WHEN is_published = 1 THEN 1 ELSE 0 END) AS published FROM boutique_products"
    );
    const [stockRows] = await pool.query<RowDataPacket[]>(
      "SELECT SUM(CASE WHEN stock <= low_stock_threshold THEN 1 ELSE 0 END) AS low_stock, SUM(CASE WHEN stock <= 0 THEN 1 ELSE 0 END) AS out_of_stock FROM boutique_products"
    );
    const [salesRows] = await pool.query<RowDataPacket[]>(
      "SELECT IFNULL(SUM(sales_count), 0) AS sales, IFNULL(SUM(views_count), 0) AS views FROM boutique_products"
    );
    const [topCategories] = await pool.query<RowDataPacket[]>(
      "SELECT category, COUNT(*) AS total FROM boutique_products GROUP BY category ORDER BY total DESC LIMIT 5"
    );
    const [topProducts] = await pool.query<RowDataPacket[]>(
      "SELECT name, sales_count, views_count FROM boutique_products ORDER BY sales_count DESC, views_count DESC LIMIT 5"
    );

    return NextResponse.json({
      success: true,
      data: {
        total_products: Number(productsRows[0]?.total ?? 0),
        published_products: Number(productsRows[0]?.published ?? 0),
        low_stock_products: Number(stockRows[0]?.low_stock ?? 0),
        out_of_stock_products: Number(stockRows[0]?.out_of_stock ?? 0),
        sales_count: Number(salesRows[0]?.sales ?? 0),
        views_count: Number(salesRows[0]?.views ?? 0),
        top_categories: topCategories,
        top_products: topProducts
      }
    });
  } catch (error) {
    console.error("Erreur GET /api/admin/boutique/kpis:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
