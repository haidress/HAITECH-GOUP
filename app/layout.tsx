import type { Metadata } from "next";
import "./globals.css";
import { AuthUserProvider } from "@/components/AuthUserProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "HAITECH GROUP - Site Officiel",
  description:
    "HAITECH GROUP accompagne les particuliers, startups, PME et institutions avec des solutions IT, business et formation.",
  keywords: ["HAITECH GROUP", "Abidjan", "IT", "Business Center", "Academy", "formation"],
  metadataBase: new URL("https://haitech-group.ci"),
  openGraph: {
    title: "HAITECH GROUP - Site Officiel",
    description:
      "Solutions IT, Business Center et Formations pour accélérer votre croissance.",
    url: "https://haitech-group.ci",
    siteName: "HAITECH GROUP",
    locale: "fr_FR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "HAITECH GROUP - Site Officiel",
    description:
      "Solutions IT, Business Center et Formations pour accélérer votre croissance."
  },
  icons: {
    icon: "/logo-haitech.jpg",
    shortcut: "/logo-haitech.jpg",
    apple: "/logo-haitech.jpg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <AuthUserProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthUserProvider>
      </body>
    </html>
  );
}
