"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const services = [
  {
    title: "Services informatique & infogérance",
    src: "/service-assistance.jpg",
    href: "/technology",
    cta: "Voir les packs"
  },
  {
    title: "HAITECH Academy & e-learning",
    src: "/slide-3.jpg",
    href: "/academy",
    cta: "Catalogue formations"
  },
  {
    title: "Boutique IT — matériel & bundles",
    src: "/slide-transformation.png",
    href: "/boutique-it",
    cta: "Équiper mon parc"
  },
  {
    title: "Business Center",
    src: "/slide-business.png",
    href: "/business-center",
    cta: "Opportunités"
  },
  {
    title: "Réalisations & références",
    src: "/service-sites.jpg",
    href: "/realisations",
    cta: "Portfolio"
  },
  {
    title: "Contact & devis",
    src: "/service-visuels.jpg",
    href: "/contact",
    cta: "Écrire"
  }
];

export function ServicesActionSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Nos offres en un coup d&apos;œil</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
        IT, formations, matériel, business et contact : accédez directement au bon parcours.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((item, idx) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-haitechBlue/20"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-contain transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/65 via-black/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
                <Link
                  href={item.href}
                  className="m-4 rounded-full bg-haitechGold px-4 py-2 text-sm font-semibold text-haitechBlue"
                >
                  {item.cta}
                </Link>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-heading text-lg font-bold text-haitechBlue">{item.title}</h3>
              <Link href={item.href} className="mt-3 inline-block text-sm font-semibold text-haitechBlue underline">
                {item.cta} →
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
