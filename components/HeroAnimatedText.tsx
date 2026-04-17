"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { whatsappLink } from "@/components/site-data";

export function HeroAnimatedText() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12, duration: 0.45 } }
      }}
      className="space-y-5 text-white md:space-y-6"
    >
      <motion.p
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        className="inline-block rounded-full border border-white/40 px-4 py-1 text-xs uppercase tracking-widest"
      >
        Site officiel - Abidjan
      </motion.p>
      <motion.h1
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        className="font-heading text-4xl font-extrabold leading-tight md:text-6xl"
      >
        Un seul groupe, mille solutions.
      </motion.h1>
      <motion.p
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        className="max-w-xl text-base text-slate-100 md:text-lg"
      >
        Nous transformons vos idées en solutions digitales, business et rentables.
      </motion.p>
      <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} className="flex flex-wrap gap-3">
        <Link href="/contact" className="rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue">
          Demander un devis
        </Link>
        <a href={whatsappLink} target="_blank" rel="noreferrer" className="rounded-full border border-white px-6 py-3 font-semibold">
          Écrire sur WhatsApp
        </a>
      </motion.div>
    </motion.div>
  );
}
