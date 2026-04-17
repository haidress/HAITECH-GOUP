/**
 * Catalogue marketing des 3 pôles : Boutique IT, Formations, Services informatique.
 * Données indicatives (prix « à partir de ») — ajustables librement.
 */

export const WHATSAPP_E164 = "2250789174619";

export function whatsappHref(text: string) {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(text)}`;
}

/* -------------------------------------------------------------------------- */
/* Boutique IT                                                                */
/* -------------------------------------------------------------------------- */

export type BoutiqueRayon = {
  label: string;
  icon: string;
  keywords: string[];
  blurb: string;
};

export const boutiqueItRayons: BoutiqueRayon[] = [
  { label: "PC & portables", icon: "💻", keywords: ["pc", "portable", "laptop", "ordinateur", "notebook"], blurb: "Postes fixes, portables, stations compactes." },
  { label: "Écrans & bureaux", icon: "🖥️", keywords: ["écran", "ecran", "moniteur", "docking", "dock"], blurb: "Moniteurs, supports, stations d’accueil." },
  { label: "Réseau & Wi‑Fi", icon: "📶", keywords: ["routeur", "switch", "wifi", "cpl", "firewall"], blurb: "Connectivité pro et particulier." },
  { label: "Stockage", icon: "💾", keywords: ["ssd", "disque", "hdd", "nas", "usb", "clé"], blurb: "SSD, disques externes, NAS, clés USB." },
  { label: "Périphériques", icon: "🖱️", keywords: ["souris", "clavier", "webcam", "casque", "micro"], blurb: "Souris, claviers, audio, visioconférence." },
  { label: "Alimentation & onduleur", icon: "🔌", keywords: ["chargeur", "câble", "onduleur", "batterie", "power"], blurb: "Chargeurs, câbles, onduleurs, batteries." },
  { label: "Impression", icon: "🖨️", keywords: ["imprimante", "toner", "encre", "scanner"], blurb: "Imprimantes et consommables." },
  { label: "Sécurité physique", icon: "🔒", keywords: ["cadenas", "antivol", "rack"], blurb: "Antivols, organisation baie." },
  { label: "Composants", icon: "⚙️", keywords: ["ram", "mémoire", "barrette", "carte", "ventilateur"], blurb: "RAM, cartes, refroidissement." },
  { label: "Mobilité & sacs", icon: "🎒", keywords: ["sac", "sacoche", "hub", "adaptateur"], blurb: "Sacs, hubs USB‑C, adaptateurs voyage." }
];

export const boutiqueItBundles = [
  {
    title: "Télétravail essentiel",
    tagline: "Casque + webcam + hub USB‑C",
    fromPriceFcfa: 85_000,
    items: ["Conseil configuration", "Livraison suivie", "Extension garantie possible"]
  },
  {
    title: "Petite équipe (3 postes)",
    tagline: "PC ou portables + écrans + réseau",
    fromPriceFcfa: 1_200_000,
    items: ["Chiffrage sur devis", "Mise en service optionnelle", "Pack câblage pro"]
  },
  {
    title: "Micro‑TPE réseau",
    tagline: "Box pro + switch + sauvegarde simple",
    fromPriceFcfa: 350_000,
    items: ["Wi‑Fi invités séparé", "Documentation remise au client", "Hotline matériel"]
  }
];

export const boutiqueItTrustPoints = [
  "Produits sourcés avec traçabilité",
  "Prix affichés ou devis clair avant commande",
  "Garantie constructeur ou vendeur selon article",
  "SAV : prise en charge via WhatsApp ou ticket"
];

export const boutiqueItDeliveryPoints = [
  "Livraison Abidjan & grande couronne (selon accord)",
  "Expédition régionale possible (transporteur partenaire)",
  "Retrait sur point convenu pour commandes validées",
  "Délais communiqués après vérification stock",
  "Installation & paramétrage sur devis (postes neufs)",
  "Échange sous conditions dans les 7 jours (hors détérioration)"
];

export const boutiqueItFaqSteps = [
  { title: "1. Choisissez", text: "Catalogue en ligne ou demande sur mesure (WhatsApp)." },
  { title: "2. Validez", text: "Récapitulatif, disponibilité, délai de livraison." },
  { title: "3. Payez", text: "Mobile money / virement / espèces selon accord." },
  { title: "4. Recevez", text: "Livraison, retrait ou installation sur site (option)." }
];

/* -------------------------------------------------------------------------- */
/* Formations (Academy)                                                        */
/* -------------------------------------------------------------------------- */

export type CatalogFormation = {
  name: string;
  category: "Informatique" | "Infographie & design" | "Développement web" | "Outils digitaux & IA" | "Entrepreneuriat" | "Cybersécurité & réseau" | "Bureautique & productivité";
  level: "Débutant" | "Intermédiaire" | "Avancé";
  format: "PDF" | "Vidéo" | "PDF + Vidéo" | "Présentiel / Visio";
  duration: string;
  price: number;
  image: string;
  badge?: "🔥 Populaire" | "⭐ Recommandé" | "💰 Accessible" | "🎓 Certifiant";
  outcomes?: string[];
};

export const academyCatalogFormations: CatalogFormation[] = [
  {
    name: "Windows 11 & productivité au quotidien",
    category: "Informatique",
    level: "Débutant",
    format: "PDF + Vidéo",
    duration: "3 semaines",
    price: 35_000,
    image: "/slide-support.png",
    badge: "💰 Accessible",
    outcomes: ["Navigation, fichiers, sauvegardes", "Paramètres essentiels", "Dépannage de base"]
  },
  {
    name: "Excel avancé (tableaux croisés & automatisation)",
    category: "Bureautique & productivité",
    level: "Intermédiaire",
    format: "PDF + Vidéo",
    duration: "5 semaines",
    price: 55_000,
    image: "/slide-support.png",
    badge: "🔥 Populaire"
  },
  {
    name: "PowerPoint & storytelling visuel",
    category: "Bureautique & productivité",
    level: "Débutant",
    format: "Vidéo",
    duration: "2 semaines",
    price: 28_000,
    image: "/slide-2.jpg"
  },
  {
    name: "Figma & UI design (interfaces web)",
    category: "Infographie & design",
    level: "Intermédiaire",
    format: "PDF + Vidéo",
    duration: "6 semaines",
    price: 72_000,
    image: "/slide-visuel.png",
    badge: "⭐ Recommandé"
  },
  {
    name: "Photoshop & retouche photo pro",
    category: "Infographie & design",
    level: "Débutant",
    format: "PDF + Vidéo",
    duration: "5 semaines",
    price: 58_000,
    image: "/slide-visuel.png"
  },
  {
    name: "HTML / CSS / bases JavaScript",
    category: "Développement web",
    level: "Débutant",
    format: "PDF + Vidéo",
    duration: "8 semaines",
    price: 95_000,
    image: "/slide-sites.png",
    badge: "🔥 Populaire"
  },
  {
    name: "React / Next.js — premier site dynamique",
    category: "Développement web",
    level: "Avancé",
    format: "PDF + Vidéo",
    duration: "10 semaines",
    price: 145_000,
    image: "/slide-sites.png",
    badge: "🎓 Certifiant",
    outcomes: ["Projet déployé", "Bonnes pratiques composants", "Introduction API"]
  },
  {
    name: "IA générative pour l’entreprise (prompts & cas d’usage)",
    category: "Outils digitaux & IA",
    level: "Intermédiaire",
    format: "Vidéo",
    duration: "3 semaines",
    price: 55_000,
    image: "/slide-transformation.png",
    badge: "⭐ Recommandé"
  },
  {
    name: "Notion, Trello & gestion d’équipe agile",
    category: "Outils digitaux & IA",
    level: "Débutant",
    format: "PDF + Vidéo",
    duration: "2 semaines",
    price: 32_000,
    image: "/slide-business.png"
  },
  {
    name: "Business plan & pitch deck investisseurs",
    category: "Entrepreneuriat",
    level: "Intermédiaire",
    format: "PDF + Vidéo",
    duration: "4 semaines",
    price: 62_000,
    image: "/slide-business.png"
  },
  {
    name: "Marketing digital & acquisition (SEO / Meta)",
    category: "Entrepreneuriat",
    level: "Intermédiaire",
    format: "PDF + Vidéo",
    duration: "5 semaines",
    price: 68_000,
    image: "/slide-business.png"
  },
  {
    name: "Cybersécurité : sensibilisation & bonnes pratiques",
    category: "Cybersécurité & réseau",
    level: "Débutant",
    format: "PDF + Vidéo",
    duration: "2 semaines",
    price: 40_000,
    image: "/slide-transformation.png",
    badge: "💰 Accessible"
  },
  {
    name: "Réseau IP de base (LAN, Wi‑Fi, dépannage)",
    category: "Cybersécurité & réseau",
    level: "Intermédiaire",
    format: "PDF + Vidéo",
    duration: "4 semaines",
    price: 75_000,
    image: "/slide-transformation.png"
  }
];

export const academyEbooks = [
  { title: "Guide Excel complet", desc: "Formules, TCD, automatisation.", price: 12_000, image: "/slide-support.png" },
  { title: "Pack Word & PDF pro", desc: "Mise en page longue durée, styles, sommaires.", price: 9_000, image: "/slide-2.jpg" },
  { title: "Lancer son activité (0 → 1)", desc: "Étude marché light, offre, canaux.", price: 15_000, image: "/slide-business.png" },
  { title: "Pack CV & entretien", desc: "Templates + méthode STAR.", price: 8_000, image: "/slide-3.jpg" },
  { title: "Cybersécurité TPE", desc: "Checklist MFA, sauvegardes, phishing.", price: 11_000, image: "/slide-transformation.png" },
  { title: "Introduction Git & GitHub", desc: "Branches, PR, bonnes habitudes.", price: 14_000, image: "/slide-sites.png" }
];

export type AcademyFilterLabel = CatalogFormation["category"] | "Tous";

export const academyCategoryTabs: Array<{ icon: string; label: AcademyFilterLabel }> = [
  { icon: "📚", label: "Tous" },
  { icon: "💻", label: "Informatique" },
  { icon: "📎", label: "Bureautique & productivité" },
  { icon: "🎨", label: "Infographie & design" },
  { icon: "🌐", label: "Développement web" },
  { icon: "🤖", label: "Outils digitaux & IA" },
  { icon: "🔐", label: "Cybersécurité & réseau" },
  { icon: "💼", label: "Entrepreneuriat" }
];

export const academyParcours = [
  {
    title: "Parcours Assistant administratif digital",
    duration: "8 semaines",
    priceFrom: 120_000,
    modules: ["Bureautique", "Excel intermédiaire", "Outils collaboratifs", "Sensibilisation cybersécurité"]
  },
  {
    title: "Parcours Développeur web junior",
    duration: "16 semaines",
    priceFrom: 280_000,
    modules: ["HTML/CSS/JS", "React", "API REST", "Projet portfolio"]
  },
  {
    title: "Parcours Entrepreneur digital",
    duration: "10 semaines",
    priceFrom: 180_000,
    modules: ["Business model", "Site vitrine", "Réseaux sociaux", "Tableaux de bord simples"]
  }
];

export const academyModalites = [
  { title: "Inter-entreprises", text: "Sessions calendaire, places limitées, échanges entre participants." },
  { title: "Intra-entreprise", text: "Contenu adapté à vos outils et cas métiers sur devis." },
  { title: "E-learning / blended", text: "Vidéos + quiz + coaching ponctuel." },
  { title: "Financement", text: "Entreprise, budget formation, prise en charge selon accord." }
];

/* -------------------------------------------------------------------------- */
/* Services informatique (/technology)                                        */
/* -------------------------------------------------------------------------- */

export type ItServiceLine = {
  icon: string;
  title: string;
  desc: string;
  cta: string;
};

/** Ordre par défaut (fallback) — aligné avec la migration 009 et l’admin « Catalogue IT » */
export const itServiceLines: ItServiceLine[] = [
  {
    icon: "🌐",
    title: "Développement web & applications",
    desc: "Sites vitrines, e-commerce, apps métier légères, performances et SEO technique de base.",
    cta: "Demander un devis site / app"
  },
  {
    icon: "🛠️",
    title: "Maintenance & support IT",
    desc: "Helpdesk, dépannage, gestion de parc, mises à jour, incidents utilisateurs.",
    cta: "Souscrire au support"
  },
  {
    icon: "📱",
    title: "Community management",
    desc: "Calendrier éditorial, création visuelle, animation communauté.",
    cta: "Déléguer les réseaux"
  },
  {
    icon: "☁️",
    title: "Microsoft 365 & messagerie",
    desc: "Création de comptes, groupes, sauvegardes M365, migration messagerie.",
    cta: "Migrer vers M365"
  },
  {
    icon: "🎨",
    title: "Identité visuelle & supports",
    desc: "Logo, charte, templates réseaux sociaux, print.",
    cta: "Créer mon identité"
  },
  {
    icon: "💾",
    title: "Sauvegardes & continuité",
    desc: "Stratégie 3-2-1, NAS, cloud, tests de restauration planifiés.",
    cta: "Auditer mes sauvegardes"
  },
  {
    icon: "🔐",
    title: "Cybersécurité & réseaux",
    desc: "Firewall, VPN, segmentation Wi-Fi, MFA, durcissement postes, sensibilisation.",
    cta: "Renforcer la sécurité"
  },
  {
    icon: "📡",
    title: "Réseau & Wi-Fi professionnel",
    desc: "Audit couverture, VLAN invités, supervision légère, dépannage terrain.",
    cta: "Optimiser le réseau"
  },
  {
    icon: "📊",
    title: "Audit & transformation digitale",
    desc: "Diagnostic SI, feuille de route priorisée, quick wins.",
    cta: "Planifier un audit"
  },
  {
    icon: "📞",
    title: "Téléphonie & visioconférence",
    desc: "Choix stack, déploiement salles de réunion, support utilisateurs.",
    cta: "Moderniser la com'"
  },
  {
    icon: "⚙️",
    title: "Automatisation & intégrations",
    desc: "Power Automate, n8n, webhooks et connexions API entre vos outils métiers.",
    cta: "Automatiser mes processus"
  },
  {
    icon: "📋",
    title: "Gestion des licences & inventaire SAM",
    desc: "Inventaire logiciel, suivi M365, rationalisation des coûts et conformité éditeurs.",
    cta: "Optimiser mes licences"
  },
  {
    icon: "🛡️",
    title: "Conformité RGPD & DPO externalisé",
    desc: "Registre des traitements, DPIA allégées, sensibilisation équipes et accompagnement conformité.",
    cta: "Structurer ma conformité"
  },
  {
    icon: "♻️",
    title: "Reprise & destruction sécurisée",
    desc: "Effacement certifié, recyclage et traçabilité des équipements en fin de vie.",
    cta: "Écouler mon ancien parc"
  },
  {
    icon: "💳",
    title: "Financement & location de parc IT",
    desc: "Location longue durée, crédit-bail partenaire et renouvellement maîtrisé du matériel.",
    cta: "Financer mon parc"
  }
];

export type ItManagedTier = {
  name: string;
  audience: string;
  fromPricePerPosteFcfa: number;
  highlights: string[];
  sla: string;
};

export const itManagedTiers: ItManagedTier[] = [
  {
    name: "Essentiel",
    audience: "TPE / indépendants",
    fromPricePerPosteFcfa: 25_000,
    highlights: ["Antivirus géré", "Sauvegarde poste de base", "Support 5j/7 heures ouvrées", "Patchs mensuels"],
    sla: "Première réponse sous 8h ouvrées (visée)"
  },
  {
    name: "Performance",
    audience: "PME 5–50 postes",
    fromPricePerPosteFcfa: 45_000,
    highlights: ["Tout Essentiel", "Supervision santé machines", "M365 léger (conseil + run)", "Heures d’intervention incl."],
    sla: "Première réponse sous 4h ouvrées (visée)"
  },
  {
    name: "Premium",
    audience: "Structures critiques",
    fromPricePerPosteFcfa: 75_000,
    highlights: [
      "Tout Performance",
      "Astreinte élargie (option)",
      "Rapport mensuel",
      "Comité trimestriel",
      "Option SOC léger / monitoring 24x7 (sur devis)"
    ],
    sla: "SLA critique sur devis (HNO possible)"
  }
];

export type ItServicePack = {
  title: string;
  badge: string;
  subtitle: string;
  audience: string;
  items: string[];
  fromPriceFcfa?: number;
};

export const itServicePacks: ItServicePack[] = [
  {
    title: "Pack Particulier – Essentiel",
    badge: "",
    subtitle: "Support & maintenance IT",
    audience: "Particuliers, étudiants, freelances",
    items: ["Assistance à distance", "Dépannage logiciel", "Installation de programmes", "Optimisation PC", "Conseils personnalisés"],
    fromPriceFcfa: 15_000
  },
  {
    title: "Pack Pro – PME",
    badge: "Le plus choisi",
    subtitle: "Support & maintenance IT",
    audience: "Startups, PME",
    items: ["Maintenance régulière", "Support utilisateurs", "Intervention rapide", "Gestion des incidents", "Optimisation réseau"],
    fromPriceFcfa: 85_000
  },
  {
    title: "Pack Entreprise – Premium",
    badge: "Recommandé",
    subtitle: "Support & maintenance IT",
    audience: "Entreprises structurées",
    items: ["Maintenance complète", "Support prioritaire", "Surveillance des systèmes", "Sécurité informatique", "Reporting mensuel"],
    fromPriceFcfa: 220_000
  },
  {
    title: "Pack Starter – Lancement",
    badge: "",
    subtitle: "Identité visuelle",
    audience: "Marques en démarrage",
    items: ["Création de logo", "Palette de couleurs", "Typographie", "2 propositions + retouches"],
    fromPriceFcfa: 120_000
  },
  {
    title: "Pack Standard – Professionnel",
    badge: "Populaire",
    subtitle: "Identité visuelle",
    audience: "PME, entrepreneurs",
    items: ["Logo professionnel", "Charte graphique", "Cartes de visite", "Visuels réseaux sociaux", "Déclinaisons du logo"],
    fromPriceFcfa: 280_000
  },
  {
    title: "Pack Premium – Branding complet",
    badge: "",
    subtitle: "Identité visuelle",
    audience: "Entreprises ambitieuses",
    items: ["Logo + branding complet", "Charte graphique avancée", "Kit réseaux sociaux", "Templates marketing", "Supports print"],
    fromPriceFcfa: 650_000
  },
  {
    title: "Pack Starter – Présence",
    badge: "",
    subtitle: "Community management",
    audience: "Petites structures",
    items: ["Création/optimisation de page", "8 publications/mois", "Design simple", "Programmation"],
    fromPriceFcfa: 95_000
  },
  {
    title: "Pack Growth – Développement",
    badge: "Le plus choisi",
    subtitle: "Community management",
    audience: "PME en croissance",
    items: ["12 à 16 publications/mois", "Visuels professionnels", "Rédaction optimisée", "Gestion interactions", "Stratégie de contenu"],
    fromPriceFcfa: 185_000
  },
  {
    title: "Pack Premium – Domination",
    badge: "",
    subtitle: "Community management",
    audience: "Marques ambitieuses",
    items: ["Publications intensives", "Stratégie marketing complète", "Analyse performances", "Gestion complète interactions", "Campagnes ads (option)"],
    fromPriceFcfa: 350_000
  },
  {
    title: "Pack Site vitrine",
    badge: "",
    subtitle: "Développement web",
    audience: "TPE / indépendants",
    items: ["Design responsive", "5–8 pages", "Formulaire contact", "Hébergement 1 an (option)", "Formation prise en main"],
    fromPriceFcfa: 450_000
  },
  {
    title: "Pack E‑commerce starter",
    badge: "Nouveau",
    subtitle: "Développement web",
    audience: "Commerçants",
    items: ["Catalogue produits", "Paiement mobile money / lien", "Back-office commandes", "SEO de base"],
    fromPriceFcfa: 950_000
  },
  {
    title: "Pack Audit cybersécurité express",
    badge: "",
    subtitle: "Cybersécurité",
    audience: "PME",
    items: ["Interview direction", "Scan configuration", "Top 10 risques", "Plan d’action 30 jours"],
    fromPriceFcfa: 380_000
  },
  {
    title: "Pack MSP « cabinet & professions libérales »",
    badge: "",
    subtitle: "Infogérance sectorielle",
    audience: "Cabinets médicaux, juridiques, comptables",
    items: ["Postes sécurisés & sauvegardes", "Messagerie pro & agenda", "Support prioritaire", "Conformité & confidentialité"],
    fromPriceFcfa: undefined
  },
  {
    title: "Pack MSP « école & formation »",
    badge: "",
    subtitle: "Infogérance sectorielle",
    audience: "Établissements scolaires & CFA",
    items: ["Wi-Fi élèves / admin séparés", "Postes salles & vidéoprojecteurs", "Filtrage contenu option", "Accompagnement vacances scolaires"],
    fromPriceFcfa: undefined
  },
  {
    title: "Pack MSP « commerce & retail »",
    badge: "",
    subtitle: "Infogérance sectorielle",
    audience: "Points de vente & franchises",
    items: ["TPE / caisse & stock", "VPN siège ↔ magasins", "Astreinte ouvertures", "Paiement & réseau sécurisés"],
    fromPriceFcfa: undefined
  },
  {
    title: "Pack DPO / RGPD starter",
    badge: "Juridique + IT",
    subtitle: "Conformité",
    audience: "PME et associations",
    items: ["Atelier cadrage", "Registre des traitements modèle", "Politique confidentialité site", "Sensibilisation 1 session"],
    fromPriceFcfa: 450_000
  },
  {
    title: "Pack Location & financement parc",
    badge: "Partenaires",
    subtitle: "Financement",
    audience: "PME",
    items: ["Étude TCO", "Mise en relation leasing", "Renouvellement planifié", "Recyclage fin de cycle"],
    fromPriceFcfa: undefined
  }
];

export const itAddOns = [
  "Forfait déplacement Abidjan & périphérie",
  "Astreinte week-end / jours fériés",
  "Hébergement & nom de domaine",
  "Licences Microsoft 365 (revente + run)",
  "Matériel : commande groupée Boutique IT",
  "Formation utilisateurs (demi-journée)",
  "SOC léger / monitoring 24x7 (option Premium)",
  "Inventaire SAM & rationalisation licences"
];
