export function normalizeTagLabel(value: string) {
  return value.trim();
}

export function slugifyTag(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function parseCategoryTokens(raw: string) {
  return raw
    .split(",")
    .map(normalizeTagLabel)
    .filter(Boolean);
}

export function hasTagSlug(rawCategory: string, slug: string) {
  return parseCategoryTokens(rawCategory).some((token) => slugifyTag(token) === slug);
}
