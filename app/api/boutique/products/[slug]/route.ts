import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { computeActivePrice, getPublishedBoutiqueProductBySlug } from "@/lib/repositories/boutique-repository";

export async function GET(
  _request: Request,
  context: {
    params: { slug: string };
  }
) {
  try {
    const product = await getPublishedBoutiqueProductBySlug(context.params.slug);
    if (!product) return NextResponse.json({ success: false, message: "Produit introuvable." }, { status: 404 });

    const pool = getDbPool();
    await pool.execute("UPDATE boutique_products SET views_count = views_count + 1 WHERE id = ?", [product.id]);

    const [specs] = await pool.query<RowDataPacket[]>(
      "SELECT spec_key, spec_value FROM boutique_product_specs WHERE product_id = ? ORDER BY sort_order ASC, id ASC",
      [product.id]
    );
    const [faqs] = await pool.query<RowDataPacket[]>(
      "SELECT question, answer FROM boutique_product_faqs WHERE product_id = ? ORDER BY sort_order ASC, id ASC",
      [product.id]
    );
    const [reviews] = await pool.query<RowDataPacket[]>(
      "SELECT author_name, rating, comment, created_at FROM boutique_product_reviews WHERE product_id = ? AND is_approved = 1 ORDER BY created_at DESC LIMIT 20",
      [product.id]
    );
    const [similar] = await pool.query<RowDataPacket[]>(
      `
      SELECT id, slug, name, image_url, category, base_price, initial_price, promo_price, promo_start_at, promo_end_at
      FROM boutique_products
      WHERE id <> ? AND is_published = 1 AND category = ?
      ORDER BY sales_count DESC, created_at DESC
      LIMIT 4
      `,
      [product.id, product.category]
    );

    const enriched = {
      ...product,
      active_price: computeActivePrice(product),
      in_promo: product.promo_price != null && computeActivePrice(product) < Number(product.base_price),
      stock_state: product.stock <= 0 ? "rupture" : product.stock <= product.low_stock_threshold ? "faible" : "ok",
      specs,
      faqs,
      reviews,
      similar: similar.map((s) => ({
        ...s,
        active_price: computeActivePrice(s as never)
      }))
    };
    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    console.error("Erreur GET /api/boutique/products/[slug]:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
