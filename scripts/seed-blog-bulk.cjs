/**
 * Insère (ou met à jour) 12 articles publiés par pilier éditorial (60 articles).
 * Prérequis : migrations appliquées (013 + 018).
 * Usage : npm run seed:blog
 */
const mysql = require("mysql2/promise");

function getEnv(name, fallback = undefined) {
  const value = process.env[name];
  return value === undefined || value === "" ? fallback : value;
}

function buildContent(title, pillarLabel) {
  return `## Introduction

Cet article fait partie de la série HAITECH sur ${pillarLabel}. Nous restons volontairement concrets : objectifs, priorités, erreurs fréquentes et prochaines étapes.

## Ce que vous allez prendre en décision

- Un point de vue orienté terrain (PME, équipes réduites, budgets maîtrisés).
- Des repères actionnables sans jargon inutile.
- Une lecture pensée pour avancer vite, pas pour en rester à la théorie.

### Points clés

- Clarifiez le problème avant d'investir dans une solution.
- Mesurez ce qui compte (temps, risques, coûts, conversion).
- Industrialisez : processus, documentation, automatisation raisonnable.

## Conclusion

Si vous voulez aller plus loin sur "${title}", HAITECH GROUP peut vous aider à prioriser et à exécuter. Commencez par un échange via /contact : nous reformulons votre besoin et proposons une feuille de route réaliste.`;
}

function buildFaq(title) {
  return [
    {
      question: `Cet article "${title}" s'adresse à quel type d'organisation ?`,
      answer:
        "Il s'adresse surtout aux PME et structures en croissance qui veulent structurer leur digital sans se disperser : équipes réduites, besoin de clarté, et envie de résultats mesurables."
    },
    {
      question: "Quelle est la prochaine étape recommandée après lecture ?",
      answer:
        "Notez 3 actions prioritaires sur 14 jours, puis validez vos hypothèses avec un spécialiste. HAITECH GROUP peut vous accompagner sur le diagnostic et la mise en œuvre via la page /contact."
    }
  ];
}

const PILLARS = [
  {
    slugKey: "seo",
    category: "seo",
    label: "SEO et visibilité business HAITECH",
    titles: [
      "Refonte SEO HAITECH : comment augmenter les leads B2B en 90 jours",
      "SEO local pour services IT : méthode HAITECH pour dominer sa zone",
      "Audit technique SEO HAITECH : checklist avant mise en production",
      "Pages services HAITECH : structure SEO qui convertit en demandes de devis",
      "Cluster de contenus SEO : stratégie HAITECH pour PME en croissance",
      "Google Business Profile et SEO local : approche terrain HAITECH",
      "Maillage interne orienté conversion : cadre HAITECH pour sites corporate",
      "SEO + identité visuelle : aligner message, design et intention utilisateur",
      "Core Web Vitals sur site vitrine : playbook HAITECH d'optimisation",
      "Brief rédaction SEO HAITECH : écrire pour Google et pour les décideurs",
      "Landing pages campagnes + SEO : architecture hybride HAITECH",
      "KPIs SEO business : tableau de bord HAITECH pour direction générale"
    ]
  },
  {
    slugKey: "it",
    category: "it",
    label: "Support IT et maintenance HAITECH",
    titles: [
      "Support IT externalisé HAITECH : SLA, process et gains mesurables",
      "Maintenance informatique préventive : protocole HAITECH pour PME",
      "Helpdesk HAITECH : organiser tickets, priorités et délais de résolution",
      "Sécurisation des postes utilisateurs : standards HAITECH à déployer",
      "Plan de sauvegarde entreprise : méthode HAITECH de continuité d'activité",
      "Standardisation du parc informatique : cadre HAITECH sans rigidité",
      "Monitoring proactif IT : détecter avant la panne avec HAITECH",
      "Télétravail sécurisé : kit de bonnes pratiques HAITECH pour équipes mixtes",
      "Messagerie d'entreprise : sécuriser et stabiliser avec HAITECH",
      "Politique de mises à jour : gouvernance HAITECH sans interruption métier",
      "Documentation IT utile : modèle HAITECH pour réduire la dépendance humaine",
      "Roadmap IT annuelle : prioriser investissements et risques avec HAITECH"
    ]
  },
  {
    slugKey: "business",
    category: "business",
    label: "Business digital et croissance HAITECH",
    titles: [
      "Stratégie digitale HAITECH : aligner objectifs commerciaux et canaux d'acquisition",
      "Tunnel de conversion B2B : méthode HAITECH pour passer de visite à devis",
      "CRM et pipeline de vente : framework HAITECH pour équipes commerciales",
      "Pilotage de croissance : dashboard HAITECH pour dirigeants PME",
      "Offre de services : clarifier la proposition de valeur avec HAITECH",
      "Automatisation marketing : séquences HAITECH pour qualification des leads",
      "Expérience client digitale : modèle HAITECH pour fidéliser plus vite",
      "Acquisition multicanale : approche HAITECH SEO + social + ads",
      "Processus commerciaux : éliminer les fuites avec les standards HAITECH",
      "Plan de croissance trimestriel : méthode HAITECH orientée exécution",
      "Structurer une équipe digitale interne : retour d'expérience HAITECH",
      "Rentabilité des actions marketing : lecture HAITECH des bons indicateurs"
    ]
  },
  {
    slugKey: "cyber",
    category: "cybersécurité",
    label: "Cybersécurité opérationnelle HAITECH",
    titles: [
      "Audit cybersécurité HAITECH : prioriser les risques critiques en entreprise",
      "Anti-phishing en PME : programme de sensibilisation HAITECH efficace",
      "MFA et gestion des accès : standards HAITECH pour réduire les intrusions",
      "Plan de réponse incident : kit opérationnel HAITECH en 7 étapes",
      "Ransomware : stratégie HAITECH de prévention et reprise rapide",
      "Politique de mots de passe : déploiement HAITECH sans friction utilisateur",
      "Sécurité des fournisseurs : grille HAITECH d'évaluation du risque tiers",
      "Journalisation et traçabilité : ce que HAITECH recommande de conserver",
      "Durcissement des postes et serveurs : baseline sécurité HAITECH",
      "Sécurité cloud : erreurs fréquentes corrigées par les audits HAITECH",
      "Conformité sécurité pragmatique : approche HAITECH orientée résultat",
      "Feuille de route cybersécurité annuelle : modèle HAITECH pour PME"
    ]
  },
  {
    slugKey: "cloud",
    category: "cloud",
    label: "Cloud, web et infrastructure HAITECH",
    titles: [
      "Migration cloud avec HAITECH : critères pour décider sans se tromper",
      "Architecture web scalable : principes HAITECH pour plateformes PME",
      "Déploiement CI/CD : pipeline HAITECH pour réduire les erreurs de release",
      "Optimisation coûts cloud : méthode HAITECH FinOps pour dirigeants",
      "Sécurité IAM cloud : configuration recommandée par HAITECH",
      "Sauvegardes cloud : stratégie HAITECH de restauration testée",
      "Monitoring applicatif : stack HAITECH pour visibilité temps réel",
      "Hébergement web professionnel : standards HAITECH de disponibilité",
      "Plan de reprise d'activité cloud : design HAITECH prêt à l'emploi",
      "API et microservices : quand HAITECH recommande de découper",
      "Infrastructure hybride : cas clients HAITECH et critères de choix",
      "Gouvernance cloud : tableau de bord HAITECH pour CTO et DSI"
    ]
  },
  {
    slugKey: "branding",
    category: "branding",
    label: "Community management et identité visuelle HAITECH",
    titles: [
      "Identité visuelle d'entreprise : méthode HAITECH pour une image cohérente",
      "Charte graphique opérationnelle : guide HAITECH pour équipes marketing",
      "Community management B2B : calendrier éditorial HAITECH qui convertit",
      "Design social media : système HAITECH de templates performants",
      "Positionnement de marque : atelier HAITECH pour clarifier le message",
      "Refonte logo et univers visuel : cadre HAITECH sans perte d'historique",
      "Ligne éditoriale réseaux sociaux : formule HAITECH orientée business",
      "Campagnes visuelles : workflow HAITECH entre marketing et graphisme",
      "Branding + site web : comment HAITECH aligne design et conversion",
      "Pilotage community management : KPIs HAITECH utiles en direction",
      "Production de visuels attractifs : process HAITECH rapide et consistant",
      "E-réputation : protocole HAITECH pour renforcer la crédibilité digitale"
    ]
  }
];

async function run() {
  const connection = await mysql.createConnection({
    host: getEnv("DB_HOST", "127.0.0.1"),
    user: getEnv("DB_USER", "root"),
    password: getEnv("DB_PASSWORD", ""),
    database: getEnv("DB_NAME", "haitech_group"),
    port: Number(getEnv("DB_PORT", "3306")),
    multipleStatements: false
  });

  const rows = [];
  PILLARS.forEach((pillar, pillarIndex) => {
    pillar.titles.forEach((title, idx) => {
      const n = String(idx + 1).padStart(2, "0");
      const slug = `blog-${pillar.slugKey}-${n}`;
      const excerpt = `${title} : repères concrets pour avancer vite, réduire les risques et aligner vos équipes. Série HAITECH ${pillar.label}.`;
      const content = buildContent(title, pillar.label);
      const metaTitle = `${title} | HAITECH GROUP`;
      const metaDescription = excerpt.slice(0, 500);
      const faqJson = JSON.stringify(buildFaq(title));
      const publishedOffset = 400 + idx + pillarIndex * 20;
      rows.push({
        title,
        slug,
        excerpt,
        content,
        cover_image_path: null,
        category: pillar.category,
        status: "published",
        publishedOffset,
        meta_title: metaTitle.slice(0, 255),
        meta_description: metaDescription.slice(0, 500),
        og_title: title.slice(0, 255),
        og_description: metaDescription.slice(0, 500),
        og_image_path: null,
        author_name: "HAITECH GROUP",
        faq_json: faqJson
      });
    });
  });

  for (const r of rows) {
    const offset = Math.max(0, Math.min(5000, Math.floor(Number(r.publishedOffset) || 0)));
    const statement = `
    INSERT INTO blog_posts (
      title, slug, excerpt, content, cover_image_path, category, status, published_at,
      meta_title, meta_description, og_title, og_description, og_image_path,
      author_name, faq_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL ${offset} DAY), ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      excerpt = VALUES(excerpt),
      content = VALUES(content),
      cover_image_path = VALUES(cover_image_path),
      category = VALUES(category),
      status = VALUES(status),
      published_at = VALUES(published_at),
      meta_title = VALUES(meta_title),
      meta_description = VALUES(meta_description),
      og_title = VALUES(og_title),
      og_description = VALUES(og_description),
      og_image_path = VALUES(og_image_path),
      author_name = VALUES(author_name),
      faq_json = VALUES(faq_json)
  `;
    await connection.execute(statement, [
      r.title,
      r.slug,
      r.excerpt,
      r.content,
      r.cover_image_path,
      r.category,
      r.status,
      r.meta_title,
      r.meta_description,
      r.og_title,
      r.og_description,
      r.og_image_path,
      r.author_name,
      r.faq_json
    ]);
  }

  await connection.end();
  console.log(`Seed blog terminé : ${rows.length} articles (6 thématiques × 12).`);
}

run().catch((error) => {
  console.error("Erreur seed blog:", error.message);
  process.exit(1);
});
