import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { parseCategoryTokens, slugifyTag } from "@/lib/blog-taxonomy";
import { buildPageMetadata } from "@/lib/page-metadata";
import { defaultSiteMetadata } from "@/lib/site-default-metadata";
import { listPublishedBlogPosts } from "@/lib/repositories/blog-repository";

export const dynamic = "force-dynamic";

function estimateReadingMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/blog", {
    ...defaultSiteMetadata,
    title: "Blog SEO | HAITECH GROUP",
    description: "Conseils IT, business et cybersécurité pour PME et entrepreneurs en Afrique."
  });
}

export default async function BlogPage({
  searchParams
}: {
  searchParams?: { q?: string; category?: string };
}) {
  let posts = [] as Awaited<ReturnType<typeof listPublishedBlogPosts>>;
  try {
    posts = await listPublishedBlogPosts(120);
  } catch {
    posts = [];
  }

  const query = (searchParams?.q ?? "").trim().toLowerCase();
  const selectedCategory = (searchParams?.category ?? "").trim().toLowerCase();
  const categories = Array.from(
    new Set(
      posts
        .flatMap((p) => parseCategoryTokens(p.category))
        .map((c) => c.toLowerCase())
        .filter(Boolean)
    )
  );

  const filteredPosts = posts.filter((post) => {
    const text = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase();
    const categoryTokens = parseCategoryTokens(post.category).map((c) => c.toLowerCase());
    const matchQuery = !query || text.includes(query);
    const matchCategory = !selectedCategory || categoryTokens.includes(selectedCategory);
    return matchQuery && matchCategory;
  });

  return (
    <div>
      <PageHero
        title="Blog HAITECH"
        description="Chaque semaine, des conseils concrets pour la visibilité, la sécurité et la performance de votre entreprise."
      />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <form method="GET" className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto]">
          <input
            name="q"
            defaultValue={searchParams?.q ?? ""}
            placeholder="Rechercher un article (SEO, cybersécurité, business...)"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
          />
          <button className="rounded-xl bg-haitechBlue px-5 py-3 text-sm font-semibold text-white" type="submit">
            Rechercher
          </button>
          <div className="md:col-span-2 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                !selectedCategory ? "bg-haitechBlue text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              Tous
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/blog?category=${encodeURIComponent(c)}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  selectedCategory === c ? "bg-haitechBlue text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        </form>
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <p className="text-slate-700">Aucun article trouvé pour ce filtre.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
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
                <div className="flex flex-wrap gap-1">
                  {parseCategoryTokens(post.category).map((token) => (
                    <Link
                      key={`${post.id}-${token}`}
                      href={`/blog/categorie/${slugifyTag(token)}`}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 hover:bg-haitechBlue hover:text-white"
                    >
                      {token}
                    </Link>
                  ))}
                </div>
                <h2 className="mt-2 font-heading text-lg font-bold text-haitechBlue">{post.title}</h2>
                <p className="mt-2 line-clamp-4 text-sm text-slate-600">{post.excerpt}</p>
                <p className="mt-3 text-xs text-slate-500">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString("fr-FR") : ""}
                  {" · "}
                  {estimateReadingMinutes(post.content)} min de lecture
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block rounded-full bg-haitechBlue px-4 py-2 text-xs font-semibold text-white"
                >
                  Lire l&apos;article
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
