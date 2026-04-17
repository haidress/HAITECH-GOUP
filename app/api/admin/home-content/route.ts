import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";
import { fetchPublicHomeContent, saveHomeContent, type HomePublicContent } from "@/lib/repositories/home-content-repository";

const schema = z.object({
  announcementTitle: z.string().max(200).nullable().optional(),
  announcementBody: z.string().max(2000).nullable().optional(),
  announcementCtaLabel: z.string().max(120).nullable().optional(),
  announcementCtaHref: z.string().max(600).nullable().optional(),
  announcementVisible: z.boolean().optional(),
  heroCtaPrimaryLabel: z.string().min(2).max(120).optional(),
  heroCtaPrimaryLabelB: z.string().min(2).max(120).optional(),
  homeExperimentVariant: z.enum(["A", "B"]).optional(),
  lastSiteUpdateLabel: z.string().max(160).nullable().optional()
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  try {
    const data = await fetchPublicHomeContent();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/admin/home-content:", error);
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
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
    }
    const current = await fetchPublicHomeContent();
    const merged: HomePublicContent = {
      announcementTitle: parsed.data.announcementTitle !== undefined ? parsed.data.announcementTitle : current.announcementTitle,
      announcementBody: parsed.data.announcementBody !== undefined ? parsed.data.announcementBody : current.announcementBody,
      announcementCtaLabel: parsed.data.announcementCtaLabel !== undefined ? parsed.data.announcementCtaLabel : current.announcementCtaLabel,
      announcementCtaHref: parsed.data.announcementCtaHref !== undefined ? parsed.data.announcementCtaHref : current.announcementCtaHref,
      announcementVisible: parsed.data.announcementVisible ?? current.announcementVisible,
      heroCtaPrimaryLabel: parsed.data.heroCtaPrimaryLabel ?? current.heroCtaPrimaryLabel,
      heroCtaPrimaryLabelB: parsed.data.heroCtaPrimaryLabelB ?? current.heroCtaPrimaryLabelB,
      homeExperimentVariant: parsed.data.homeExperimentVariant ?? current.homeExperimentVariant,
      lastSiteUpdateLabel:
        parsed.data.lastSiteUpdateLabel !== undefined ? parsed.data.lastSiteUpdateLabel : current.lastSiteUpdateLabel
    };
    await saveHomeContent(merged);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/admin/home-content:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error && /Unknown table|ER_NO_SUCH_TABLE|doesn.*exist/i.test(error.message)
            ? "Table home absente : exécutez la migration 010_home_public_content.sql."
            : "Erreur lors de la sauvegarde."
      },
      { status: 500 }
    );
  }
}
