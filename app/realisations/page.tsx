import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { RealisationCaseCard } from "@/components/RealisationCaseCard";
import { realisationCases, realisationTemoignages, type RealisationTag } from "@/lib/realisations-data";
import { whatsappLink } from "@/components/site-data";

/** Business en premier dans les blocs « par pôle » ; I VOI RIEN + Anyama sont en tête dans le bloc dédié. */
const tagOrder: RealisationTag[] = ["Business", "Web", "IT", "Formation"];
const segments = tagOrder.filter((t) => realisationCases.some((c) => c.tag === t));
const secteursUniques = new Set(realisationCases.map((c) => c.sector)).size;

/** Affichées en premier, l’une après l’autre (logo Anyama : /realisations/anyama-immobilier.jpg). */
const spotlightIds = ["ivoirien-medias", "anyama-immobilier"] as const;
const spotlightCases = spotlightIds
  .map((id) => realisationCases.find((c) => c.id === id))
  .filter((c): c is (typeof realisationCases)[number] => Boolean(c));
const spotlightIdSet = new Set<string>(spotlightIds);

export const metadata = {
  title: "Réalisations | HAITECH GROUP",
  description:
    "I VOI RIEN médias, Anyama Immobilier, Yelefood Lounge, Koumba Prestige Construction, ETS N'defai, SA2I Holding, Binome Traiteur, Smalto Café — identité, web, apps et community management."
};

export default function RealisationsPage() {
  return (
    <div>
      <PageHero
        title="Réalisations"
        description="Projets menés avec nos partenaires : identité visuelle, sites web, création de visuels, communication et community management. Chaque fiche résume le contexte, notre réponse et les résultats obtenus."
      />

      <section className="mx-auto max-w-7xl px-4 py-10 md:py-12">
        <p className="max-w-3xl text-slate-700">
          Découvrez des <strong>cas concrets</strong> en Côte d&apos;Ivoire et au-delà. Les textes sont centralisés dans{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">lib/realisations-data.ts</code> pour les faire
          évoluer facilement.
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Références</dt>
            <dd className="mt-2 font-heading text-3xl font-extrabold text-haitechBlue">{realisationCases.length}</dd>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Secteurs représentés</dt>
            <dd className="mt-2 font-heading text-3xl font-extrabold text-haitechBlue">{secteursUniques}</dd>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Expertises</dt>
            <dd className="mt-2 font-heading text-3xl font-extrabold text-haitechBlue">IDV · Web · Social</dd>
          </div>
        </dl>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-haitechBlue">Par pôle</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <a
              href="#references-phares"
              className="rounded-full border border-haitechGold/50 bg-haitechGold/15 px-4 py-2 text-sm font-semibold text-haitechBlue transition hover:bg-haitechGold/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-haitechBlue"
            >
              I VOI RIEN & Anyama
            </a>
            <a
              href="#cas"
              className="rounded-full border border-haitechBlue/30 bg-white px-4 py-2 text-sm font-semibold text-haitechBlue transition hover:border-haitechBlue hover:bg-haitechBlue/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-haitechBlue"
            >
              Toutes les fiches
            </a>
            {segments.map((t) => (
              <a
                key={t}
                href={`#segment-${t.toLowerCase()}`}
                className="rounded-full border border-haitechBlue/30 bg-white px-4 py-2 text-sm font-semibold text-haitechBlue transition hover:border-haitechBlue hover:bg-haitechBlue/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-haitechBlue"
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="cas" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-14">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Nos références</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Cliquez sur une carte pour la fiche détaillée, les visuels et les liens utiles (ex. page Facebook pour I
            VOI RIEN médias).
          </p>

          {spotlightCases.length > 0 ? (
            <div id="references-phares" className="scroll-mt-24">
              <h3 className="mt-10 font-heading text-xl font-bold text-haitechBlue md:text-2xl">
                I VOI RIEN médias, puis Anyama Immobilier
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Nos deux références mises en avant dans l’ordre : community management & médias, puis identité, site et
                réseaux pour l’immobilier (logo à jour).
              </p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {spotlightCases.map((c) => (
                  <RealisationCaseCard key={c.id} c={c} />
                ))}
              </div>
            </div>
          ) : null}

          <h3 className="mt-14 font-heading text-xl font-bold text-slate-700 md:text-2xl">Autres références par pôle</h3>

          {segments.map((segment) => {
            const cases = realisationCases.filter((c) => c.tag === segment && !spotlightIdSet.has(c.id));
            if (cases.length === 0) return null;
            return (
              <div
                key={segment}
                id={`segment-${segment.toLowerCase()}`}
                className="scroll-mt-24 border-t border-slate-200 pt-12 first:border-t-0 first:pt-0"
              >
                <h3 className="font-heading text-xl font-bold text-haitechBlue md:text-2xl">{segment}</h3>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  {segment === "Web" && "Identité visuelle, sites internet et expérience digitale."}
                  {segment === "IT" && "Infogérance, parc postes, sauvegardes et exploitation."}
                  {segment === "Formation" && "E-learning, bootcamps et parcours métiers."}
                  {segment === "Business" &&
                    "Communication, création de visuels, community management et accompagnement réseaux sociaux."}
                </p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {cases.map((c) => (
                    <RealisationCaseCard key={c.id} c={c} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Ils nous font confiance</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Extraits de retours clients ; le témoignage I VOI RIEN médias est une synthèse éditoriale — adaptez-le si vous
          souhaitez une citation signée nominativement.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {realisationTemoignages.map((t, i) => (
            <blockquote key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-lg">{t.stars}</p>
              <p className="mt-3 text-slate-700">{t.quote}</p>
              <footer className="mt-4 text-sm font-semibold text-haitechBlue">— {t.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="bg-haitechBlue py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-heading text-2xl font-bold">Un besoin comparable ?</h2>
            <p className="mt-2 max-w-xl text-slate-100">
              Identité, site, visuels ou animation de vos réseaux : parlez-nous de votre projet à Abidjan ou à distance.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-haitechGold"
            >
              Demander un devis
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/70 px-6 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
