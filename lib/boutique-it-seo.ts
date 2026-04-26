import { WHATSAPP_E164 } from "@/lib/offers-catalog";
import { boutiqueItValidatedCatalog } from "@/lib/boutique-it-validated-catalog";
import { absUrl, getSiteBaseUrl } from "@/lib/site-url";

const BOUTIQUE_PATH = "/boutique-it";

/** Données structurées (schema.org) pour la page catalogue vitrine. */
export function buildBoutiqueItStructuredData(): Record<string, unknown> {
  const base = getSiteBaseUrl();
  const pageUrl = absUrl(BOUTIQUE_PATH);
  const logoUrl = absUrl("/logo-haitech.jpg");

  const itemListElement = boutiqueItValidatedCatalog.slice(0, 80).map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: p.name,
      description: p.description,
      image: absUrl(p.image),
      category: p.category,
      offers: {
        "@type": "Offer",
        priceCurrency: "XOF",
        price: p.price,
        availability: "https://schema.org/PreOrder",
        url: pageUrl,
        seller: { "@type": "Organization", name: "HAITECH GROUP" }
      }
    }
  }));

  const faqEntity = [
    {
      q: "Quels produits sont disponibles dans la Boutique IT HAITECH GROUP ?",
      a: "La boutique propose des ordinateurs, packs prêts à l'emploi, accessoires essentiels, stockage, réseau et solutions de maintenance."
    },
    {
      q: "Comment commander un produit informatique ?",
      a: "Vous pouvez commander directement depuis la page ou demander le catalogue complet via WhatsApp avec vos besoins."
    },
    {
      q: "Proposez-vous une garantie et un accompagnement ?",
      a: "Oui, nos offres incluent un accompagnement, la configuration et un suivi SAV selon le type de produit."
    },
    {
      q: "Livrez-vous en Côte d'Ivoire ?",
      a: "Oui, nous organisons la livraison selon la zone et la disponibilité des références."
    },
    {
      q: "Peut-on demander une référence non affichée sur la vitrine ?",
      a: "Oui, une partie du catalogue est gérée sur demande. Contactez-nous sur WhatsApp pour un chiffrage rapide."
    }
  ].map((step) => ({
    "@type": "Question",
    name: step.q,
    acceptedAnswer: { "@type": "Answer", text: step.a }
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: "HAITECH GROUP",
        url: base,
        logo: logoUrl,
        sameAs: [`https://wa.me/${WHATSAPP_E164}`]
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: "HAITECH GROUP",
        publisher: { "@id": `${base}/#organization` },
        inLanguage: "fr-CI"
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Boutique IT — matériel informatique en Côte d'Ivoire",
        description:
          "Ordinateurs, écrans gamer et pro, SSD NVMe, RAM, réseau, chargeurs et accessoires. Prix indicatifs FCFA, commande et devis via HAITECH GROUP.",
        isPartOf: { "@id": `${base}/#website` },
        inLanguage: "fr-CI",
        about: { "@type": "Thing", name: "Matériel informatique professionnel et grand public" }
      },
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: "Catalogue Boutique IT HAITECH GROUP",
        inLanguage: "fr-CI",
        about: { "@type": "Thing", name: "Produits et solutions informatiques" },
        hasPart: { "@id": `${pageUrl}#itemlist` }
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: "Catalogue Boutique IT",
        numberOfItems: boutiqueItValidatedCatalog.length,
        itemListElement
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faqEntity
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: "Conseil et accompagnement achat IT",
        provider: { "@id": `${base}/#organization` },
        areaServed: "Côte d'Ivoire",
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `https://wa.me/${WHATSAPP_E164}`
        }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: base },
          { "@type": "ListItem", position: 2, name: "Boutique IT", item: pageUrl }
        ]
      }
    ]
  };
}
