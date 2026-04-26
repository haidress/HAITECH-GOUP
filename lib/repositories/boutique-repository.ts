import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";

export type BoutiqueProduct = {
  id: number;
  slug: string;
  name: string;
  short_description: string | null;
  long_description: string | null;
  category: string;
  brand: string | null;
  product_condition: "neuf" | "reconditionne";
  image_url: string | null;
  gallery_json: string | null;
  base_price: number;
  initial_price: number | null;
  promo_price: number | null;
  promo_start_at: string | null;
  promo_end_at: string | null;
  stock: number;
  low_stock_threshold: number;
  allow_backorder: 0 | 1;
  warranty_months: number | null;
  is_published: 0 | 1;
  views_count: number;
  sales_count: number;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
};

export type BoutiqueProductFilters = {
  query?: string;
  category?: string;
  brand?: string;
  condition?: "neuf" | "reconditionne";
  inStockOnly?: boolean;
  promoOnly?: boolean;
  priceMin?: number;
  priceMax?: number;
  sort?: "popularity" | "newest" | "price_asc" | "price_desc" | "discount_desc";
};

export function computeActivePrice(row: Pick<BoutiqueProduct, "base_price" | "promo_price" | "promo_start_at" | "promo_end_at">) {
  const now = Date.now();
  const start = row.promo_start_at ? new Date(row.promo_start_at).getTime() : null;
  const end = row.promo_end_at ? new Date(row.promo_end_at).getTime() : null;
  const promoWindowOk = (!!row.promo_price && (start == null || start <= now) && (end == null || end >= now));
  return promoWindowOk ? Number(row.promo_price) : Number(row.base_price);
}

export async function listPublishedBoutiqueProducts(filters: BoutiqueProductFilters): Promise<BoutiqueProduct[]> {
  const pool = getDbPool();
  const conditions = ["is_published = 1"] as string[];
  const values: Array<string | number> = [];

  if (filters.query) {
    conditions.push("(name LIKE ? OR short_description LIKE ? OR long_description LIKE ?)");
    const q = `%${filters.query}%`;
    values.push(q, q, q);
  }
  if (filters.category) {
    conditions.push("category = ?");
    values.push(filters.category);
  }
  if (filters.brand) {
    conditions.push("brand = ?");
    values.push(filters.brand);
  }
  if (filters.condition) {
    conditions.push("product_condition = ?");
    values.push(filters.condition);
  }
  if (filters.inStockOnly) {
    conditions.push("(stock > 0 OR allow_backorder = 1)");
  }
  if (filters.promoOnly) {
    conditions.push("promo_price IS NOT NULL");
    conditions.push("(promo_start_at IS NULL OR promo_start_at <= NOW())");
    conditions.push("(promo_end_at IS NULL OR promo_end_at >= NOW())");
  }
  if (typeof filters.priceMin === "number") {
    conditions.push("(COALESCE(promo_price, base_price) >= ?)");
    values.push(filters.priceMin);
  }
  if (typeof filters.priceMax === "number") {
    conditions.push("(COALESCE(promo_price, base_price) <= ?)");
    values.push(filters.priceMax);
  }

  let orderBy = "created_at DESC";
  if (filters.sort === "popularity") orderBy = "sales_count DESC, views_count DESC, created_at DESC";
  if (filters.sort === "price_asc") orderBy = "COALESCE(promo_price, base_price) ASC, created_at DESC";
  if (filters.sort === "price_desc") orderBy = "COALESCE(promo_price, base_price) DESC, created_at DESC";
  if (filters.sort === "discount_desc") orderBy = "(COALESCE(initial_price, base_price) - COALESCE(promo_price, base_price)) DESC, created_at DESC";

  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT *
    FROM boutique_products
    WHERE ${conditions.join(" AND ")}
    ORDER BY ${orderBy}
    LIMIT 200
    `,
    values
  );
  return rows as unknown as BoutiqueProduct[];
}

export async function getPublishedBoutiqueProductBySlug(slug: string): Promise<BoutiqueProduct | null> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT *
    FROM boutique_products
    WHERE slug = ? AND is_published = 1
    LIMIT 1
    `,
    [slug]
  );
  if (!rows.length) return null;
  return rows[0] as unknown as BoutiqueProduct;
}

export async function listPublishedBoutiqueProductSlugs(): Promise<Array<{ slug: string; updated_at: string }>> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT slug, updated_at
    FROM boutique_products
    WHERE is_published = 1
    ORDER BY updated_at DESC
    `
  );
  return rows as Array<{ slug: string; updated_at: string }>;
}
