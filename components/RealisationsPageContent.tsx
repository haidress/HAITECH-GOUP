"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RealisationCaseCard } from "@/components/RealisationCaseCard";
import { realisationCases, realisationTemoignages, type RealisationCase, type RealisationTag } from "@/lib/realisations-data";
import { whatsappLink } from "@/components/site-data";

const tagOrder: RealisationTag[] = ["Business", "Web", "IT", "Formation"];
const spotlightIds = ["ivoirien-medias", "anyama-immobilier"] as const;
const spotlightIdSet = new Set<string>(spotlightIds);

export function RealisationsPageContent() {
  const [cases, setCases] = useState<RealisationCase[]>(realisationCases);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/public/realisations");
        const data = (await res.json()) as { success?: boolean; data?: RealisationCase[] };
        if (!res.ok || !data.success || !Array.isArray(data.data)) return;
        if (!cancelled) {
          const merged = new Map<string, RealisationCase>();
          for (const item of realisationCases) merged.set(item.id, item);
          for (const item of data.data) merged.set(item.id, item);
          setCases(Array.from(merged.values()));
        }
      } catch {
        // fallback static seulement
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const segments = useMemo(() => tagOrder.filter((t) => cases.some((c) => c.tag === t)), [cases]);
  const spotlightCases = useMemo(
    () =>
      spotlightIds
        .map((id) => cases.find((c) => c.id === id))
        .filter((c): c is RealisationCase => Boolean(c)),
    [cases]
  );
  const yelefoodCase = useMemo(() => cases.find((c) => c.id === "yelefood-lounge"), [cases]);

  return (
    <div>
      <section className="relative overflow-hidden bg-haitechBlue py-14 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-haitechGold">RÉALISATIONS</p>
            <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight md:text-5xl">
              Des résultats concrets pour nos clients en Côte d&apos;Ivoire
            </h1>
            <p className="mt-4 max-w-3xl text-sm text-slate-100 md:text-lg">
              Identité visuelle, sites web et gestion des réseaux sociaux : nous aidons les entreprises à gagner en
              visibilité, crédibilité et clients.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="btn-primary bg-haitechGold text-haitechBlue hover:bg-haitechGold/90"
              >
                Discuter de mon projet sur WhatsApp
              </a>
              <Link href="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-haitechBlue">
                Obtenir un devis en 24h
              </Link>
            </div>
          </div>

          <dl className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-200">Audience gérée</dt>
              <dd className="mt-2 font-heading text-3xl font-extrabold text-white">+155 000</dd>
              <p className="mt-1 text-xs text-slate-200">I VOI RIEN médias</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-200">Audience immobilière</dt>
              <dd className="mt-2 font-heading text-3xl font-extrabold text-white">+80 000</dd>
              <p className="mt-1 text-xs text-slate-200">Anyama Immobilier</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-200">Projets réalisés</dt>
              <dd className="mt-2 font-heading text-3xl font-extrabold text-white">+10</dd>
              <p className="mt-1 text-xs text-slate-200">Branding, web et social media</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-200">Accompagnement</dt>
              <dd className="mt-2 font-heading text-3xl font-extrabold text-white">Continu</dd>
              <p className="mt-1 text-xs text-slate-200">Plusieurs entreprises suivies dans la durée</p>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-haitechBlue">Navigation rapide</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <a href="#references-phares" className="rounded-full border border-haitechGold/50 bg-haitechGold/15 px-4 py-2 text-sm font-semibold text-haitechBlue transition hover:bg-haitechGold/25">
              Références principales
            </a>
            <a href="#autres-projets" className="rounded-full border border-haitechBlue/30 bg-white px-4 py-2 text-sm font-semibold text-haitechBlue transition hover:border-haitechBlue hover:bg-haitechBlue/5">
              Autres projets
            </a>
            <a href="#resultats-clients" className="rounded-full border border-haitechBlue/30 bg-white px-4 py-2 text-sm font-semibold text-haitechBlue transition hover:border-haitechBlue hover:bg-haitechBlue/5">
              Résultats obtenus
            </a>
            {segments.map((t) => (
              <a key={t} href={`#segment-${t.toLowerCase()}`} className="rounded-full border border-haitechBlue/30 bg-white px-4 py-2 text-sm font-semibold text-haitechBlue transition hover:border-haitechBlue hover:bg-haitechBlue/5">
                {t}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="references-phares" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-14">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Nos références principales</h2>
          <p className="mt-2 max-w-2xl text-slate-600">3 cas clients qui résument notre méthode : stratégie, exécution, résultats.</p>
          {spotlightCases.length > 0 ? <div className="mt-6 grid gap-6 md:grid-cols-2">{spotlightCases.map((c) => <RealisationCaseCard key={c.id} c={c} />)}</div> : null}
          {yelefoodCase ? <div className="mt-6"><RealisationCaseCard c={yelefoodCase} /></div> : null}
        </div>
      </section>

      <section id="autres-projets" className="scroll-mt-24 bg-slate-50 py-12 md:py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Autres projets</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Branding, communication, web et accompagnement digital pour des structures de secteurs variés.</p>
          {segments.map((segment) => {
            const segmentCases = cases.filter((c) => c.tag === segment && !spotlightIdSet.has(c.id) && c.id !== "yelefood-lounge");
            if (segmentCases.length === 0) return null;
            return (
              <div key={segment} id={`segment-${segment.toLowerCase()}`} className="scroll-mt-24 border-t border-slate-200 pt-12 first:border-t-0 first:pt-0">
                <h3 className="font-heading text-xl font-bold text-haitechBlue md:text-2xl">{segment}</h3>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {segmentCases.map((c) => (
                    <RealisationCaseCard key={c.id} c={c} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="resultats-clients" className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Ce que nos clients obtiennent</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            "Une image professionnelle et crédible",
            "Une présence digitale active",
            "Plus de visibilité et d'engagement",
            "Des outils adaptés à leur activité",
            "Un accompagnement sur le long terme"
          ].map((item) => (
            <div key={item} className="surface-card p-4 text-sm font-semibold text-slate-700">
              ✔ {item}
            </div>
          ))}
        </div>

        <h3 className="mt-10 font-heading text-xl font-bold text-haitechBlue md:text-2xl">Avis clients</h3>
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
            <h2 className="font-heading text-2xl font-bold">Vous avez un projet similaire ?</h2>
            <p className="mt-2 max-w-xl text-slate-100">
              Que ce soit pour votre image, votre site ou vos réseaux sociaux, nous vous accompagnons de A à Z.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue">
              Recevoir une proposition en 24h
            </Link>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="rounded-full border border-white/70 px-6 py-3 font-semibold text-white">
              Discuter sur WhatsApp maintenant
            </a>
          </div>
        </div>
      </section>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="fixed inset-x-3 bottom-4 z-40 rounded-full bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-white shadow-xl md:hidden"
      >
        Discuter de mon projet sur WhatsApp
      </a>
    </div>
  );
}
