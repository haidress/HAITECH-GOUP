import type { MetadataRoute } from "next";
import { parseCategoryTokens, slugifyTag } from "@/lib/blog-taxonomy";
import { academyCatalogFormations } from "@/lib/academy-catalog";
import { academyFormationSlug } from "@/lib/academy-utils";
import { getAllRealisationSlugs } from "@/lib/realisations-data";
import { listPublishedBlogPosts, listPublishedBlogSlugs } from "@/lib/repositories/blog-repository";
import { listPublishedBoutiqueProductSlugs } from "@/lib/repositories/boutique-repository";
import { listPublishedRealisationProjects } from "@/lib/repositories/realisations-repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://haitech-group.ci";
  const routes = [
    "",
    "/blog",
    "/technology",
    "/business-center",
    "/boutique-it",
    "/academy",
    "/realisations",
    "/a-propos",
    "/contact",
    "/mentions-legales",
    "/politique-confidentialite"
  ];

  const staticEntries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date()
  }));

  const staticRealisationEntries = getAllRealisationSlugs().map((slug) => ({
    url: `${baseUrl}/realisations/${slug}`,
    lastModified: new Date()
  }));
  let dynamicRealisationEntries: MetadataRoute.Sitemap = [];
  try {
    const rows = await listPublishedRealisationProjects();
    dynamicRealisationEntries = rows.map((row) => ({
      url: `${baseUrl}/realisations/${row.slug}`,
      lastModified: new Date(row.updated_at)
    }));
  } catch {
    dynamicRealisationEntries = [];
  }

  let blogEntries: MetadataRoute.Sitemap = [];
  let blogCategoryEntries: MetadataRoute.Sitemap = [];
  try {
    const rows = await listPublishedBlogSlugs();
    blogEntries = rows.map((row) => ({
      url: `${baseUrl}/blog/${row.slug}`,
      lastModified: new Date(row.updated_at)
    }));

    const posts = await listPublishedBlogPosts(200);
    const categories = Array.from(
      new Set(
        posts
          .flatMap((post) => parseCategoryTokens(post.category))
          .map((token) => slugifyTag(token))
          .filter(Boolean)
      )
    );
    blogCategoryEntries = categories.map((categorySlug) => ({
      url: `${baseUrl}/blog/categorie/${categorySlug}`,
      lastModified: new Date()
    }));
  } catch {
    blogEntries = [];
    blogCategoryEntries = [];
  }

  let boutiqueEntries: MetadataRoute.Sitemap = [];
  try {
    const rows = await listPublishedBoutiqueProductSlugs();
    boutiqueEntries = rows.map((row) => ({
      url: `${baseUrl}/boutique-it/${row.slug}`,
      lastModified: new Date(row.updated_at)
    }));
  } catch {
    boutiqueEntries = [];
  }

  const academyEntries = academyCatalogFormations.map((item) => ({
    url: `${baseUrl}/academy/${academyFormationSlug(item.name)}`,
    lastModified: new Date()
  }));

  return [...staticEntries, ...staticRealisationEntries, ...dynamicRealisationEntries, ...blogEntries, ...blogCategoryEntries, ...boutiqueEntries, ...academyEntries];
}
