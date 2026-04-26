import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { faqItemsToJsonLd, normalizeFaqFromDb } from "@/lib/blog-faq";
import { parseCategoryTokens, slugifyTag } from "@/lib/blog-taxonomy";
import { defaultSiteMetadata } from "@/lib/site-default-metadata";
import { getPublishedBlogPostBySlug, listPublishedBlogPosts } from "@/lib/repositories/blog-repository";

type PageProps = {
  params: { slug: string };
};

function extractHeadings(content: string) {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("## ") || line.startsWith("### "))
    .map((line) => {
      const level = line.startsWith("### ") ? 3 : 2;
      const label = line.replace(/^###?\s+/, "").trim();
      const id = label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      return { level, label, id };
    });
}

function renderContentWithHeadings(content: string) {
  return content.split("\n").map((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      const label = trimmed.replace(/^##\s+/, "").trim();
      const id = label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      return (
        <h2 key={`h2-${index}`} id={id} className="mt-8 text-2xl font-bold text-haitechBlue">
          {label}
        </h2>
      );
    }
    if (trimmed.startsWith("### ")) {
      const label = trimmed.replace(/^###\s+/, "").trim();
      const id = label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      return (
        <h3 key={`h3-${index}`} id={id} className="mt-6 text-xl font-semibold text-haitechBlue">
          {label}
        </h3>
      );
    }
    if (!trimmed) return <div key={`sp-${index}`} className="h-3" />;
    return (
      <p key={`p-${index}`} className="mt-3 text-slate-700">
        {line}
      </p>
    );
  });
}

function estimateReadingMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function absUrl(pathOrUrl: string | null | undefined) {
  if (!pathOrUrl) return undefined;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  const base = defaultSiteMetadata.metadataBase?.toString() ?? "https://haitech-group.ci";
  return new URL(pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`, base).toString();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  let post = null as Awaited<ReturnType<typeof getPublishedBlogPostBySlug>>;
  try {
    post = await getPublishedBlogPostBySlug(params.slug);
  } catch {
    post = null;
  }
  if (!post) return defaultSiteMetadata;
  const image = absUrl(post.og_image_path ?? post.cover_image_path ?? undefined);
  const canonical = absUrl(`/blog/${post.slug}`);
  return {
    ...defaultSiteMetadata,
    title: post.meta_title,
    description: post.meta_description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      ...defaultSiteMetadata.openGraph,
      type: "article",
      title: post.og_title ?? post.meta_title,
      description: post.og_description ?? post.meta_description,
      url: canonical,
      images: image ? [{ url: image }] : defaultSiteMetadata.openGraph?.images
    },
    twitter: {
      ...defaultSiteMetadata.twitter,
      title: post.og_title ?? post.meta_title,
      description: post.og_description ?? post.meta_description,
      images: image ? [image] : defaultSiteMetadata.twitter?.images
    }
  };
}

export const dynamic = "force-dynamic";

export default async function BlogArticlePage({ params }: PageProps) {
  let post = null as Awaited<ReturnType<typeof getPublishedBlogPostBySlug>>;
  try {
    post = await getPublishedBlogPostBySlug(params.slug);
  } catch {
    post = null;
  }
  if (!post) notFound();

  let relatedPosts = [] as Awaited<ReturnType<typeof listPublishedBlogPosts>>;
  let contextualLinks = [] as Awaited<ReturnType<typeof listPublishedBlogPosts>>;
  try {
    const candidates = await listPublishedBlogPosts(60);
    const currentTagSlugs = new Set(parseCategoryTokens(post.category).map((t) => slugifyTag(t)));
    const scored = candidates
      .filter((item) => item.id !== post.id)
      .map((item) => ({
        post: item,
        score: parseCategoryTokens(item.category).filter((t) => currentTagSlugs.has(slugifyTag(t))).length
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const da = new Date(a.post.published_at ?? a.post.created_at).getTime();
        const db = new Date(b.post.published_at ?? b.post.created_at).getTime();
        return db - da;
      });
    relatedPosts = scored.slice(0, 3).map((x) => x.post);
    contextualLinks = scored.slice(3, 5).map((x) => x.post);
  } catch {
    relatedPosts = [];
    contextualLinks = [];
  }

  const articleUrl = absUrl(`/blog/${post.slug}`);
  const articleImage = absUrl(post.og_image_path ?? post.cover_image_path ?? undefined);
  const headings = extractHeadings(post.content);
  const catLower = post.category.toLowerCase();
  const ctaTitle = catLower.includes("seo")
    ? "Besoin de renforcer votre visibilité sur Google ?"
    : catLower.includes("cyber")
      ? "Besoin de renforcer votre cybersécurité ?"
      : "Besoin d’un accompagnement concret ?";
  const ctaText = catLower.includes("seo")
    ? "Nous vous aidons à transformer votre contenu en trafic qualifié et en leads."
    : catLower.includes("cyber")
      ? "Nous auditons votre système et mettons en place un plan de protection adapté."
      : "Parlez de votre projet avec HAITECH pour obtenir un plan d’action concret.";
  const faqItems = normalizeFaqFromDb(post.faq_json);
  const faqJsonLd = faqItemsToJsonLd(faqItems);
  const authorLabel = post.author_name?.trim() || "HAITECH GROUP";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    mainEntityOfPage: articleUrl,
    image: articleImage ? [articleImage] : undefined,
    author: {
      "@type": "Organization",
      name: authorLabel
    },
    publisher: {
      "@type": "Organization",
      name: "HAITECH GROUP"
    }
  };

  const pubDateLabel = post.published_at ? new Date(post.published_at).toLocaleDateString("fr-FR") : "";
  const updDateLabel = new Date(post.updated_at).toLocaleDateString("fr-FR");
  const showUpdated = Boolean(post.published_at && updDateLabel !== pubDateLabel);

  return (
    <article className="mx-auto max-w-4xl px-4 py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} /> : null}
      <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-haitechBlue hover:underline">
        ← Retour au blog
      </Link>
      {post.cover_image_path ? (
        <Image
          src={post.cover_image_path}
          alt={post.title}
          className="mt-5 h-64 w-full rounded-2xl object-cover"
          width={1280}
          height={512}
        />
      ) : null}
      <div className="flex flex-wrap gap-1">
        {parseCategoryTokens(post.category).map((token) => (
          <Link
            key={token}
            href={`/blog/categorie/${slugifyTag(token)}`}
            className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 hover:bg-haitechBlue hover:text-white"
          >
            {token}
          </Link>
        ))}
      </div>
      <h1 className="mt-2 font-heading text-3xl font-extrabold text-haitechBlue">{post.title}</h1>
      <p className="mt-2 text-sm text-slate-500">
        Par {authorLabel}
        {pubDateLabel ? ` · Publié le ${pubDateLabel}` : ""}
        {showUpdated ? ` · Mis à jour le ${updDateLabel}` : ""}
        {" · "}
        {estimateReadingMinutes(post.content)} min de lecture
      </p>
      <p className="mt-6 text-lg text-slate-700">{post.excerpt}</p>
      {headings.length > 0 ? (
        <nav className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-haitechBlue">Sommaire</p>
          <ul className="mt-2 space-y-1 text-sm">
            {headings.map((h) => (
              <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
                <a href={`#${h.id}`} className="text-slate-700 hover:text-haitechBlue hover:underline">
                  {h.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      <div className="mt-8">{renderContentWithHeadings(post.content)}</div>
      {faqItems.length > 0 ? (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue">Questions fréquentes</h2>
          <dl className="mt-4 space-y-4 text-sm text-slate-700">
            {faqItems.map((item, idx) => (
              <div key={`faq-${idx}-${item.question.slice(0, 24)}`}>
                <dt className="font-semibold text-haitechBlue">{item.question}</dt>
                <dd className="mt-1 text-slate-600">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
      {relatedPosts.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue">Articles similaires</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((item) => (
              <Link
                key={item.id}
                href={`/blog/${item.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 transition hover:border-haitechBlue"
              >
                <p className="text-xs uppercase tracking-wide text-slate-500">{item.category}</p>
                <p className="mt-2 font-semibold text-haitechBlue">{item.title}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      {contextualLinks.length > 0 ? (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-heading text-xl font-bold text-haitechBlue">A lire aussi sur ce sujet</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {contextualLinks.map((item) => (
              <li key={item.id}>
                <Link href={`/blog/${item.slug}`} className="text-slate-700 hover:text-haitechBlue hover:underline">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="font-heading text-xl font-bold text-haitechBlue">{ctaTitle}</h2>
        <p className="mt-2 text-sm text-slate-700">
          {ctaText}
        </p>
        <Link href="/contact" className="mt-4 inline-block rounded-full bg-haitechGold px-5 py-2 text-sm font-semibold text-haitechBlue">
          Demander un devis
        </Link>
      </div>
    </article>
  );
}
