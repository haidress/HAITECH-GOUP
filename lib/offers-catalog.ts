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
  {
    label: "Ordinateurs",
    icon: "💻",
    keywords: [
      "pc",
      "portable",
      "laptop",
      "ordinateur",
      "notebook",
      "elitebook",
      "latitude",
      "thinkpad",
      "probook",
      "desktop",
      "bureau",
      "workstation",
      "precision",
      "thinkcentre",
      "elitedesk",
      "290 g9",
      "pro 290",
      "intel nuc",
      "nuc",
      "gamer",
      "gaming",
      "tuf",
      "rog",
      "strix",
      "rtx",
      "ryzen",
      "core i5",
      "core i7",
      "core i9"
    ],
    blurb: "PC portables reconditionnés et professionnels."
  },
  {
    label: "Écrans & bureaux",
    icon: "🖥️",
    keywords: [
      "écran",
      "ecran",
      "moniteur",
      "monitor",
      "docking",
      "dock",
      "samsung",
      "odyssey",
      "ultragear",
      "ultrawide",
      "msi",
      "lg",
      "lenovo l24e",
      "lenovo l27e",
      "incurvé",
      "240 hz",
      "144 hz",
      "180 hz"
    ],
    blurb: "Moniteurs et accessoires de poste de travail."
  },
  {
    label: "Réseau & Wi‑Fi",
    icon: "📶",
    keywords: [
      "routeur",
      "switch",
      "wifi",
      "wi-fi",
      "répéteur",
      "repeteur",
      "rj45",
      "clé wifi",
      "firewall",
      "ethernet",
      "d-link",
      "dlink",
      "linksys",
      "mikrotik",
      "mercusys",
      "deco",
      "mesh",
      "plc",
      "cpl",
      "antenne",
      "ftp cat",
      "cat6",
      "cat5",
      "connecteur rj45",
      "pince",
      "testeur",
      "adaptateur ethernet"
    ],
    blurb: "Connectivité, Wi-Fi et équipements réseau."
  },
  {
    label: "Stockage & USB",
    icon: "💾",
    keywords: [
      "ssd",
      "disque",
      "hdd",
      "nas",
      "usb",
      "clé",
      "stockage",
      "nvme",
      "m.2",
      "crucial",
      "kingston",
      "lexar",
      "wd blue",
      "verbatim",
      "emtec",
      "pcie 4",
      "pcie 5"
    ],
    blurb: "SSD, disques externes et clés USB."
  },
  {
    label: "Périphériques & audio",
    icon: "🖱️",
    keywords: ["souris", "clavier", "webcam", "casque", "micro", "headset", "marshall", "soundcore"],
    blurb: "Claviers, souris, webcams et casques."
  },
  {
    label: "Chargeurs & batteries",
    icon: "🔌",
    keywords: [
      "chargeur",
      "adaptateur",
      "secteur",
      "batterie",
      "magsafe",
      "surface",
      "hp 19.5v",
      "dell 19.5v",
      "asus",
      "lenovo",
      "msi",
      "gamer",
      "gaming",
      "usb-c",
      "type c",
      "type-c",
      "pd",
      "100w",
      "180w",
      "230w",
      "240w",
      "280w"
    ],
    blurb: "Chargeurs compatibles, batteries et alimentation."
  },
  {
    label: "Énergie & protection",
    icon: "⚡",
    keywords: ["onduleur", "powerbank", "parafoudre", "multiprise", "protection"],
    blurb: "Onduleurs, powerbanks et protection électrique."
  },
  {
    label: "Impression & consommables",
    icon: "🖨️",
    keywords: ["imprimante", "toner", "encre", "cartouche", "hp 652", "hp 903", "hp 305"],
    blurb: "Imprimantes, cartouches et consommables."
  },
  {
    label: "Composants",
    icon: "⚙️",
    keywords: [
      "ram",
      "mémoire",
      "barrette",
      "memoire",
      "carte",
      "ventilateur",
      "ddr4",
      "ddr5",
      "alimentation",
      "power supply",
      "thermalright",
      "wjcoolman",
      "aerocool",
      "80 plus",
      "pcie",
      "nvme",
      "disque serveur",
      "sas",
      "hpe"
    ],
    blurb: "Mémoire et composants matériels."
  },
  {
    label: "Hubs & connectique",
    icon: "🔗",
    keywords: ["hub", "adaptateur", "displayport", "hdmi", "usb-c", "câble", "cable"],
    blurb: "Hubs USB-C, câbles et adaptateurs."
  }
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
  summary?: string;
  weeklyHours?: string;
  eveningClasses?: boolean;
  brochureUrl?: string;
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
  },
  {
    name: "Introduction à l'intelligence artificielle",
    category: "Outils digitaux & IA",
    level: "Débutant",
    format: "Présentiel / Visio",
    duration: "8 semaines",
    weeklyHours: "4 heures / semaine",
    price: 85_000,
    image: "/slide-transformation.png",
    badge: "⭐ Recommandé",
    outcomes: ["Comprendre les fondamentaux IA", "Manipuler des outils IA actuels", "Identifier des cas d'usage métier"]
  },
  {
    name: "Formation Réseaux Sociaux",
    category: "Entrepreneuriat",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "4 semaines",
    weeklyHours: "4 heures / semaine",
    eveningClasses: true,
    price: 40_000,
    image: "/slide-business.png",
    summary:
      "Elève ta carrière avec notre formation professionnelle en Réseaux Sociaux. En 12 semaines, deviens un spécialiste de la communication digitale et maîtrise la création et la gestion de campagnes efficaces sur les réseaux sociaux.",
    brochureUrl: "/contact",
    badge: "🔥 Populaire",
    outcomes: ["Créer une stratégie éditoriale", "Piloter des campagnes social media", "Analyser la performance et ajuster"]
  },
  {
    name: "L’IA pour les entrepreneurs",
    category: "Entrepreneuriat",
    level: "Débutant",
    format: "Présentiel / Visio",
    duration: "6 semaines",
    weeklyHours: "3 heures / semaine",
    price: 70_000,
    image: "/slide-business.png",
    badge: "⭐ Recommandé",
    outcomes: ["Automatiser des tâches répétitives", "Produire du contenu rapidement", "Améliorer la productivité commerciale"]
  },
  {
    name: "Formation Développement Web",
    category: "Développement web",
    level: "Débutant",
    format: "Présentiel / Visio",
    duration: "12 semaines",
    weeklyHours: "4 heures / semaine",
    price: 129_000,
    image: "/slide-sites.png",
    badge: "🔥 Populaire",
    outcomes: ["Maîtriser HTML/CSS/JavaScript", "Publier un site complet", "Utiliser Git/GitHub en équipe"]
  },
  {
    name: "UX & UI Design",
    category: "Infographie & design",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "10 semaines",
    weeklyHours: "4 heures / semaine",
    price: 110_000,
    image: "/slide-visuel.png",
    badge: "⭐ Recommandé",
    outcomes: ["Concevoir des interfaces intuitives", "Réaliser des wireframes/prototypes", "Tester l'expérience utilisateur"]
  },
  {
    name: "Graphic Design",
    category: "Infographie & design",
    level: "Débutant",
    format: "Présentiel / Visio",
    duration: "8 semaines",
    weeklyHours: "4 heures / semaine",
    price: 90_000,
    image: "/slide-visuel.png",
    outcomes: ["Créer une identité visuelle", "Utiliser les outils Adobe principaux", "Produire des supports social media"]
  },
  {
    name: "Montage Vidéo : De Capcut à Adobe Premiere",
    category: "Infographie & design",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "6 semaines",
    weeklyHours: "4 heures / semaine",
    price: 85_000,
    image: "/slide-3.jpg",
    outcomes: ["Monter des vidéos engageantes", "Gérer transitions/effets/son", "Exporter au bon format selon plateforme"]
  },
  {
    name: "Formation e-commerce",
    category: "Entrepreneuriat",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "8 semaines",
    weeklyHours: "4 heures / semaine",
    price: 95_000,
    image: "/slide-business.png",
    outcomes: ["Structurer un catalogue en ligne", "Configurer acquisition et conversion", "Suivre les KPI ventes"]
  },
  {
    name: "Introduction to Cybersecurity",
    category: "Cybersécurité & réseau",
    level: "Débutant",
    format: "Présentiel / Visio",
    duration: "6 semaines",
    weeklyHours: "3 heures / semaine",
    price: 65_000,
    image: "/slide-transformation.png",
    outcomes: ["Identifier les menaces courantes", "Mettre en place les protections de base", "Appliquer les bonnes pratiques équipe"]
  },
  {
    name: "Introduction au Design Graphique",
    category: "Infographie & design",
    level: "Débutant",
    format: "Présentiel / Visio",
    duration: "6 semaines",
    weeklyHours: "4 heures / semaine",
    price: 60_000,
    image: "/slide-visuel.png",
    outcomes: ["Comprendre les fondamentaux visuels", "Créer des compositions efficaces", "Préparer des visuels pour impression et web"]
  },
  {
    name: "Formation Bureautique",
    category: "Bureautique & productivité",
    level: "Débutant",
    format: "Présentiel / Visio",
    duration: "6 semaines",
    weeklyHours: "4 heures / semaine",
    price: 45_000,
    image: "/slide-support.png",
    badge: "💰 Accessible",
    outcomes: ["Maîtriser Word/Excel/PowerPoint", "Produire des documents pro", "Gagner du temps avec les raccourcis et modèles"]
  },
  {
    name: "Front End Developer – React JS",
    category: "Développement web",
    level: "Avancé",
    format: "Présentiel / Visio",
    duration: "12 semaines",
    weeklyHours: "4 heures / semaine",
    price: 150_000,
    image: "/slide-sites.png",
    badge: "🎓 Certifiant",
    outcomes: ["Créer des interfaces React modernes", "Gérer état et navigation", "Déployer un front-end professionnel"]
  },
  {
    name: "Développement d'application et intégration de solutions",
    category: "Développement web",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "10 semaines",
    weeklyHours: "4 heures / semaine",
    price: 120_000,
    image: "/slide-sites.png",
    summary:
      "Formation pratique orientée projet pour concevoir des applications utiles et intégrer des solutions digitales en contexte professionnel.",
    outcomes: ["Concevoir une application métier", "Intégrer des API et outils externes", "Livrer un prototype exploitable"]
  },
  {
    name: "Marketing digital et stratégie de communication",
    category: "Entrepreneuriat",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "8 semaines",
    weeklyHours: "4 heures / semaine",
    price: 75_000,
    image: "/slide-business.png",
    summary:
      "Formation pratique en marketing digital pour capter des clients sur internet et structurer une stratégie de communication performante.",
    outcomes: ["Construire un plan de communication", "Lancer des campagnes performantes", "Mesurer et optimiser les résultats"]
  },
  {
    name: "Infographie professionnelle (visuels & vidéos)",
    category: "Infographie & design",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "8 semaines",
    weeklyHours: "4 heures / semaine",
    price: 90_000,
    image: "/slide-visuel.png",
    summary:
      "Apprenez à produire des visuels et vidéos professionnels avec une approche orientée cas pratiques et projets réels.",
    outcomes: ["Créer des visuels de marque", "Monter des contenus vidéo attractifs", "Standardiser une identité visuelle"]
  },
  {
    name: "Microsoft Office avancé (Word, Excel, PowerPoint)",
    category: "Bureautique & productivité",
    level: "Débutant",
    format: "Présentiel / Visio",
    duration: "6 semaines",
    weeklyHours: "4 heures / semaine",
    price: 50_000,
    image: "/slide-support.png",
    badge: "💰 Accessible",
    summary:
      "Formation complète sur les outils Office essentiels pour gagner en efficacité sur les documents, calculs et présentations.",
    outcomes: ["Automatiser les tâches bureautiques", "Créer des présentations percutantes", "Produire des rapports professionnels"]
  },
  {
    name: "Réseaux informatiques pratiques",
    category: "Cybersécurité & réseau",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "8 semaines",
    weeklyHours: "4 heures / semaine",
    price: 85_000,
    image: "/slide-transformation.png",
    summary:
      "Maîtrisez les bases et pratiques du métier réseau pour intervenir sur des environnements LAN/Wi-Fi et dépannage terrain.",
    outcomes: ["Configurer un réseau local", "Diagnostiquer les pannes courantes", "Appliquer les bonnes pratiques d'exploitation"]
  },
  {
    name: "Logiciels métiers (comptabilité, gestion, activité)",
    category: "Informatique",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "6 semaines",
    weeklyHours: "3 heures / semaine",
    price: 65_000,
    image: "/slide-business.png",
    summary:
      "Prenez en main les logiciels métiers de votre secteur avec des cas pratiques pour devenir autonome rapidement.",
    outcomes: ["Utiliser un logiciel métier efficacement", "Structurer un flux de travail opérationnel", "Produire des livrables fiables"]
  },
  {
    name: "Sécurité informatique (hacking éthique & protection)",
    category: "Cybersécurité & réseau",
    level: "Intermédiaire",
    format: "Présentiel / Visio",
    duration: "8 semaines",
    weeklyHours: "4 heures / semaine",
    price: 95_000,
    image: "/slide-transformation.png",
    summary:
      "Comprenez les méthodes d'attaque et les protections concrètes pour sécuriser les systèmes et les données de votre organisation.",
    outcomes: ["Identifier les menaces majeures", "Renforcer la posture de sécurité", "Mettre en place des mesures de protection"]
  },
  {
    name: "Vidéosurveillance et sécurité électronique",
    category: "Cybersécurité & réseau",
    level: "Débutant",
    format: "Présentiel / Visio",
    duration: "6 semaines",
    weeklyHours: "4 heures / semaine",
    price: 80_000,
    image: "/slide-1.jpg",
    summary:
      "Formation métier pour installer et exploiter des solutions de vidéosurveillance dans les contextes résidentiels et professionnels.",
    outcomes: ["Installer une architecture de base", "Configurer les équipements essentiels", "Assurer le suivi et la maintenance"]
  },
  {
    name: "Initiation à l'informatique (fondamentaux)",
    category: "Informatique",
    level: "Débutant",
    format: "Présentiel / Visio",
    duration: "4 semaines",
    weeklyHours: "3 heures / semaine",
    price: 30_000,
    image: "/slide-support.png",
    badge: "💰 Accessible",
    summary:
      "Parcours d'initiation tout-en-un: ordinateur, internet, navigation prudente et bonnes pratiques d'usage pour bien démarrer.",
    outcomes: ["Comprendre les composants essentiels", "Naviguer sur internet en sécurité", "Utiliser les outils numériques du quotidien"]
  }
];

export const academyEbooks = [
  { title: "Guide Excel complet", desc: "Formules, TCD, automatisation.", price: 10_000, image: "/slide-support.png", file: "/ebooks/guide-excel-complet.pdf" },
  { title: "Pack Word & PDF pro", desc: "Mise en page longue durée, styles, sommaires.", price: 9_000, image: "/slide-2.jpg", file: "/ebooks/pack-word-pdf-pro.pdf" },
  { title: "Lancer son activité (0 → 1)", desc: "Étude de marché, offre et canaux.", price: 8_000, image: "/slide-business.png", file: "/ebooks/lancer-son-activite.pdf" },
  { title: "Pack CV & entretien", desc: "Templates + méthode STAR.", price: 7_000, image: "/slide-3.jpg", file: "/ebooks/pack-cv-entretien.pdf" },
  { title: "Cybersécurité TPE", desc: "Checklist MFA, sauvegardes, phishing.", price: 9_000, image: "/slide-transformation.png", file: "/ebooks/cybersecurite-tpe.pdf" },
  { title: "Introduction Git & GitHub", desc: "Branches, PR, bonnes habitudes.", price: 8_000, image: "/slide-sites.png", file: "/ebooks/introduction-git-github.pdf" },
  { title: "Canva Express", desc: "Créer des visuels pros rapidement.", price: 4_000, image: "/slide-visuel.png", file: "/ebooks/canva-express.pdf" },
  { title: "Prompting IA pratique", desc: "Prompts utiles pour business et productivité.", price: 6_000, image: "/slide-transformation.png", file: "/ebooks/prompting-ia-pratique.pdf" },
  { title: "Mini guide PowerPoint impact", desc: "Structurer des slides claires et convaincantes.", price: 5_000, image: "/slide-2.jpg", file: "/ebooks/mini-guide-powerpoint-impact.pdf" },
  { title: "Tableaux de bord Excel PME", desc: "KPI essentiels et suivi mensuel.", price: 10_000, image: "/slide-support.png", file: "/ebooks/tableaux-bord-excel-pme.pdf" },
  { title: "Guide prospection WhatsApp", desc: "Scripts de messages et relances.", price: 3_000, image: "/slide-business.png", file: "/ebooks/guide-prospection-whatsapp.pdf" },
  { title: "Bases du design graphique", desc: "Couleurs, typographie et composition.", price: 6_000, image: "/slide-visuel.png", file: "/ebooks/bases-design-graphique.pdf" },
  { title: "Checklist e-commerce local", desc: "Étapes pour lancer une boutique rentable.", price: 4_000, image: "/slide-business.png", file: "/ebooks/checklist-ecommerce-local.pdf" },
  { title: "Pack productivité étudiant", desc: "Méthodes et outils pour gagner du temps.", price: 2_000, image: "/slide-support.png", file: "/ebooks/pack-productivite-etudiant.pdf" },
  { title: "Cyber hygiène personnelle", desc: "Protéger ses comptes et appareils.", price: 2_500, image: "/slide-transformation.png", file: "/ebooks/cyber-hygiene-personnelle.pdf" },
  { title: "Notion pour débutants", desc: "Organiser notes, tâches et projets.", price: 5_500, image: "/slide-business.png", file: "/ebooks/notion-pour-debutants.pdf" },
  { title: "Guide branding personnel", desc: "Positionner son image professionnelle.", price: 7_500, image: "/slide-visuel.png", file: "/ebooks/guide-branding-personnel.pdf" },
  { title: "Email pro efficace", desc: "Rédaction, structure et bonnes pratiques.", price: 3_500, image: "/slide-support.png", file: "/ebooks/email-pro-efficace.pdf" },
  { title: "Mini manuel SEO local", desc: "Référencer son activité en local.", price: 6_500, image: "/slide-sites.png", file: "/ebooks/mini-manuel-seo-local.pdf" },
  { title: "Gestion financière simple", desc: "Budget, marge et suivi de trésorerie.", price: 8_500, image: "/slide-business.png", file: "/ebooks/gestion-financiere-simple.pdf" }
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
    name: "Starter",
    audience: "Indépendants et petites structures",
    fromPricePerPosteFcfa: 20_000,
    highlights: [
      "Maintenance préventive (2 passages / mois)",
      "Dépannage à distance",
      "Mises à jour et sécurité de base",
      "Sauvegarde simple des postes",
      "Assistance utilisateurs"
    ],
    sla: "Temps de réponse < 8h"
  },
  {
    name: "Pro",
    audience: "PME en croissance",
    fromPricePerPosteFcfa: 45_000,
    highlights: [
      "Tout le pack Starter",
      "Supervision des postes",
      "Maintenance proactive",
      "Gestion Microsoft 365 (niveau basique)",
      "Heures d’intervention incluses",
      "Optimisation des performances"
    ],
    sla: "Temps de réponse < 4h"
  },
  {
    name: "Premium",
    audience: "Entreprises exigeantes",
    fromPricePerPosteFcfa: 75_000,
    highlights: [
      "Tout le pack Pro",
      "Monitoring avancé 24/7 (option)",
      "Rapport mensuel détaillé",
      "Comité de suivi trimestriel",
      "Sécurité renforcée",
      "Astreinte (option)"
    ],
    sla: "SLA personnalisé, intervention critique rapide"
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
    title: "Pack Starter – Essentiel",
    badge: "",
    subtitle: "💻 Support & maintenance IT",
    audience: "Particuliers, étudiants, freelances",
    items: [
      "👉 Travaillez sans stress au quotidien",
      "Assistance à distance",
      "Dépannage logiciel",
      "Installation de programmes",
      "Optimisation PC",
      "Conseils personnalisés"
    ],
    fromPriceFcfa: 10_000
  },
  {
    title: "Pack Pro – PME",
    badge: "⭐ Le plus choisi",
    subtitle: "💻 Support & maintenance IT",
    audience: "PME, startups",
    items: [
      "👉 Votre entreprise fonctionne sans interruption",
      "Support utilisateurs",
      "Maintenance régulière",
      "Intervention rapide",
      "Gestion des incidents",
      "Optimisation réseau"
    ],
    fromPriceFcfa: 75_000
  },
  {
    title: "Pack Premium – Entreprise",
    badge: "",
    subtitle: "💻 Support & maintenance IT",
    audience: "Entreprises structurées",
    items: [
      "👉 Zéro panne, sécurité maximale",
      "Support prioritaire",
      "Maintenance complète",
      "Surveillance des systèmes",
      "Sécurité informatique",
      "Reporting mensuel"
    ],
    fromPriceFcfa: 150_000
  },
  {
    title: "Pack Starter – Lancement",
    badge: "",
    subtitle: "🎨 Identité visuelle",
    audience: "Marques en démarrage",
    items: ["Création de logo", "Palette de couleurs", "Typographie", "2 propositions + retouches"],
    fromPriceFcfa: 60_000
  },
  {
    title: "Pack Standard – Professionnel",
    badge: "⭐",
    subtitle: "🎨 Identité visuelle",
    audience: "PME, entrepreneurs",
    items: ["Logo professionnel", "Charte graphique", "Cartes de visite", "Visuels réseaux sociaux"],
    fromPriceFcfa: 180_000
  },
  {
    title: "Pack Premium – Branding complet",
    badge: "",
    subtitle: "🎨 Identité visuelle",
    audience: "Entreprises ambitieuses",
    items: ["Branding complet", "Charte graphique avancée", "Kit réseaux sociaux", "Templates marketing", "Supports print"],
    fromPriceFcfa: 450_000
  },
  {
    title: "Pack Starter – Présence",
    badge: "",
    subtitle: "📱 Community management",
    audience: "Petites structures",
    items: ["Création/optimisation de page", "8 publications/mois", "Design simple", "Programmation"],
    fromPriceFcfa: 50_000
  },
  {
    title: "Pack Growth – Développement",
    badge: "⭐",
    subtitle: "📱 Community management",
    audience: "PME en croissance",
    items: ["12 à 16 publications", "Visuels professionnels", "Rédaction optimisée", "Gestion des interactions"],
    fromPriceFcfa: 120_000
  },
  {
    title: "Pack Premium – Domination",
    badge: "",
    subtitle: "📱 Community management",
    audience: "Marques ambitieuses",
    items: ["Publications intensives", "Stratégie marketing complète", "Analyse performances", "Gestion complète"],
    fromPriceFcfa: 200_000
  },
  {
    title: "Site Vitrine",
    badge: "",
    subtitle: "🌐 Développement web",
    audience: "TPE / indépendants",
    items: [
      "👉 Présentez votre activité en ligne",
      "🎁 Hébergement offert (1 an)",
      "Design moderne responsive",
      "5 à 8 pages",
      "Formulaire de contact",
      "Intégration WhatsApp",
      "Formation prise en main"
    ],
    fromPriceFcfa: 200_000
  },
  {
    title: "Site E-commerce",
    badge: "",
    subtitle: "🌐 Développement web",
    audience: "Commerçants",
    items: [
      "👉 Vendez vos produits en ligne",
      "🎁 Hébergement offert (1 an)",
      "Catalogue produits",
      "Paiement (Mobile Money / lien)",
      "Gestion des commandes",
      "Interface admin simple"
    ],
    fromPriceFcfa: 300_000
  },
  {
    title: "Site sur mesure",
    badge: "",
    subtitle: "🌐 Développement web",
    audience: "Entreprises et projets spécifiques",
    items: ["Adapté aux deux autres packs de développement", "Fonctionnalités personnalisées", "Architecture adaptée au besoin métier"],
    fromPriceFcfa: 400_000
  },
  {
    title: "Audit Sécurité Express",
    badge: "",
    subtitle: "🔐 Cybersécurité",
    audience: "PME et structures professionnelles",
    items: ["Analyse de votre système", "Identification des failles", "Top risques", "Plan d’action"],
    fromPriceFcfa: 250_000
  },
  {
    title: "Audit & Diagnostic IT",
    badge: "",
    subtitle: "⚡ Offre bonus",
    audience: "Toute structure avant investissement IT",
    items: ["👉 Comprendre vos problèmes avant d’investir", "Analyse rapide", "Recommandations", "Plan d’amélioration"],
    fromPriceFcfa: 30_000
  }
];

export const itAddOns = [
  "Hors matériel",
  "Hors interventions exceptionnelles",
  "Hors développements spécifiques"
];
