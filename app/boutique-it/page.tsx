import type { Metadata } from "next";
import { defaultSiteMetadata } from "@/lib/site-default-metadata";
import { buildBoutiqueItStructuredData } from "@/lib/boutique-it-seo";
import { getSiteBaseUrl } from "@/lib/site-url";
import { BoutiqueItPageClient } from "./boutique-it-page-client";

const canonicalUrl = `${getSiteBaseUrl()}/boutique-it`;

const description =
  "Boutique IT HAITECH GROUP : ordinateurs portables et fixes, packs prêts à l'emploi, accessoires, stockage, réseau et maintenance. Prix FCFA indicatifs, commande rapide via WhatsApp et accompagnement SAV.";

export const metadata: Metadata = {
  ...defaultSiteMetadata,
  title: "Boutique IT — ordinateurs, écrans, SSD, réseau | HAITECH GROUP",
  description,
  keywords: [
    "Boutique IT Côte d'Ivoire",
    "ordinateur Abidjan",
    "ordinateur reconditionné",
    "pack bureau informatique",
    "pack télétravail",
    "pack étudiant",
    "PC portable",
    "écran gamer",
    "SSD NVMe",
    "RAM DDR4",
    "chargeur laptop",
    "routeur Wi-Fi",
    "switch Ethernet",
    "Hub USB-C",
    "Boutique informatique Abidjan",
    "HAITECH GROUP"
  ],
  alternates: { canonical: canonicalUrl },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    ...defaultSiteMetadata.openGraph,
    title: "Boutique IT — matériel informatique | HAITECH GROUP",
    description,
    url: canonicalUrl,
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: `${getSiteBaseUrl()}/logo-haitech.jpg`,
        width: 1200,
        height: 630,
        alt: "HAITECH GROUP Boutique IT"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Boutique IT | HAITECH GROUP",
    description,
    images: [`${getSiteBaseUrl()}/logo-haitech.jpg`]
  },
  category: "technology"
};

export default function BoutiqueItPage() {
  const jsonLd = buildBoutiqueItStructuredData();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BoutiqueItPageClient />
    </>
  );
}
