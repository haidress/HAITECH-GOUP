import type { MetadataRoute } from "next";

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

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date()
  }));
}
