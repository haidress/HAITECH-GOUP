import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { getAllRealisationSlugs, getRealisationBySlug, type RealisationCase, type RealisationTag } from "@/lib/realisations-data";
import { whatsappLink } from "@/components/site-data";
import { getPublishedRealisationProjectBySlug, mapProjectRowToPublicCase } from "@/lib/repositories/realisations-repository";

function tagClass(tag: RealisationTag): string {
  const map: Record<RealisationTag, string> = {
    Web: "bg-haitechBlue/10 text-haitechBlue",
    IT: "bg-emerald-100 text-emerald-800",
    Formation: "bg-amber-100 text-amber-900",
    Business: "bg-violet-100 text-violet-900"
  };
  return map[tag];
}

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllRealisationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const dynamicProject = await getPublishedRealisationProjectBySlug(slug).catch(() => null);
  const c = dynamicProject ? mapProjectRowToPublicCase(dynamicProject) : getRealisationBySlug(slug);
  if (!c) return { title: "Réalisation introuvable" };
  return {
    title: `${c.title} | ${c.clientName} — HAITECH`,
    description: c.excerpt
  };
}

export default async function RealisationDetailPage({ params }: Props) {
  const { slug } = await params;
  const dynamicProject = await getPublishedRealisationProjectBySlug(slug).catch(() => null);
  const c: RealisationCase | undefined = dynamicProject ? mapProjectRowToPublicCase(dynamicProject) : getRealisationBySlug(slug);
  if (!c) notFound();

  return (
    <div>
      <PageHero title={c.title} description={c.excerpt} />

      <nav className="border-b border-slate-200 bg-white" aria-label="Fil d'Ariane">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-600">
          <Link href="/" className="text-haitechBlue hover:underline">
            Accueil
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <Link href="/realisations" className="text-haitechBlue hover:underline">
            Réalisations
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-800">{c.clientName}</span>
        </div>
      </nav>

      <div
        className={`relative mx-auto h-52 w-full max-w-7xl sm:h-64 md:h-80 ${c.imageFit === "contain" ? "bg-white" : "bg-slate-100"}`}
      >
        <Image
          src={c.image}
          alt={`${c.clientName} — visuel du projet`}
          fill
          className={c.imageFit === "contain" ? "object-contain p-6 md:p-10" : "object-cover"}
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${tagClass(c.tag)}`}>{c.tag}</span>
          <span className="text-sm text-slate-600">{c.year}</span>
          <span className="text-sm text-slate-400">· {c.duration}</span>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <section>
              <h2 className="font-heading text-lg font-bold text-haitechBlue">Contexte</h2>
              <p className="mt-2 text-slate-700">
                <strong className="text-slate-900">{c.clientName}</strong> — {c.sector}. {c.context}
              </p>
            </section>
            <section>
              <h2 className="font-heading text-lg font-bold text-haitechBlue">Enjeu</h2>
              <p className="mt-2 text-slate-700">{c.challenge}</p>
            </section>
            <section>
              <h2 className="font-heading text-lg font-bold text-haitechBlue">Notre réponse</h2>
              <p className="mt-2 text-slate-700">{c.solution}</p>
            </section>
            <section>
              <h2 className="font-heading text-lg font-bold text-haitechBlue">Résultat</h2>
              <p className="mt-2 text-slate-700">{c.outcome}</p>
            </section>
            {c.detailNotes.length > 0 ? (
              <section>
                <h2 className="font-heading text-lg font-bold text-haitechBlue">Notes de projet</h2>
                <ul className="mt-2 list-inside list-disc space-y-2 text-slate-700">
                  {c.detailNotes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {c.links && c.links.length > 0 ? (
              <div className="rounded-2xl border border-haitechBlue/20 bg-haitechBlue/5 p-5">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-haitechBlue">Liens</h3>
                <ul className="mt-3 space-y-2">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-haitechBlue underline underline-offset-2 hover:text-haitechGold"
                      >
                        {l.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-haitechBlue">Périmètre</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {c.stack.map((s) => (
                  <li key={s} className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-slate-700">Points clés</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {c.highlights.map((k, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-haitechGold" aria-hidden>
                      ✓
                    </span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/contact"
                className="rounded-full bg-haitechBlue px-5 py-3 text-center text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-haitechBlue"
              >
                Projet similaire
              </Link>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-haitechBlue px-5 py-3 text-center text-sm font-semibold text-haitechBlue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-haitechBlue"
              >
                WhatsApp
              </a>
              <Link href="/realisations" className="py-2 text-center text-sm text-slate-600 underline">
                ← Toutes les réalisations
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
