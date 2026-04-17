"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { HomeMediaSlider } from "@/components/HomeMediaSlider";
import { whatsappLink } from "@/components/site-data";
import type { HomePublicContent } from "@/lib/repositories/home-content-repository";

function defaultHome(): HomePublicContent {
  return {
    announcementTitle: null,
    announcementBody: null,
    announcementCtaLabel: null,
    announcementCtaHref: null,
    announcementVisible: false,
    heroCtaPrimaryLabel: "Demander un devis",
    heroCtaPrimaryLabelB: "Obtenir une proposition",
    homeExperimentVariant: "A",
    lastSiteUpdateLabel: null
  };
}

export function HomeHeroSection() {
  const [home, setHome] = useState<HomePublicContent>(defaultHome);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/home", { cache: "no-store" });
        const json = await res.json();
        if (!cancelled && res.ok && json.success && json.data) {
          setHome(json.data as HomePublicContent);
        }
      } catch {
        /* fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const primaryCta =
    home.homeExperimentVariant === "B" ? home.heroCtaPrimaryLabelB : home.heroCtaPrimaryLabel;

  const motionProps = reduceMotion
    ? { initial: false, animate: { opacity: 1, y: 0 } }
    : {
        initial: "hidden" as const,
        animate: "visible" as const,
        variants: {
          hidden: { opacity: 0, y: 24 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12, duration: 0.45 } }
        }
      };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="hero-gradient hero-living-bg">
      {home.announcementVisible && home.announcementTitle ? (
        <div className="border-b border-white/15 bg-white/10 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-white md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-haitechGold">Actu</p>
              <p className="font-heading text-sm font-bold md:text-base">{home.announcementTitle}</p>
              {home.announcementBody ? <p className="mt-1 max-w-3xl text-xs text-slate-100 md:text-sm">{home.announcementBody}</p> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {home.announcementCtaLabel && home.announcementCtaHref ? (
                <a
                  href={home.announcementCtaHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full bg-haitechGold px-4 py-2 text-xs font-semibold text-haitechBlue md:text-sm"
                >
                  {home.announcementCtaLabel}
                </a>
              ) : null}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-white/60 px-4 py-2 text-xs font-semibold text-white md:text-sm"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      ) : null}
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-2 md:py-24">
        <motion.div {...motionProps} className="space-y-5 text-white md:space-y-6">
          <motion.p
            variants={reduceMotion ? undefined : childVariants}
            className="inline-block rounded-full border border-white/40 px-4 py-1 text-xs uppercase tracking-widest"
          >
            Site officiel - Abidjan
          </motion.p>
          <motion.h1
            variants={reduceMotion ? undefined : childVariants}
            className="font-heading text-4xl font-extrabold leading-tight md:text-6xl"
          >
            Un seul groupe, mille solutions.
          </motion.h1>
          <motion.p
            variants={reduceMotion ? undefined : childVariants}
            className="max-w-xl text-base text-slate-100 md:text-lg"
          >
            Nous transformons vos idées en solutions digitales, business et rentables.
          </motion.p>
          <motion.div variants={reduceMotion ? undefined : childVariants} className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-haitechGold"
            >
              {primaryCta}
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white px-6 py-3 font-semibold transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Écrire sur WhatsApp
            </a>
          </motion.div>
          <p className="text-xs text-slate-300">
            Variante d’accroche (A/B) : réglage dans l’admin « Contenu accueil » — utile pour tester libellés avant
            outils d’analyse avancés.
          </p>
        </motion.div>
        <HomeMediaSlider />
      </div>
    </section>
  );
}
