"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { OrderRequestButton } from "@/components/OrderRequestButton";
import {
  academyCatalogFormations,
  academyCategoryTabs,
  academyEbooks,
  academyModalites,
  academyParcours,
  whatsappHref,
  type AcademyFilterLabel,
  type CatalogFormation
} from "@/lib/offers-catalog";

type FormationItem = CatalogFormation;

const whatsappAcademyLink = whatsappHref("Bonjour, je souhaite acheter une formation HAITECH Academy");

function formatPrice(v: number) {
  return `${v.toLocaleString("fr-FR")} FCFA`;
}

export default function AcademyPage() {
  const [selectedCategory, setSelectedCategory] = useState<AcademyFilterLabel>("Tous");
  const [query, setQuery] = useState("");
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [formations, setFormations] = useState<FormationItem[]>(academyCatalogFormations);
  const [selectedFormation, setSelectedFormation] = useState(academyCatalogFormations[0]!.name);

  useEffect(() => {
    fetch("/api/catalog/formations")
      .then((r) => r.json())
      .then((d) => {
        const rows = (d.data ?? []) as Array<{
          titre: string;
          description: string | null;
          prix: number;
          niveau: string | null;
          duree: string | null;
          image: string | null;
        }>;
        if (!rows.length) return;
        const mapped: FormationItem[] = rows.map((row) => ({
          name: row.titre,
          category: "Informatique",
          level: (row.niveau as FormationItem["level"]) || "Débutant",
          format: "PDF + Vidéo",
          duration: row.duree || "Flexible",
          price: Number(row.prix),
          image: row.image || "/slide-support.png"
        }));
        setFormations(mapped);
        setSelectedFormation(mapped[0].name);
      });
  }, []);

  const filteredFormations = useMemo(() => {
    return formations.filter((f) => {
      const categoryMatch = selectedCategory === "Tous" ? true : f.category === selectedCategory;
      const queryMatch = f.name.toLowerCase().includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });
  }, [selectedCategory, query, formations]);

  const selectedFormationPrice = useMemo(() => {
    return formations.find((f) => f.name === selectedFormation)?.price ?? formations[0].price;
  }, [selectedFormation, formations]);

  return (
    <div className="bg-white">
      <section
        className="relative overflow-hidden py-16 text-white md:py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,42,94,0.75), rgba(10,42,94,0.75)), url('/slide-3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
            <h1 className="font-heading text-3xl font-extrabold leading-tight md:text-5xl">
              Développez vos compétences et boostez votre avenir
            </h1>
            <p className="mt-4 text-sm text-slate-100 md:text-lg">
              Formations pratiques en informatique, digital et entrepreneuriat, accessibles à tous.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#formations-list" className="rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue">
                Commander maintenant
              </a>
              <a href="#ebooks" className="rounded-full border border-white px-6 py-3 font-semibold">
                Voir les e-books
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Catégories de formations</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {academyCategoryTabs.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => setSelectedCategory(cat.label)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                selectedCategory === cat.label ? "bg-haitechBlue text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </section>

      <section id="formations-list" className="mx-auto max-w-7xl px-4 pb-14">
        <div className="mb-5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 md:max-w-md"
            placeholder="🔍 Rechercher une formation"
          />
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredFormations.map((f, idx) => (
            <motion.article
              key={f.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-44 w-full">
                <Image src={f.image} alt={f.name} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 33vw" />
              </div>
              <div className="p-5">
                {f.badge ? <span className="rounded-full bg-haitechGold px-3 py-1 text-xs font-semibold text-haitechBlue">{f.badge}</span> : null}
                <h3 className="mt-3 font-heading text-xl font-bold text-haitechBlue">{f.name}</h3>
                <div className="mt-2 space-y-1 text-sm text-slate-600">
                  <p>Niveau : {f.level}</p>
                  <p>Format : {f.format}</p>
                  <p>Durée : {f.duration}</p>
                  {f.outcomes?.length ? (
                    <ul className="mt-2 list-inside list-disc text-xs text-slate-500">
                      {f.outcomes.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <p className="mt-3 font-semibold text-haitechBlue">{formatPrice(f.price)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <OrderRequestButton sourceType="formation" productName={f.name} amount={f.price} compact />
                  <Link href="/elearning" className="rounded-full border px-3 py-1.5 text-xs font-semibold text-haitechBlue">
                    Voir détails
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="ebooks" className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">E-BOOKS & PDF payants</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {academyEbooks.map((book) => (
              <article key={book.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="relative h-36 w-full overflow-hidden rounded-xl">
                  <Image src={book.image} alt={book.title} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 25vw" />
                </div>
                <h3 className="mt-3 font-heading text-lg font-bold text-haitechBlue">{book.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{book.desc}</p>
                <p className="mt-3 font-semibold text-haitechBlue">{formatPrice(book.price)}</p>
                <div className="mt-3">
                  <OrderRequestButton sourceType="formation" productName={book.title} amount={book.price} compact />
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600">Offre pack : 2 PDF achetés = réduction spéciale.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Passer une commande</h2>
          <p className="mt-2 text-sm text-slate-600">Cliquez sur commander pour envoyer vos coordonnées à l&apos;administrateur.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <input
              value={checkoutName}
              onChange={(e) => setCheckoutName(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Nom"
            />
            <input
              value={checkoutEmail}
              onChange={(e) => setCheckoutEmail(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Email"
              type="email"
            />
            <select
              value={selectedFormation}
              onChange={(e) => setSelectedFormation(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3"
            >
              {formations.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-3 text-sm font-semibold text-haitechBlue">Montant : {formatPrice(selectedFormationPrice)}</p>
          <div className="mt-4">
            <OrderRequestButton
              sourceType="formation"
              productName={selectedFormation}
              amount={selectedFormationPrice}
              defaultNom={checkoutName}
              defaultEmail={checkoutEmail}
            />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Après validation de votre commande, un conseiller vous contacte pour finaliser l&apos;accès.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Pourquoi nos formations</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {[
              "✔ Formations pratiques et concrètes",
              "✔ Accessibles à tous les niveaux",
              "✔ Contenu adapté au marché africain",
              "✔ Support après formation",
              "✔ Résultats rapides"
            ].map((point) => (
              <div key={point} className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700">
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Témoignages</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <blockquote className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-lg">⭐⭐⭐⭐⭐</p>
            <p className="mt-3 text-slate-700">Grâce à HAITECH, j’ai appris Excel et trouvé un emploi.</p>
            <footer className="mt-4 text-sm font-semibold text-haitechBlue">– Apprenant Academy</footer>
          </blockquote>
          <blockquote className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-lg">⭐⭐⭐⭐⭐</p>
            <p className="mt-3 text-slate-700">Formation claire et pratique, je recommande.</p>
            <footer className="mt-4 text-sm font-semibold text-haitechBlue">– Entrepreneur débutant</footer>
          </blockquote>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Parcours longs & évolution</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Parcours structurés combinant plusieurs modules — idéal entreprises ou reconversion. Tarifs à partir de,
            ajustés au nombre de participants.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {academyParcours.map((p) => (
              <div key={p.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <p className="text-xs uppercase tracking-wide text-slate-500">{p.duration}</p>
                <h3 className="mt-2 font-heading text-lg font-bold text-haitechBlue">{p.title}</h3>
                <p className="mt-2 font-semibold text-haitechBlue">À partir de {formatPrice(p.priceFrom)}</p>
                <ul className="mt-3 space-y-1 text-sm text-slate-600">
                  {p.modules.map((m) => (
                    <li key={m}>• {m}</li>
                  ))}
                </ul>
                <div className="mt-4">
                  <OrderRequestButton
                    sourceType="formation"
                    productName={`Parcours: ${p.title}`}
                    amount={p.priceFrom}
                    compact
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Modalités & financement</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {academyModalites.map((m) => (
            <div key={m.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="font-heading text-lg font-bold text-haitechBlue">{m.title}</p>
              <p className="mt-2 text-sm text-slate-600">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Niveaux d’apprentissage</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["Débutant", "Intermédiaire", "Avancé"].map((level, idx) => (
              <div key={level} className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                <p className="text-xs uppercase tracking-wide text-slate-500">Niveau {idx + 1}</p>
                <p className="mt-2 font-heading text-xl font-bold text-haitechBlue">{level}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-14">
        <div className="rounded-2xl bg-haitechBlue p-8 text-white">
          <h2 className="font-heading text-3xl font-bold">Commencez votre formation dès aujourd’hui</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="#formations-list" className="rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue">
              Acheter une formation
            </a>
            <a
              href={whatsappAcademyLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white px-6 py-3 font-semibold"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <a
        href={whatsappAcademyLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-xl"
      >
        WhatsApp
      </a>
    </div>
  );
}
