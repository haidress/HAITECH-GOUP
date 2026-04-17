import type { MetadataRoute } from "next";
import { getAllRealisationSlugs } from "@/lib/realisations-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://haitech-group.ci";
  const routes = [
    "",
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

  const realisationEntries = getAllRealisationSlugs().map((slug) => ({
    url: `${baseUrl}/realisations/${slug}`,
    lastModified: new Date()
  }));

  return [...staticEntries, ...realisationEntries];
}
