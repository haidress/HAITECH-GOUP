import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";
import { fetchPublicItCatalog, saveItCatalog, type ItCatalogPayload } from "@/lib/repositories/it-catalog-repository";

const serviceLineSchema = z.object({
  icon: z.string().max(32),
  title: z.string().max(200),
  desc: z.string().max(8000),
  cta: z.string().max(200)
});

const tierSchema = z.object({
  name: z.string().max(120),
  audience: z.string().max(200),
  fromPricePerPosteFcfa: z.number().int().nonnegative(),
  highlights: z.array(z.string().max(400)).max(30),
  sla: z.string().max(400)
});

const packSchema = z.object({
  title: z.string().max(200),
  badge: z.string().max(120).optional().default(""),
  subtitle: z.string().max(200),
  audience: z.string().max(200),
  items: z.array(z.string().max(500)).max(50),
  fromPriceFcfa: z.number().int().nonnegative().optional()
});

const catalogSchema = z.object({
  serviceLines: z.array(serviceLineSchema).min(1).max(40),
  managedTiers: z.array(tierSchema).min(1).max(15),
  packs: z.array(packSchema).min(1).max(60),
  addons: z.array(z.string().max(400)).max(80)
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  try {
    const data = await fetchPublicItCatalog();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/admin/it-catalog:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = catalogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
    }
    const payload: ItCatalogPayload = {
      serviceLines: parsed.data.serviceLines,
      managedTiers: parsed.data.managedTiers,
      packs: parsed.data.packs.map((p) => ({
        title: p.title,
        badge: p.badge ?? "",
        subtitle: p.subtitle,
        audience: p.audience,
        items: p.items,
        fromPriceFcfa: p.fromPriceFcfa
      })),
      addons: parsed.data.addons
    };
    await saveItCatalog(payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/admin/it-catalog:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error && /doesn.*exist|Unknown table|ER_NO_SUCH_TABLE/i.test(error.message)
            ? "Tables catalogue absentes : exécutez la migration 009_it_public_catalog.sql (npm run migrate)."
            : "Erreur lors de la sauvegarde."
      },
      { status: 500 }
    );
  }
}
