import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";
import {
  createRealisationProject,
  deleteRealisationProject,
  listAdminRealisationProjects,
  updateRealisationProject,
  type RealisationProjectRecord
} from "@/lib/repositories/realisations-repository";

const linksSchema = z.array(
  z.object({
    label: z.string().trim().min(1).max(120),
    href: z.string().trim().url().max(600)
  })
);

const payloadSchema = z.object({
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(6).max(220),
  tag: z.enum(["Web", "IT", "Formation", "Business"]),
  client_name: z.string().trim().min(2).max(180),
  sector: z.string().trim().min(2).max(180),
  context_text: z.string().trim().min(10),
  challenge_text: z.string().trim().min(10),
  solution_text: z.string().trim().min(10),
  outcome_text: z.string().trim().min(10),
  excerpt: z.string().trim().min(10).max(500),
  year_label: z.string().trim().min(2).max(40),
  duration_label: z.string().trim().min(2).max(120),
  stack_json: z.string().trim().max(12000),
  highlights_json: z.string().trim().max(12000),
  detail_notes_json: z.string().trim().max(18000),
  links_json: z.string().trim().max(18000).nullable().optional(),
  image_url: z.string().trim().min(2).max(600),
  image_fit: z.enum(["cover", "contain"]).default("cover"),
  is_published: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(10000).default(0)
});

const updateSchema = payloadSchema.extend({
  id: z.number().int().positive()
});

const deleteSchema = z.object({
  id: z.number().int().positive()
});

function tableMissingMessage(error: unknown) {
  if (!(error instanceof Error)) return null;
  return /Unknown table|ER_NO_SUCH_TABLE|doesn.*exist/i.test(error.message)
    ? "Table realisation_projects absente : exécutez la migration 021_realisations_admin.sql."
    : null;
}

function normalizeJsonArray(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("INVALID");
    return JSON.stringify(parsed.map((item) => String(item)).filter(Boolean));
  } catch {
    throw new Error("ARRAY_JSON_INVALID");
  }
}

function normalizeLinksJson(raw: string | null | undefined) {
  if (!raw || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw);
    const checked = linksSchema.parse(parsed);
    return JSON.stringify(checked);
  } catch {
    throw new Error("LINKS_JSON_INVALID");
  }
}

function toRepositoryPayload(input: z.infer<typeof payloadSchema>): Omit<RealisationProjectRecord, "id" | "created_at" | "updated_at"> {
  return {
    slug: input.slug,
    title: input.title,
    tag: input.tag,
    client_name: input.client_name,
    sector: input.sector,
    context_text: input.context_text,
    challenge_text: input.challenge_text,
    solution_text: input.solution_text,
    outcome_text: input.outcome_text,
    excerpt: input.excerpt,
    year_label: input.year_label,
    duration_label: input.duration_label,
    stack_json: normalizeJsonArray(input.stack_json),
    highlights_json: normalizeJsonArray(input.highlights_json),
    detail_notes_json: normalizeJsonArray(input.detail_notes_json),
    links_json: normalizeLinksJson(input.links_json),
    image_url: input.image_url,
    image_fit: input.image_fit,
    is_published: input.is_published ? 1 : 0,
    sort_order: input.sort_order
  };
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  try {
    const data = await listAdminRealisationProjects();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET admin/realisations:", error);
    return NextResponse.json({ success: false, message: tableMissingMessage(error) ?? "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = payloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
    }
    const payload = toRepositoryPayload(parsed.data);
    await createRealisationProject(payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "ARRAY_JSON_INVALID") {
      return NextResponse.json({ success: false, message: "Les champs stack/highlights/notes doivent être des tableaux JSON." }, { status: 400 });
    }
    if (error instanceof Error && error.message === "LINKS_JSON_INVALID") {
      return NextResponse.json({ success: false, message: "Le champ links_json doit être un tableau JSON [{label, href}] avec URL valide." }, { status: 400 });
    }
    console.error("POST admin/realisations:", error);
    return NextResponse.json({ success: false, message: tableMissingMessage(error) ?? "Erreur serveur." }, { status: 500 });
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
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
    }
    const { id, ...rest } = parsed.data;
    const payload = toRepositoryPayload(rest);
    await updateRealisationProject(id, payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "ARRAY_JSON_INVALID") {
      return NextResponse.json({ success: false, message: "Les champs stack/highlights/notes doivent être des tableaux JSON." }, { status: 400 });
    }
    if (error instanceof Error && error.message === "LINKS_JSON_INVALID") {
      return NextResponse.json({ success: false, message: "Le champ links_json doit être un tableau JSON [{label, href}] avec URL valide." }, { status: 400 });
    }
    console.error("PUT admin/realisations:", error);
    return NextResponse.json({ success: false, message: tableMissingMessage(error) ?? "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = deleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Identifiant invalide." }, { status: 400 });
    }
    await deleteRealisationProject(parsed.data.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE admin/realisations:", error);
    return NextResponse.json({ success: false, message: tableMissingMessage(error) ?? "Erreur serveur." }, { status: 500 });
  }
}
