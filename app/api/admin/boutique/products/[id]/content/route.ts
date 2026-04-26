import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { z } from "zod";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";

const contentSchema = z.object({
  variants: z
    .array(
      z.object({
        sku: z.string().min(2).max(120),
        name: z.string().min(2).max(190),
        attributes_json: z.string().max(20000),
        price: z.coerce.number().min(0),
        initial_price: z.coerce.number().min(0).optional().nullable(),
        stock: z.coerce.number().int().min(0)
      })
    )
    .default([]),
  specs: z
    .array(
      z.object({
        spec_key: z.string().min(1).max(120),
        spec_value: z.string().min(1).max(320)
      })
    )
    .default([]),
  faqs: z
    .array(
      z.object({
        question: z.string().min(2).max(320),
        answer: z.string().min(2).max(4000)
      })
    )
    .default([])
});

function parseId(idRaw: string) {
  const id = Number(idRaw);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function GET(
  _request: Request,
  context: {
    params: { id: string };
  }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  const productId = parseId(context.params.id);
  if (!productId) return NextResponse.json({ success: false, message: "Identifiant invalide." }, { status: 400 });

  try {
    const pool = getDbPool();
    const [variants] = await pool.query<RowDataPacket[]>(
      "SELECT id, sku, name, attributes_json, price, initial_price, stock, is_active FROM boutique_product_variants WHERE product_id = ? ORDER BY id ASC",
      [productId]
    );
    const [specs] = await pool.query<RowDataPacket[]>(
      "SELECT id, spec_key, spec_value, sort_order FROM boutique_product_specs WHERE product_id = ? ORDER BY sort_order ASC, id ASC",
      [productId]
    );
    const [faqs] = await pool.query<RowDataPacket[]>(
      "SELECT id, question, answer, sort_order FROM boutique_product_faqs WHERE product_id = ? ORDER BY sort_order ASC, id ASC",
      [productId]
    );
    const [reviews] = await pool.query<RowDataPacket[]>(
      "SELECT id, author_name, rating, comment, is_approved, created_at FROM boutique_product_reviews WHERE product_id = ? ORDER BY created_at DESC",
      [productId]
    );
    return NextResponse.json({ success: true, data: { variants, specs, faqs, reviews } });
  } catch (error) {
    console.error("Erreur GET /api/admin/boutique/products/[id]/content:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function PUT(
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
  const productId = parseId(context.params.id);
  if (!productId) return NextResponse.json({ success: false, message: "Identifiant invalide." }, { status: 400 });

  try {
    const parsed = contentSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides.", errors: parsed.error.flatten() }, { status: 400 });
    }
    const { variants, specs, faqs } = parsed.data;
    const pool = getDbPool();
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute("DELETE FROM boutique_product_variants WHERE product_id = ?", [productId]);
      await conn.execute("DELETE FROM boutique_product_specs WHERE product_id = ?", [productId]);
      await conn.execute("DELETE FROM boutique_product_faqs WHERE product_id = ?", [productId]);

      for (const variant of variants) {
        await conn.execute(
          `
          INSERT INTO boutique_product_variants (product_id, sku, name, attributes_json, price, initial_price, stock, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, 1)
          `,
          [productId, variant.sku, variant.name, variant.attributes_json, variant.price, variant.initial_price ?? null, variant.stock]
        );
      }
      let i = 0;
      for (const spec of specs) {
        await conn.execute(
          "INSERT INTO boutique_product_specs (product_id, spec_key, spec_value, sort_order) VALUES (?, ?, ?, ?)",
          [productId, spec.spec_key, spec.spec_value, i++]
        );
      }
      i = 0;
      for (const faq of faqs) {
        await conn.execute(
          "INSERT INTO boutique_product_faqs (product_id, question, answer, sort_order) VALUES (?, ?, ?, ?)",
          [productId, faq.question, faq.answer, i++]
        );
      }

      await conn.commit();
      return NextResponse.json({ success: true });
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Erreur PUT /api/admin/boutique/products/[id]/content:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
