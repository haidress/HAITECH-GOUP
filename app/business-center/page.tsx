import type { Metadata } from "next";
import { BusinessCenterPageClient } from "@/components/BusinessCenterPageClient";
import { buildPageMetadata } from "@/lib/page-metadata";
import { defaultSiteMetadata } from "@/lib/site-default-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/business-center", {
    ...defaultSiteMetadata,
    title: "Business Center — opportunités à Abidjan | HAITECH GROUP",
    description:
      "Immobilier, véhicules, conciergerie et automatisation commerciale à Abidjan. Offres vérifiées et accompagnement personnalisé."
  });
}

export default function BusinessCenterPage() {
  return <BusinessCenterPageClient />;
}
