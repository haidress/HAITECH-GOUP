export type AdminNavItem = {
  href: string;
  label: string;
};

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/systeme", label: "Etat du systeme" },
  { href: "/admin/accueil", label: "Contenu accueil" },
  { href: "/admin/seo", label: "SEO pages" },
  { href: "/admin/blog", label: "Blog SEO" },
  { href: "/admin/realisations", label: "Réalisations" },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/interventions", label: "Interventions" },
  { href: "/admin/incidents", label: "Incidents" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/techniciens", label: "Techniciens" },
  { href: "/admin/catalogue", label: "Catalogue" },
  { href: "/admin/services-it", label: "Catalogue IT (site)" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/devis", label: "Devis" }
];
