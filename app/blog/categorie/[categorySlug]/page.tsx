import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { hasTagSlug, parseCategoryTokens, slugifyTag } from "@/lib/blog-taxonomy";
import { buildPageMetadata } from "@/lib/page-metadata";
import { defaultSiteMetadata } from "@/lib/site-default-metadata";
import { listPublishedBlogPosts } from "@/lib/repositories/blog-repository";

export const dynamic = "force-dynamic";

function estimateReadingMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function prettyCategory(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params
}: {
  params: { categorySlug: string };
}): Promise<Metadata> {
  const label = prettyCategory(params.categorySlug);
  return buildPageMetadata(`/blog/categorie/${params.categorySlug}`, {
    ...defaultSiteMetadata,
    title: `Blog ${label} | HAITECH GROUP`,
    description: `Tous nos articles ${label} pour PME et entrepreneurs.`
  });
}

export default async function BlogCategoryPage({
  params
}: {
  params: { categorySlug: string };
}) {
  const targetSlug = params.categorySlug.toLowerCase();
  let posts = [] as Awaited<ReturnType<typeof listPublishedBlogPosts>>;
  try {
    posts = await listPublishedBlogPosts(60);
  } catch {
    posts = [];
  }
  const filtered = posts.filter((post) => hasTagSlug(post.category, targetSlug));
  if (filtered.length === 0) notFound();

  const canonicalLabel = parseCategoryTokens(filtered[0].category).find((x) => slugifyTag(x) === targetSlug) ?? prettyCategory(targetSlug);

  return (
    <div>
      <PageHero
        title={`Blog - ${canonicalLabel}`}
        description={`Découvrez nos conseils pratiques sur ${canonicalLabel.toLowerCase()}.`}
      />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-5">
          <Link href="/blog" className="text-sm font-semibold text-haitechBlue hover:underline">
            ← Retour au blog
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <article key={post.id} className="rounded-2xl border border-slate-200 bg-white p-6">
              {post.cover_image_path ? (
                <Image
                  src={post.cover_image_path}
                  alt={post.title}
                  className="mb-4 h-40 w-full rounded-xl object-cover"
                  width={640}
                  height={320}
                  loading="lazy"
                />
              ) : null}
              <h2 className="mt-2 font-heading text-lg font-bold text-haitechBlue">{post.title}</h2>
              <p className="mt-2 line-clamp-4 text-sm text-slate-600">{post.excerpt}</p>
              <p className="mt-3 text-xs text-slate-500">
                {post.published_at ? new Date(post.published_at).toLocaleDateString("fr-FR") : ""}
                {" · "}
                {estimateReadingMinutes(post.content)} min de lecture
              </p>
              <Link href={`/blog/${post.slug}`} className="mt-4 inline-block rounded-full bg-haitechBlue px-4 py-2 text-xs font-semibold text-white">
                Lire l&apos;article
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
