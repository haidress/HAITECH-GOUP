export const publicNavLinks = [
  { href: "/", label: "Accueil" },
  { href: "/technology", label: "Services informatique" },
  { href: "/academy", label: "Formations" },
  { href: "/boutique-it", label: "Boutique IT" },
  { href: "/blog", label: "Blog" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/contact", label: "Contact" }
];

export const roleNavLinks = {
  admin: [{ href: "/admin/leads", label: "Dashboard" }],
  client: [{ href: "/espace-client", label: "Espace client" }],
  etudiant: [{ href: "/elearning", label: "E-learning" }],
  technicien: [{ href: "/technicien", label: "Mes interventions" }]
} as const;

export const whatsappLink =
  "https://wa.me/2250789174619?text=Bonjour%20HAITECH%20GROUP%2C%20je%20souhaite%20discuter%20de%20mon%20projet.";
