"use client";

import { motion } from "framer-motion";
import { whatsappLink } from "@/components/site-data";

export function ParallaxGrowthSection() {
  return (
    <section className="parallax-section relative overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-10 top-10 h-28 w-28 rounded-full bg-haitechGold/20 blur-2xl"
          animate={{ y: [0, 12, 0], x: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-8 top-24 h-20 w-20 rounded-full bg-white/15 blur-xl"
          animate={{ y: [0, -10, 0], x: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        <motion.div
          className="absolute bottom-10 right-16 h-32 w-32 rounded-full bg-haitechGold/15 blur-3xl"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-3xl rounded-2xl border border-white/30 bg-white/10 p-6 text-white backdrop-blur md:p-10"
        >
          <p className="text-xs uppercase tracking-widest text-white/80">Parcours de croissance</p>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-tight md:text-5xl">
            🚀 Accélérez votre croissance avec HAITECH GROUP
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-slate-100 md:text-base">
            Des solutions digitales, des formations pratiques et un accompagnement sur mesure.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue transition hover:opacity-90"
          >
            Discuter sur WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
