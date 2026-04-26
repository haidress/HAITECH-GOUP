import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/page-metadata";
import { defaultSiteMetadata } from "@/lib/site-default-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/technology", {
    ...defaultSiteMetadata,
    title: "Services informatiques à Abidjan | HAITECH GROUP",
    description:
      "Maintenance, infogérance, cybersécurité et développement pour TPE, PME et entreprises en Côte d'Ivoire."
  });
}

export default function TechnologyLayout({ children }: { children: ReactNode }) {
  return children;
}
