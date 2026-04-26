import { NextResponse } from "next/server";
import { listPublishedBoutiqueProducts, computeActivePrice } from "@/lib/repositories/boutique-repository";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") ?? undefined;
    const category = url.searchParams.get("category") ?? undefined;
    const brand = url.searchParams.get("brand") ?? undefined;
    const conditionRaw = url.searchParams.get("condition");
    const condition = conditionRaw === "neuf" || conditionRaw === "reconditionne" ? conditionRaw : undefined;
    const inStockOnly = url.searchParams.get("inStockOnly") === "1";
    const promoOnly = url.searchParams.get("promoOnly") === "1";
    const priceMin = url.searchParams.get("priceMin");
    const priceMax = url.searchParams.get("priceMax");
    const sortRaw = url.searchParams.get("sort");
    const sort =
      sortRaw === "popularity" ||
      sortRaw === "newest" ||
      sortRaw === "price_asc" ||
      sortRaw === "price_desc" ||
      sortRaw === "discount_desc"
        ? sortRaw
        : "newest";

    const products = await listPublishedBoutiqueProducts({
      query,
      category,
      brand,
      condition,
      inStockOnly,
      promoOnly,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      sort
    });

    const data = products.map((p) => ({
      ...p,
      active_price: computeActivePrice(p),
      in_promo: p.promo_price != null && computeActivePrice(p) < Number(p.base_price),
      stock_state: p.stock <= 0 ? "rupture" : p.stock <= p.low_stock_threshold ? "faible" : "ok"
    }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erreur GET /api/boutique/products:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
