import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderRequestButton } from "@/components/OrderRequestButton";
import { academyCatalogFormations, type CatalogFormation } from "@/lib/academy-catalog";
import { academyCategoryToBlogSlug, academyFormationSlug } from "@/lib/academy-utils";
import { buildPageMetadata } from "@/lib/page-metadata";
import { defaultSiteMetadata } from "@/lib/site-default-metadata";
import { listAcademyFormationsFromDb } from "@/lib/repositories/academy-repository";

type FormationDetail = CatalogFormation;

function getFormationPersona(item: FormationDetail) {
  if (item.level === "Débutant") return "Idéal pour débutants, étudiants et professionnels en montée de compétence.";
  if (item.level === "Intermédiaire") return "Conçu pour profils déjà actifs qui veulent professionnaliser leurs résultats.";
  return "Adapté aux profils techniques souhaitant déployer des projets avancés.";
}

function getFormationPrereq(item: FormationDetail) {
  if (item.level === "Débutant") return "Aucun prérequis technique strict, motivation recommandée.";
  if (item.level === "Intermédiaire") return "Bases du domaine conseillées + pratique régulière.";
  return "Bonnes bases techniques requises et capacité à réaliser un mini-projet.";
}

function getFormationObjectives(item: FormationDetail) {
  if (item.outcomes?.length) return item.outcomes.slice(0, 3);
  if (item.category === "Développement web") {
    return ["Concevoir une interface moderne", "Structurer un mini-projet", "Publier une version exploitable"];
  }
  if (item.category === "Business & digital") {
    return ["Clarifier votre offre", "Construire un plan d’action", "Piloter vos premiers résultats"];
  }
  return ["Acquérir des bases solides", "Appliquer des méthodes professionnelles", "Produire un livrable concret"];
}

async function loadFormationBySlug(slug: string): Promise<FormationDetail | null> {
  const staticBySlug = new Map(academyCatalogFormations.map((item) => [academyFormationSlug(item.name), item]));

  try {
    const dbFormations = await listAcademyFormationsFromDb();
    if (dbFormations.length > 0) {
      const dbMatch = dbFormations.find((item) => academyFormationSlug(item.name) === slug);
      if (dbMatch) return dbMatch;
    }
    return staticBySlug.get(slug) ?? null;
  } catch {
    return staticBySlug.get(slug) ?? null;
  }
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const formation = await loadFormationBySlug(params.slug);
  if (!formation) return defaultSiteMetadata;
  return buildPageMetadata(`/academy/${params.slug}`, {
    ...defaultSiteMetadata,
    title: `${formation.name} | HAITECH Academy`,
    description: `Formation ${formation.category} - niveau ${formation.level}. ${formation.duration}.`
  });
}

export default async function AcademyFormationDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const formation = await loadFormationBySlug(params.slug);
  if (!formation) notFound();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <Link href="/academy#formations-list" className="text-sm font-semibold text-haitechBlue hover:underline">
        ← Retour au catalogue Academy
      </Link>
      <div className="surface-card mt-5 p-6 md:p-8">
        <p className="text-xs uppercase tracking-wide text-slate-500">{formation.category}</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-haitechBlue">{formation.name}</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">{formation.level}</span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{formation.format}</span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{formation.duration}</span>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-3 text-sm text-slate-700">
            {formation.summary ? <p>{formation.summary}</p> : null}
            <p>
              <span className="font-semibold text-haitechBlue">Pour qui :</span> {getFormationPersona(formation)}
            </p>
            <p>
              <span className="font-semibold text-haitechBlue">Prérequis :</span> {getFormationPrereq(formation)}
            </p>
            {formation.weeklyHours ? (
              <p>
                <span className="font-semibold text-haitechBlue">Rythme :</span> {formation.weeklyHours}
              </p>
            ) : null}
            {formation.eveningClasses ? (
              <p>
                <span className="font-semibold text-haitechBlue">Disponibilité :</span> Cours du soir disponibles
              </p>
            ) : null}
            <p className="font-semibold text-haitechBlue">Objectifs :</p>
            <ul className="list-inside list-disc space-y-1">
              {getFormationObjectives(formation).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="surface-card bg-slate-50 p-5">
            <p className="text-sm text-slate-600">Tarif</p>
            <p className="mt-1 font-heading text-3xl font-extrabold text-haitechBlue">{formation.price.toLocaleString("fr-FR")} FCFA</p>
            <p className="mt-2 text-xs text-slate-500">Paiement confirmé avec un conseiller après validation.</p>
            <div className="mt-4">
              <OrderRequestButton sourceType="formation" productName={formation.name} amount={formation.price} />
            </div>
            {formation.brochureUrl ? (
              <Link href={formation.brochureUrl} className="mt-3 inline-block text-xs font-semibold text-haitechBlue hover:underline">
                Télécharger la brochure
              </Link>
            ) : null}
            <Link
              href={`/blog/categorie/${academyCategoryToBlogSlug(formation.category)}`}
              className="mt-4 inline-block text-xs font-semibold text-haitechBlue hover:underline"
            >
              Lire les conseils blog liés à cette formation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
