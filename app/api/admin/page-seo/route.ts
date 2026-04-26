import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";
import { listAllPageSeo, upsertPageSeo } from "@/lib/repositories/page-seo-repository";

const rowSchema = z.object({
  path: z.string().trim().min(1).max(190),
  meta_title: z.string().trim().min(3).max(255),
  meta_description: z.string().trim().min(8).max(500),
  og_title: z.string().trim().max(255).nullable().optional(),
  og_description: z.string().trim().max(500).nullable().optional(),
  og_image_path: z.string().trim().max(255).nullable().optional()
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  try {
    const data = await listAllPageSeo();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET page-seo:", error);
    const message =
      error instanceof Error && /Unknown table|ER_NO_SUCH_TABLE|doesn.*exist/i.test(error.message)
        ? "Table site_page_seo absente : exécutez la migration 012_marketing_seo_leads_crm.sql."
        : "Erreur serveur.";
    return NextResponse.json({ success: false, message }, { status: 500 });
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
    const parsed = rowSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
    }
    await upsertPageSeo({
      path: parsed.data.path.startsWith("/") ? parsed.data.path : `/${parsed.data.path}`,
      meta_title: parsed.data.meta_title,
      meta_description: parsed.data.meta_description,
      og_title: parsed.data.og_title ?? null,
      og_description: parsed.data.og_description ?? null,
      og_image_path: parsed.data.og_image_path ?? null
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT page-seo:", error);
    return NextResponse.json({ success: false, message: "Erreur lors de la sauvegarde." }, { status: 500 });
  }
}
