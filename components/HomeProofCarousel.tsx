"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { homeRealisationTeasers, homeTestimonials } from "@/lib/home-proof-data";

export function HomeProofCarousel() {
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/home", { cache: "no-store" });
        const json = await res.json();
        if (!cancelled && res.ok && json.success && json.data?.lastSiteUpdateLabel) {
          setLastUpdate(String(json.data.lastSiteUpdateLabel));
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const slides = [
    ...homeTestimonials.map((t, i) => ({
      key: `t-${i}`,
      content: (
        <blockquote className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-lg">{t.stars}</p>
          <p className="mt-3 text-slate-700">{t.quote}</p>
          <footer className="mt-4 text-sm font-semibold text-haitechBlue">– {t.author}</footer>
        </blockquote>
      )
    })),
    ...homeRealisationTeasers.map((r, i) => ({
      key: `r-${i}`,
      content: (
        <article className="h-full rounded-2xl border border-haitechBlue/20 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-haitechGold">{r.tag}</p>
          <h3 className="mt-2 font-heading text-lg font-bold text-haitechBlue">{r.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{r.summary}</p>
          <Link href="/realisations" className="mt-4 inline-block text-sm font-semibold text-haitechBlue underline">
            Toutes les réalisations
          </Link>
        </article>
      )
    }))
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Avis & réalisations</h2>
          <p className="mt-1 text-sm text-slate-600">Faites défiler pour parcourir témoignages et aperçus de projets.</p>
        </div>
        {lastUpdate ? (
          <p className="text-xs font-medium text-slate-500">Dernière mise à jour affichée : {lastUpdate}</p>
        ) : (
          <p className="text-xs text-slate-400">Date de fraîcheur : renseignez-la dans l&apos;admin « Contenu accueil ».</p>
        )}
      </div>
      <div className="mt-6 snap-x snap-mandatory overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
        <div className="flex min-w-0 gap-4 md:gap-5">
          {slides.map((s, idx) => (
            <motion.div
              key={s.key}
              className="w-[min(100%,380px)] flex-shrink-0 snap-center md:w-[400px]"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : idx * 0.05 }}
            >
              {s.content}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
