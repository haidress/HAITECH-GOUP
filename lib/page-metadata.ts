import type { Metadata } from "next";
import { fetchPageSeo } from "@/lib/repositories/page-seo-repository";
import { defaultSiteMetadata } from "@/lib/site-default-metadata";

function absOgImage(path: string | null | undefined) {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = defaultSiteMetadata.metadataBase?.toString() ?? "https://haitech-group.ci";
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return new URL(trimmed, base).toString();
}

export async function buildPageMetadata(path: string, fallback?: Metadata): Promise<Metadata> {
  const base = fallback ?? defaultSiteMetadata;
  let row: Awaited<ReturnType<typeof fetchPageSeo>>;
  try {
    row = await fetchPageSeo(path);
  } catch {
    return base;
  }
  if (!row) return base;

  const ogImage = absOgImage(row.og_image_path ?? undefined);

  return {
    ...base,
    title: row.meta_title,
    description: row.meta_description,
    openGraph: {
      ...base.openGraph,
      title: row.og_title ?? row.meta_title,
      description: row.og_description ?? row.meta_description,
      url: base.metadataBase ? new URL(path === "/" ? "/" : path, base.metadataBase).toString() : undefined,
      images: ogImage ? [{ url: ogImage }] : base.openGraph?.images
    },
    twitter: {
      ...base.twitter,
      title: row.og_title ?? row.meta_title,
      description: row.og_description ?? row.meta_description,
      images: ogImage ? [ogImage] : base.twitter?.images
    }
  };
}
