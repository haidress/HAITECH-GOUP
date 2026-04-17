"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { OrderRequestButton } from "@/components/OrderRequestButton";
import { itAddOns, itManagedTiers, itServiceLines, itServicePacks, whatsappHref } from "@/lib/offers-catalog";
import type { PublicItCatalog } from "@/lib/repositories/it-catalog-repository";

const whatsappItLink = whatsappHref("Bonjour, je souhaite un service informatique HAITECH GROUP");

function formatPriceFcfa(v: number) {
  return `${v.toLocaleString("fr-FR")} FCFA`;
}

function defaultCatalog(): PublicItCatalog {
  return {
    serviceLines: itServiceLines,
    managedTiers: itManagedTiers,
    packs: itServicePacks,
    addons: itAddOns
  };
}

export default function TechnologyPage() {
  const [catalog, setCatalog] = useState<PublicItCatalog>(defaultCatalog);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/it-catalog", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && res.ok && data.success && data.data) {
          setCatalog(data.data as PublicItCatalog);
        }
      } catch {
        /* garde le fallback local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const { serviceLines, managedTiers, packs, addons } = catalog;

  return (
    <div className="bg-white">
      <section
        className="relative overflow-hidden py-16 text-white md:py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,42,94,0.78), rgba(10,42,94,0.78)), url('/slide-transformation.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-heading text-3xl font-extrabold leading-tight md:text-5xl">
              Des solutions informatiques pour faire évoluer votre business
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-100 md:text-lg">
              Maintenance, développement, cybersécurité et accompagnement digital pour particuliers et entreprises.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappItLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue"
              >
                Écrire sur WhatsApp
              </a>
              <a href="#services-it" className="rounded-full border border-white px-6 py-3 font-semibold">
                Voir nos services
              </a>
              <a href="#packs-it" className="rounded-full border border-white px-6 py-3 font-semibold">
                Nos packs
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services-it" className="mx-auto max-w-7xl px-4 py-14 md:py-16">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Nos Services IT</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {serviceLines.map((service, idx) => (
            <motion.a
              key={`${service.title}-${idx}`}
              href={whatsappItLink}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-haitechBlue/20"
            >
              <p className="text-3xl">{service.icon}</p>
              <h3 className="mt-3 font-heading text-xl font-bold text-haitechBlue">{service.title}</h3>
              <p className="mt-3 text-slate-600">{service.desc}</p>
              <span className="mt-5 inline-block rounded-full bg-haitechBlue px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-haitechGold group-hover:text-haitechBlue">
                {service.cta}
              </span>
            </motion.a>
          ))}
        </div>
      </section>

      <section id="packs-it" className="mx-auto max-w-7xl px-4 py-14 md:py-16">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Nos packs</h2>
        <p className="mt-2 text-sm text-slate-600">Tarifs indicatifs — ajustés par l&apos;équipe depuis l&apos;administration.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {packs.map((pack) => (
            <article
              key={pack.title}
              className={`rounded-2xl border p-6 shadow-sm ${
                pack.badge ? "border-haitechGold bg-gradient-to-b from-haitechGold/10 to-white" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{pack.subtitle}</p>
                  <h3 className="mt-1 font-heading text-lg font-bold text-haitechBlue">{pack.title}</h3>
                </div>
                {pack.badge ? <span className="rounded-full bg-haitechBlue px-3 py-1 text-xs font-semibold text-white">{pack.badge}</span> : null}
              </div>
              <p className="mt-2 text-xs text-slate-500">Cible: {pack.audience}</p>
              {pack.fromPriceFcfa ? (
                <p className="mt-2 text-sm font-semibold text-haitechBlue">À partir de {formatPriceFcfa(pack.fromPriceFcfa)}</p>
              ) : null}
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {pack.items.map((it) => (
                  <li key={it}>• {it}</li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {pack.fromPriceFcfa ? (
                  <OrderRequestButton
                    sourceType="services_it"
                    productName={pack.title}
                    amount={pack.fromPriceFcfa}
                    compact
                  />
                ) : null}
                <a
                  href={whatsappItLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-full border border-haitechBlue px-4 py-2 text-sm font-semibold text-haitechBlue hover:bg-haitechBlue hover:text-white"
                >
                  Discuter sur WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-heading text-lg font-bold text-haitechBlue">Options & services complémentaires</h3>
          <ul className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
            {addons.map((a) => (
              <li key={a}>• {a}</li>
            ))}
          </ul>
        </div>
        <div className="mt-8 rounded-xl bg-haitechBlue p-6 text-white">
          <h3 className="font-heading text-2xl font-bold">Vous avez un besoin spécifique ?</h3>
          <a
            href={whatsappItLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block rounded-full bg-haitechGold px-5 py-2.5 font-semibold text-haitechBlue"
          >
            Demander un devis sur WhatsApp
          </a>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Infogérance & maintenance (par poste)</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Forfaits indicatifs par poste et par mois — devis obligatoire selon parc, serveurs et options. SLA visés,
            non contractuels tant que le contrat n&apos;est pas signé.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {managedTiers.map((tier, idx) => (
              <motion.article
                key={tier.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className={`rounded-2xl border bg-white p-6 shadow-sm ${idx === 1 ? "border-haitechGold ring-2 ring-haitechGold/30" : "border-slate-200"}`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{tier.audience}</p>
                <h3 className="mt-2 font-heading text-xl font-bold text-haitechBlue">{tier.name}</h3>
                <p className="mt-2 text-2xl font-extrabold text-haitechBlue">
                  à partir de {formatPriceFcfa(tier.fromPricePerPosteFcfa)}
                  <span className="text-sm font-normal text-slate-500"> / poste / mois</span>
                </p>
                <p className="mt-2 text-xs text-slate-500">{tier.sla}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {tier.highlights.map((h) => (
                    <li key={h}>• {h}</li>
                  ))}
                </ul>
                <div className="mt-5">
                  <OrderRequestButton
                    sourceType="services_it"
                    productName={`Infogérance ${tier.name} (estimation)`}
                    amount={tier.fromPricePerPosteFcfa}
                    compact
                  />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Comment nous travaillons</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {["1. Analyse du besoin", "2. Proposition adaptée", "3. Mise en œuvre", "4. Suivi & optimisation"].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <p className="font-semibold text-haitechBlue">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:py-16">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Résultats & Bénéfices</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {[
            "✔️ Gain de temps",
            "✔️ Réduction des pannes",
            "✔️ Sécurité renforcée",
            "✔️ Visibilité en ligne améliorée",
            "✔️ Croissance du chiffre d’affaires"
          ].map((item) => (
            <div key={item} className="rounded-xl bg-haitechBlue p-5 text-center text-sm font-semibold text-white">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Pourquoi choisir HAITECH (IT)</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              "Expertise technique réelle",
              "Réactivité rapide (WhatsApp direct)",
              "Solutions adaptées au marché africain",
              "Accompagnement personnalisé",
              "Excellent rapport qualité / prix"
            ].map((point) => (
              <div key={point} className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700">
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Ils nous font confiance</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              {
                quote: "Service très professionnel, exécution rapide et résultats visibles.",
                author: "Entrepreneur, Abidjan"
              },
              {
                quote: "Le support IT est fiable et réactif, notre productivité a nettement progressé.",
                author: "PME locale"
              },
              {
                quote: "Formation pratique, claire et orientée terrain. Très utile pour lancer mon activité.",
                author: "Apprenant HAITECH Academy"
              }
            ].map((t) => (
              <blockquote key={t.author} className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-lg">⭐⭐⭐⭐⭐</p>
                <p className="mt-3 text-slate-700">{t.quote}</p>
                <footer className="mt-4 text-sm font-semibold text-haitechBlue">– {t.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:py-16">
        <div className="rounded-2xl bg-haitechBlue p-8 text-white">
          <h2 className="font-heading text-3xl font-bold">Parlez à un expert maintenant</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={whatsappItLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue"
            >
              WhatsApp
            </a>
            <a href="tel:+2250789174619" className="rounded-full border border-white px-6 py-3 font-semibold">
              Appel direct
            </a>
          </div>
        </div>
      </section>

      <a
        href={whatsappItLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-xl"
      >
        WhatsApp
      </a>
    </div>
  );
}
