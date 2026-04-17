/**
 * Références clients — ordre du tableau = ordre d’affichage dans chaque pôle.
 * Le premier élément (I VOI RIEN médias) est mis en avant sur la page Réalisations.
 * Visuels : /public/realisations/
 */

export type RealisationTag = "Web" | "IT" | "Formation" | "Business";

export type RealisationLink = {
  label: string;
  href: string;
};

export type RealisationCase = {
  id: string;
  title: string;
  tag: RealisationTag;
  clientName: string;
  sector: string;
  context: string;
  challenge: string;
  solution: string;
  outcome: string;
  excerpt: string;
  year: string;
  duration: string;
  stack: string[];
  highlights: string[];
  detailNotes: string[];
  image: string;
  /** Pour logos / visuels sur fond : évite le recadrage agressif en carte */
  imageFit?: "cover" | "contain";
  links?: RealisationLink[];
};

export const realisationCases: RealisationCase[] = [
  {
    id: "ivoirien-medias",
    title: "Identité visuelle, communication & community management",
    tag: "Business",
    clientName: "I VOI RIEN médias",
    sector: "Médias & éditorial",
    context:
      "Média digital avec besoin d’une identité forte, d’une communication structurée et d’une animation quotidienne de la communauté sur Facebook.",
    challenge:
      "Définir une identité reconnaissable, produire les contenus visuels et assurer la modération et la régularité des publications.",
    solution:
      "Création de l’identité visuelle, définition des axes éditoriaux, production de visuels et community management de la page Facebook officielle.",
    outcome: "Marque identifiable, fil d’actualité régulier et interaction renforcée avec la communauté.",
    excerpt: "Identité, communication et gestion de la page Facebook pour I VOI RIEN médias.",
    year: "2024",
    duration: "Accompagnement en cours",
    stack: ["Identité visuelle", "Community management", "Meta / Facebook", "Communication éditoriale"],
    highlights: [
      "Gestion de la page Facebook officielle du média",
      "Charte et formats adaptés au ton éditorial",
      "Suivi des publications et cohérence de marque"
    ],
    detailNotes: ["Page Facebook : https://www.facebook.com/ivoirienbyhaitech"],
    image: "/realisations/ivoirien-medias.jpeg",
    links: [{ label: "Page Facebook — I VOI RIEN", href: "https://www.facebook.com/ivoirienbyhaitech" }]
  },
  {
    id: "anyama-immobilier",
    title: "Identité visuelle, site internet & community management",
    tag: "Web",
    clientName: "Anyama Immobilier",
    sector: "Immobilier",
    context:
      "Acteur de l’immobilier souhaitant harmoniser son image, sa présence en ligne et l’animation de ses réseaux sociaux.",
    challenge:
      "Image de marque à structurer, besoin d’un site aligné sur l’identité et d’une présence sociale régulière et professionnelle.",
    solution:
      "Conception de l’identité visuelle, déclinaisons print & digital, mise en place du site internet et pilotage du community management (calendrier éditorial, formats, modération).",
    outcome:
      "Une ligne graphique identifiable, un site cohérent avec la marque et des canaux sociaux tenus dans la durée.",
    excerpt: "Charte, site web et animation des réseaux pour Anyama Immobilier.",
    year: "2024",
    duration: "Accompagnement continu",
    stack: ["Identité visuelle", "Site internet", "Community management", "Réseaux sociaux"],
    highlights: [
      "Identité visuelle déclinée sur supports clés",
      "Site structuré autour des offres et de la confiance",
      "Présence sociale pilotée (rythme, tonalité, visuels)"
    ],
    detailNotes: [
      "Coordination étroite avec la direction pour respecter les codes du secteur immobilier et les attentes des acquéreurs."
    ],
    image: "/realisations/anyama-immobilier.jpg",
    imageFit: "contain"
  },
  {
    id: "smalto-cafe-identite",
    title: "Identité visuelle",
    tag: "Web",
    clientName: "Smalto Café",
    sector: "Café & restauration",
    context: "Établissement café visant une identité moderne et chaleureuse, reconnaissable en vitrine et sur supports.",
    challenge: "Construire une identité forte dès l’ouverture : logo, couleurs, typographies et déclinaisons vitrine / digital.",
    solution:
      "Conception de la charte graphique complète : logo, palette, typographies, pictogrammes et guides d’usage pour les supports.",
    outcome: "Une identité prête à être déclinée sur enseigne, packaging, réseaux sociaux et supports clients.",
    excerpt: "Charte graphique et identité pour Smalto Café.",
    year: "2024",
    duration: "Projet livré (évolutions possibles)",
    stack: ["Logo", "Charte graphique", "Déclinaisons vitrine & digital"],
    highlights: [
      "Identité premium et chaleureuse",
      "Guide de marque pour les futures applications",
      "Cohérence entre lieu physique et présence digitale"
    ],
    detailNotes: ["Accompagnement ciblé sur la phase branding avant déploiement large."],
    image: "/realisations/smalto-cafe-identite.jpeg"
  },
  {
    id: "yelefood-lounge",
    title: "Site internet & application web de gestion",
    tag: "Web",
    clientName: "Yelefood Lounge",
    sector: "Restauration & lounge",
    context:
      "Établissement souhaitant une présence en ligne professionnelle et un outil numérique pour structurer l’exploitation quotidienne.",
    challenge:
      "Offrir une vitrine attractive aux clients tout en disposant d’une application web pour suivre commandes, offres et activité du restaurant.",
    solution:
      "Conception et mise en ligne du site internet, puis développement d’une application web dédiée à la gestion du restaurant (parcours adaptés aux équipes).",
    outcome: "Visibilité digitale renforcée et pilotage centralisé des opérations côté salle et cuisine.",
    excerpt: "Site vitrine et application web métier pour Yelefood Lounge.",
    year: "2024",
    duration: "Projet sur mesure",
    stack: ["Site internet", "Application web", "UX métier restauration", "Hébergement & évolutions"],
    highlights: [
      "Site aligné sur l’image du lounge",
      "Application pensée pour les usages terrain",
      "Base évolutive pour de nouveaux modules"
    ],
    detailNotes: [
      "L’outil de gestion couvre les besoins exprimés par l’équipe (suivi, organisation) — périmètre ajustable selon vos process."
    ],
    image: "/realisations/yelefood-lounge.jpg"
  },
  {
    id: "sa2i-holding-visuels-2025",
    title: "Création de visuels & supports de communication",
    tag: "Business",
    clientName: "SA2I Holding",
    sector: "Holding & services",
    context: "Groupe ayant besoin de visuels professionnels pour ses communications internes et externes en 2025.",
    challenge: "Produire des visuels homogènes, impactants et adaptés aux différents canaux (présentations, réseaux, print).",
    solution:
      "Création graphique sur mesure : affiches, bannières, slides et déclinaisons selon les campagnes et événements du groupe.",
    outcome: "Une bibliothèque de visuels cohérente avec l’ADN de SA2I Holding, prête à l’emploi pour les équipes.",
    excerpt: "Campagne de visuels 2025 pour SA2I Holding.",
    year: "2025",
    duration: "2025 (livraisons par vagues)",
    stack: ["Direction artistique", "Création graphique", "Supports digitaux & print"],
    highlights: [
      "Visuels adaptés aux usages corporate",
      "Respect des délais de campagne",
      "Cohérence sur l’ensemble des supports livrés"
    ],
    detailNotes: [
      "Retour client (également affiché sur l’accueil du site) : « HAITECH GROUP a complètement transformé notre présence en ligne. Site professionnel, rapide et efficace. » — PDG SA2I HOLDING, Abidjan."
    ],
    image: "/realisations/sa2i-holding-visuels.jpeg"
  },
  {
    id: "binome-traiteur",
    title: "Identité visuelle & community management",
    tag: "Business",
    clientName: "Binome Traiteur",
    sector: "Restauration & traiteur",
    context: "Entreprise de traiteur souhaitant une image gourmande et professionnelle, et une présence active sur les réseaux.",
    challenge: "Se différencier sur un marché concurrentiel avec une identité mémorable et des contenus sociaux attractifs.",
    solution:
      "Création de l’identité visuelle (logo, couleurs, univers graphique) et community management : shootings, posts, offres et événements.",
    outcome: "Image de marque alignée sur la qualité culinaire et communauté informée des menus et prestations.",
    excerpt: "Branding et animation des réseaux pour Binome Traiteur.",
    year: "2024",
    duration: "Accompagnement continu",
    stack: ["Identité visuelle", "Community management", "Photographie / visuels", "Réseaux sociaux"],
    highlights: [
      "Univers visuel « food » cohérent avec le positionnement",
      "Calendrier éditorial événementiel (menus, dates fortes)",
      "Réactivité sur les messages et demandes"
    ],
    detailNotes: ["Visuel illustratif issu du projet (support de communication)."],
    image: "/realisations/binome-traiteur.jpg"
  },
  {
    id: "koumba-prestige-construction",
    title: "Contenus visuels, community management & maintenance",
    tag: "Business",
    clientName: "Koumba Prestige Construction",
    sector: "BTP & promotion immobilière",
    context:
      "Entreprise de construction et promotion souhaitant renforcer sa visibilité et la qualité de ses supports de communication digitaux.",
    challenge:
      "Produire régulièrement des contenus visuels percutants, animer la communauté et assurer la maintenance des canaux et outils mis en place.",
    solution:
      "Création de contenus visuels (réseaux, campagnes), community management structuré et maintenance continue (mises à jour, corrections, veille technique légère).",
    outcome: "Présence sociale plus régulière, supports à jour et continuité d’exploitation sans rupture de service.",
    excerpt: "Contenus, réseaux sociaux et maintenance pour Koumba Prestige Construction.",
    year: "2023",
    duration: "Depuis 2023 (accompagnement + maintenance)",
    stack: ["Création de contenus visuels", "Community management", "Maintenance site & canaux", "Veille & corrections"],
    highlights: [
      "Calendrier de publications adapté au secteur BTP",
      "Visuels chantiers / livraisons valorisés",
      "Maintenance pour garder site et contenus opérationnels"
    ],
    detailNotes: ["Mission démarrée en 2023 avec périmètre élargi sur la durée (contenus + maintenance)."],
    image: "/realisations/koumba-prestige-construction.jpg"
  },
  {
    id: "ets-ndefai",
    title: "Identité visuelle complète & community management",
    tag: "Business",
    clientName: "ETS N'defai",
    sector: "Commerce & services",
    context:
      "Entreprise souhaitant une identité de marque aboutie et une présence sociale professionnelle sur la durée.",
    challenge:
      "Déployer une charte graphique complète exploitable partout, tout en assurant une animation régulière des réseaux sur le long terme.",
    solution:
      "Création d’identité visuelle complète (logo, déclinaisons, guides d’usage) et community management : plan éditorial, création de posts, interaction avec la communauté.",
    outcome: "Image unifiée sur les supports et dynamique digitale soutenue sur deux années de collaboration.",
    excerpt: "Charte complète et animation des réseaux pour ETS N'defai (2023–2025).",
    year: "2023",
    duration: "2023 — 2025 (2 ans)",
    stack: ["Identité visuelle complète", "Community management", "Charte & déclinaisons", "Réseaux sociaux"],
    highlights: [
      "Identité livrée avec règles d’usage claires",
      "Animation sociale sur 24 mois",
      "Cohérence entre communication terrain et digitale"
    ],
    detailNotes: [
      "Accompagnement continu de 2023 à 2025 sur l’identité et le community management, comme convenu avec le client."
    ],
    image: "/realisations/ets-ndefai.jpg"
  }
];

export function getRealisationBySlug(slug: string): RealisationCase | undefined {
  return realisationCases.find((c) => c.id === slug);
}

export function getAllRealisationSlugs(): string[] {
  return realisationCases.map((c) => c.id);
}

/** Témoignages et citations associés aux références (certains repris de l’accueil). */
export const realisationTemoignages = [
  {
    quote:
      "Une équipe à l’écoute pour notre identité et notre communication au quotidien sur les réseaux — rendu pro et régulier.",
    author: "I VOI RIEN médias",
    stars: "⭐⭐⭐⭐⭐"
  },
  {
    quote: "HAITECH GROUP a complètement transformé notre présence en ligne. Site professionnel, rapide et efficace.",
    author: "PDG SA2I HOLDING, Abidjan",
    stars: "⭐⭐⭐⭐⭐"
  },
  {
    quote: "Service très sérieux et réactif. Je recommande pour tous vos besoins en informatique.",
    author: "PDG ANYAMA IMMOBILIER",
    stars: "⭐⭐⭐⭐⭐"
  }
];
