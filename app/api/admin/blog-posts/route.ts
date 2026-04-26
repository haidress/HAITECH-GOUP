import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";
import {
  createBlogPost,
  deleteBlogPost,
  listAdminBlogPosts,
  updateBlogPost,
  type BlogPostStatus
} from "@/lib/repositories/blog-repository";
import { normalizeFaqJsonForDb } from "@/lib/blog-admin-faq";

const postSchema = z.object({
  title: z.string().trim().min(6).max(190),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(220)
    .regex(/^[a-z0-9-]+$/),
  excerpt: z.string().trim().min(12).max(500),
  content: z.string().trim().min(40),
  cover_image_path: z.string().trim().max(255).nullable().optional(),
  category: z.string().trim().min(2).max(255),
  status: z.enum(["draft", "published"]),
  published_at: z.string().datetime().nullable().optional(),
  meta_title: z.string().trim().min(8).max(255),
  meta_description: z.string().trim().min(20).max(500),
  og_title: z.string().trim().max(255).nullable().optional(),
  og_description: z.string().trim().max(500).nullable().optional(),
  og_image_path: z.string().trim().max(255).nullable().optional(),
  author_name: z.string().trim().min(2).max(120).optional(),
  faq_json: z.string().trim().max(20000).nullable().optional()
});

const putSchema = postSchema.extend({
  id: z.number().int().positive()
});

const deleteSchema = z.object({
  id: z.number().int().positive()
});

function normalizePublishedAt(status: BlogPostStatus, value: string | null | undefined) {
  if (status === "draft") return null;
  if (!value) return new Date().toISOString();
  return value;
}

function tableMissingMessage(error: unknown) {
  if (!(error instanceof Error)) return null;
  if (/Unknown column.*faq_json|Unknown column.*author_name/i.test(error.message)) {
    return "Colonnes blog manquantes : exécutez la migration 018_blog_author_faq.sql.";
  }
  return /Unknown table|ER_NO_SUCH_TABLE|doesn.*exist/i.test(error.message)
    ? "Table blog_posts absente : exécutez la migration 013_blog_seo_admin.sql."
    : null;
}

function buildBlogPayload(rest: z.infer<typeof postSchema>) {
  const { faq_json: faqRaw, author_name: authorRaw, ...restFields } = rest;
  let faqJson: string | null = null;
  try {
    faqJson = normalizeFaqJsonForDb(faqRaw ?? null);
  } catch {
    throw new Error("FAQ_INVALID");
  }
  return {
    ...restFields,
    cover_image_path: rest.cover_image_path ?? null,
    og_title: rest.og_title ?? null,
    og_description: rest.og_description ?? null,
    og_image_path: rest.og_image_path ?? null,
    author_name: authorRaw?.trim() || "HAITECH GROUP",
    faq_json: faqJson
  };
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  try {
    const data = await listAdminBlogPosts();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET blog-posts:", error);
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
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
    }
    let payload;
    try {
      payload = buildBlogPayload(parsed.data);
    } catch {
      return NextResponse.json(
        { success: false, message: "FAQ invalide : attendu un tableau JSON de { question, answer } (max 10 entrées)." },
        { status: 400 }
      );
    }
    await createBlogPost({
      ...payload,
      published_at: normalizePublishedAt(parsed.data.status, parsed.data.published_at)
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST blog-posts:", error);
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
    const parsed = putSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
    }
    const { id, ...rest } = parsed.data;
    let payload;
    try {
      payload = buildBlogPayload(rest);
    } catch {
      return NextResponse.json(
        { success: false, message: "FAQ invalide : attendu un tableau JSON de { question, answer } (max 10 entrées)." },
        { status: 400 }
      );
    }
    await updateBlogPost(id, {
      ...payload,
      published_at: normalizePublishedAt(rest.status, rest.published_at)
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT blog-posts:", error);
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
    await deleteBlogPost(parsed.data.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE blog-posts:", error);
    return NextResponse.json({ success: false, message: tableMissingMessage(error) ?? "Erreur serveur." }, { status: 500 });
  }
}
