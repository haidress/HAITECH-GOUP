/** URL publique du site (canonical, Open Graph, JSON-LD). */
export function getSiteBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "https://haitech-group.ci";
}

export function absUrl(path: string): string {
  const base = getSiteBaseUrl();
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
