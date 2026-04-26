import type { Metadata } from "next";

const baseUrl = "https://haitech-group.ci";

export const defaultSiteMetadata: Metadata = {
  title: "HAITECH GROUP - Site Officiel",
  description:
    "HAITECH GROUP accompagne les particuliers, startups, PME et institutions avec des solutions IT, business et formation.",
  keywords: ["HAITECH GROUP", "Abidjan", "IT", "Business Center", "Academy", "formation"],
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "HAITECH GROUP - Site Officiel",
    description: "Solutions IT, Business Center et Formations pour accélérer votre croissance.",
    url: baseUrl,
    siteName: "HAITECH GROUP",
    locale: "fr_FR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "HAITECH GROUP - Site Officiel",
    description: "Solutions IT, Business Center et Formations pour accélérer votre croissance."
  },
  icons: {
    icon: "/logo-haitech.jpg",
    shortcut: "/logo-haitech.jpg",
    apple: "/logo-haitech.jpg"
  }
};
