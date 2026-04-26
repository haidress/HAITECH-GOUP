export function normalizeLeadEmail(email: string) {
  return email.trim().toLowerCase();
}

/** Chiffres uniqués ; null si trop court pour servir de clé anti-doublon. */
export function normalizeLeadPhoneDigits(telephone: string | null | undefined) {
  if (!telephone) return null;
  const digits = telephone.replace(/\D/g, "");
  return digits.length >= 8 ? digits : null;
}

export function appendLeadBesoinBlock(existing: string, addition: string, when = new Date()) {
  const stamp = when.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
  const trimmed = existing.trim();
  const block = `[${stamp}]\n${addition.trim()}`;
  return trimmed ? `${trimmed}\n\n---\n${block}` : block;
}
