export type CatalogFormation = {
  name: string;
  category: "Informatique de base" | "Design & création" | "Développement web" | "IA & digital" | "Business & digital" | "Technique & maintenance";
  level: "Débutant" | "Intermédiaire" | "Avancé";
  format: "Présentiel / Visio" | "Hybride";
  duration: string;
  price: number;
  image: string;
  summary?: string;
  weeklyHours?: string;
  eveningClasses?: boolean;
  brochureUrl?: string;
  badge?: "🔥 Populaire" | "⭐ Recommandé" | "💰 Accessible" | "🎓 Certifiant";
  outcomes?: string[];
};

export const academyCatalogFormations: CatalogFormation[] = [
  {
    name: "Initiation à l’informatique",
    category: "Informatique de base",
    level: "Débutant",
    format: "Présentiel / Visio",
    duration: "4 semaines",
    weeklyHours: "4 h / semaine",
    price: 25_000,
    image: "/slide-support.png",
    badge: "💰 Accessible",
    outcomes: ["Bases PC", "Internet et navigation", "Outils essentiels"]
  },
  {
    name: "Bureautique complète (Word, Excel, PowerPoint)",
    category: "Informatique de base",
    level: "Débutant",
    format: "Présentiel / Visio",
    duration: "6 semaines",
    weeklyHours: "4 h / semaine",
    price: 45_000,
    image: "/slide-support.png",
    badge: "🔥 Populaire"
  },
  {
    name: "Excel avancé & automatisation",
    category: "Informatique de base",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "5 semaines",
    weeklyHours: "4 h / semaine",
    price: 60_000,
    image: "/slide-support.png",
    badge: "🔥 Populaire",
    outcomes: ["Formules avancées", "TCD", "Automatisation des tâches"]
  },
  {
    name: "Design graphique (Canva + Photoshop)",
    category: "Design & création",
    level: "Débutant",
    format: "Présentiel / Visio",
    duration: "6 semaines",
    weeklyHours: "4 h / semaine",
    price: 75_000,
    image: "/slide-visuel.png"
  },
  {
    name: "Montage vidéo (CapCut + Premiere)",
    category: "Design & création",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "6 semaines",
    weeklyHours: "4 h / semaine",
    price: 80_000,
    image: "/slide-3.jpg"
  },
  {
    name: "Community Management",
    category: "Design & création",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "4 semaines",
    weeklyHours: "4 h / semaine",
    price: 65_000,
    image: "/slide-business.png",
    badge: "🔥 Populaire",
    outcomes: ["Reseaux sociaux", "Contenu", "Strategie"]
  },
  {
    name: "Développement Web (HTML, CSS, JS)",
    category: "Développement web",
    level: "Débutant",
    format: "Présentiel / Visio",
    duration: "8 semaines",
    weeklyHours: "4 h / semaine",
    price: 90_000,
    image: "/slide-sites.png",
    badge: "🔥 Populaire"
  },
  {
    name: "Développeur Web complet (projet réel)",
    category: "Développement web",
    level: "Intermédiaire",
    format: "Hybride",
    duration: "12 semaines",
    weeklyHours: "5 h / semaine",
    price: 140_000,
    image: "/slide-sites.png",
    badge: "🎓 Certifiant",
    outcomes: ["Projet final", "Certificat", "Methode pro"]
  },
  {
    name: "React JS (Front-end avancé)",
    category: "Développement web",
    level: "Avancé",
    format: "Hybride",
    duration: "10 semaines",
    weeklyHours: "5 h / semaine",
    price: 150_000,
    image: "/slide-sites.png"
  },
  {
    name: "IA pour débutants",
    category: "IA & digital",
    level: "Débutant",
    format: "Présentiel / Visio",
    duration: "3 semaines",
    weeklyHours: "3 h / semaine",
    price: 50_000,
    image: "/slide-transformation.png",
    badge: "🔥 Populaire"
  },
  {
    name: "IA pour entrepreneurs",
    category: "IA & digital",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "5 semaines",
    weeklyHours: "4 h / semaine",
    price: 85_000,
    image: "/slide-transformation.png",
    badge: "⭐ Recommandé",
    outcomes: ["Automatisation", "Business", "Productivite"]
  },
  {
    name: "Marketing digital & publicité",
    category: "Business & digital",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "5 semaines",
    weeklyHours: "4 h / semaine",
    price: 80_000,
    image: "/slide-business.png",
    badge: "🔥 Populaire",
    outcomes: ["Facebook Ads", "Strategie", "Conversion"]
  },
  {
    name: "E-commerce (vendre en ligne)",
    category: "Business & digital",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "6 semaines",
    weeklyHours: "4 h / semaine",
    price: 90_000,
    image: "/slide-business.png"
  },
  {
    name: "Réseaux informatiques (bases + pratique)",
    category: "Technique & maintenance",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "6 semaines",
    weeklyHours: "4 h / semaine",
    price: 80_000,
    image: "/slide-transformation.png"
  },
  {
    name: "Cybersécurité (bases + protection)",
    category: "Technique & maintenance",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "5 semaines",
    weeklyHours: "4 h / semaine",
    price: 75_000,
    image: "/slide-transformation.png"
  },
  {
    name: "Maintenance informatique (diagnostic & dépannage)",
    category: "Technique & maintenance",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "6 semaines",
    weeklyHours: "4 h / semaine",
    price: 85_000,
    image: "/slide-support.png",
    badge: "🔥 Populaire",
    outcomes: ["Montage et demontage PC", "Installation Windows", "Resolution de pannes", "Support IT"]
  }
];

export type AcademyEbook = {
  title: string;
  desc: string;
  price: number;
  image: string;
  file: string;
};

export const academyEbooksMain: AcademyEbook[] = [
  { title: "Guide Excel complet", desc: "Formules, TCD, automatisation.", price: 10_000, image: "/slide-support.png", file: "/ebooks/guide-excel-complet.pdf" },
  { title: "Prompting IA pratique", desc: "Utiliser l'IA pour travailler plus vite.", price: 6_000, image: "/slide-transformation.png", file: "/ebooks/prompting-ia-pratique.pdf" },
  { title: "Guide prospection WhatsApp", desc: "Trouver des clients avec WhatsApp.", price: 3_000, image: "/slide-business.png", file: "/ebooks/guide-prospection-whatsapp.pdf" },
  { title: "Canva Express", desc: "Creer des visuels professionnels.", price: 4_000, image: "/slide-visuel.png", file: "/ebooks/canva-express.pdf" },
  { title: "Lancer son activité (0 → 1)", desc: "Idee -> client -> revenus.", price: 8_000, image: "/slide-business.png", file: "/ebooks/lancer-son-activite.pdf" },
  { title: "Tableaux de bord Excel PME", desc: "Suivi des performances et KPI.", price: 10_000, image: "/slide-support.png", file: "/ebooks/tableaux-bord-excel-pme.pdf" }
];

export const academyEbookPacks = [
  {
    title: "Pack Business Starter",
    badge: "⭐",
    price: 10_000,
    items: ["WhatsApp", "Canva", "IA"],
    desc: "Ideal pour demarrer un business rapidement."
  },
  {
    title: "Pack Excel Pro",
    badge: "",
    price: 15_000,
    items: ["Excel complet", "Tableaux de bord"],
    desc: "Pour piloter la performance en entreprise."
  },
  {
    title: "Pack Entrepreneur",
    badge: "",
    price: 15_000,
    items: ["Lancer activité", "Branding", "Gestion financière"],
    desc: "Pour structurer une activité rentable."
  }
];

export const academyEbooksSecondary: AcademyEbook[] = [
  { title: "Cybersécurité TPE", desc: "Protection et bonnes pratiques.", price: 9_000, image: "/slide-transformation.png", file: "/ebooks/cybersecurite-tpe.pdf" },
  { title: "Pack CV & entretien", desc: "Preparation candidature et entretien.", price: 7_000, image: "/slide-3.jpg", file: "/ebooks/pack-cv-entretien.pdf" },
  { title: "Branding personnel", desc: "Positionnement et image professionnelle.", price: 7_500, image: "/slide-visuel.png", file: "/ebooks/guide-branding-personnel.pdf" },
  { title: "SEO local", desc: "Visibilite locale pour clients de proximite.", price: 6_500, image: "/slide-sites.png", file: "/ebooks/mini-manuel-seo-local.pdf" },
  { title: "Gestion financière", desc: "Marge, tresorerie et pilotage simple.", price: 8_500, image: "/slide-business.png", file: "/ebooks/gestion-financiere-simple.pdf" }
];

export const academyEbooks = [...academyEbooksMain, ...academyEbooksSecondary];

export type AcademyFilterLabel = CatalogFormation["category"] | "Tous";

export const academyCategoryTabs: Array<{ icon: string; label: AcademyFilterLabel }> = [
  { icon: "📚", label: "Tous" },
  { icon: "🟢", label: "Informatique de base" },
  { icon: "🎨", label: "Design & création" },
  { icon: "🌐", label: "Développement web" },
  { icon: "🤖", label: "IA & digital" },
  { icon: "📈", label: "Business & digital" },
  { icon: "🛠️", label: "Technique & maintenance" }
];

export const academyParcours = [
  { title: "Pack Bureau Pro", duration: "12 semaines", priceFrom: 80_000, modules: ["Word", "Excel", "PowerPoint"] },
  { title: "Pack Créatif", duration: "12 semaines", priceFrom: 130_000, modules: ["Design", "Vidéo"] },
  { title: "Pack Développeur", duration: "20 semaines", priceFrom: 160_000, modules: ["HTML/CSS/JS", "Projet complet"] },
  { title: "Pack Business Digital", duration: "13 semaines", priceFrom: 150_000, modules: ["IA", "Marketing", "Community Management"] }
];

export const academyModalites = [
  { title: "Audit & orientation gratuite", text: "Quelle formation est faite pour vous ? Diagnostic et orientation sans frais." },
  { title: "WhatsApp direct", text: "Validation rapide de votre besoin et accompagnement commande via WhatsApp." },
  { title: "Formats pratiques", text: "Cours presentiel/visio avec exercices, cas reels et suivi." },
  { title: "Accompagnement", text: "Suivi apres formation selon vos objectifs professionnels." }
];
