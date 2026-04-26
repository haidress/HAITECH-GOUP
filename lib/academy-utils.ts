export function academyFormationSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function academyCategoryToBlogSlug(category: string) {
  const map: Record<string, string> = {
    "Informatique de base": "informatique",
    "Design & création": "design",
    "Développement web": "developpement-web",
    "IA & digital": "intelligence-artificielle",
    "Business & digital": "entrepreneuriat",
    "Technique & maintenance": "cybersecurite"
  };
  return map[category] ?? "informatique";
}
