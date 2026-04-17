"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { OrderRequestButton } from "@/components/OrderRequestButton";
import {
  boutiqueItBundles,
  boutiqueItDeliveryPoints,
  boutiqueItFaqSteps,
  boutiqueItRayons,
  boutiqueItTrustPoints,
  whatsappHref
} from "@/lib/offers-catalog";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  badge?: "🔥 Meilleur choix" | "⭐ Populaire" | "💥 Promo";
  status: "Disponible" | "Promo";
};

function formatPrice(v: number) {
  return `${v.toLocaleString("fr-FR")} FCFA`;
}

function whatsappProductLink(productName: string) {
  return whatsappHref(`Bonjour, je suis intéressé par le produit ${productName}`);
}

function productMatchesRayon(p: Product, rayonLabel: string) {
  if (rayonLabel === "Tous") return true;
  const rayon = boutiqueItRayons.find((r) => r.label === rayonLabel);
  if (!rayon) return p.category === rayonLabel;
  const text = `${p.name} ${p.description}`.toLowerCase();
  return rayon.keywords.some((k) => text.includes(k.toLowerCase()));
}

export default function BoutiqueItPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Tous");

  const categoryButtons = useMemo(() => ["Tous", ...boutiqueItRayons.map((r) => r.label)], []);

  useEffect(() => {
    fetch("/api/catalog/products?category=Boutique%20IT")
      .then((r) => r.json())
      .then((d) => {
        const mapped = (d.data ?? []).map((item: { id: number; nom: string; prix_base: number; categorie: string; description: string | null }) => ({
          id: item.id,
          name: item.nom,
          price: Number(item.prix_base),
          category: item.categorie,
          description: item.description ?? "",
          image: "/slide-transformation.png",
          status: "Disponible" as const
        }));
        setProducts(mapped);
      });
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = productMatchesRayon(p, category);
      const matchQuery =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [query, category, products]);

  const topProducts = products.slice(0, 6);

  return (
    <div className="bg-white">
      <section
        className="relative overflow-hidden py-16 text-white md:py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,42,94,0.75), rgba(10,42,94,0.75)), url('/slide-transformation.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
            <h1 className="font-heading text-3xl font-extrabold leading-tight md:text-5xl">
              Équipez-vous avec du matériel informatique fiable et performant
            </h1>
            <p className="mt-4 text-sm text-slate-100 md:text-lg">
              Matériel informatique, réseau, périphériques et bundles pour professionnels et particuliers — stock et
              commandes sur devis.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#produits" className="rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue">
                Commander maintenant
              </a>
              <a
                href={whatsappProductLink("matériel informatique")}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white px-6 py-3 font-semibold"
              >
                Besoin d&apos;aide sur WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 Rechercher un produit"
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            />
            <div className="flex flex-wrap gap-2">
              {categoryButtons.map((btn) => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => setCategory(btn)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    category === btn ? "bg-haitechBlue text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="produits" className="mx-auto max-w-7xl px-4 pb-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Produits disponibles</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filtered.map((product, idx) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-haitechBlue/20"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1280px) 50vw, 25vw"
                />
                <div className="absolute left-3 top-3 rounded-full bg-haitechBlue px-3 py-1 text-xs font-semibold text-white">
                  {product.status}
                </div>
                {product.badge ? (
                  <div className="absolute right-3 top-3 rounded-full bg-haitechGold px-3 py-1 text-xs font-semibold text-haitechBlue">
                    {product.badge}
                  </div>
                ) : null}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
                  <a
                    href={whatsappProductLink(product.name)}
                    target="_blank"
                    rel="noreferrer"
                    className="m-4 rounded-full bg-haitechGold px-4 py-2 text-sm font-semibold text-haitechBlue"
                  >
                    Commander sur WhatsApp
                  </a>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-bold text-haitechBlue">{product.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{product.description}</p>
                <p className="mt-3 font-semibold text-haitechBlue">{formatPrice(product.price)}</p>
                <div className="mt-4">
                  <OrderRequestButton
                    sourceType="boutique_it"
                    productName={product.name}
                    amount={product.price}
                    compact
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">TOP Produits</h2>
          <p className="mt-2 text-sm text-slate-600">🔥 Produits les plus demandés | ⭐ Meilleures ventes | 💥 Promotions</p>
          <div className="mt-6 flex snap-x gap-4 overflow-x-auto pb-2">
            {topProducts.map((p) => (
              <article key={p.id} className="min-w-[280px] snap-start rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="relative h-40 w-full overflow-hidden rounded-xl">
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="280px" />
                </div>
                <p className="mt-3 text-xs font-semibold text-haitechBlue">{p.badge}</p>
                <h3 className="mt-1 font-heading text-lg font-bold text-haitechBlue">{p.name}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-700">{formatPrice(p.price)}</p>
                <div className="mt-3">
                  <OrderRequestButton
                    sourceType="boutique_it"
                    productName={p.name}
                    amount={p.price}
                    compact
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Rayons & familles produits</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Filtrez le catalogue par rayon (mots-clés). Les références exactes dépendent du stock — demandez un devis
          pour toute référence non listée.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {boutiqueItRayons.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => {
                setCategory(c.label);
                document.getElementById("produits")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-2xl">{c.icon}</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{c.label}</p>
              <p className="mt-1 text-xs text-slate-500">{c.blurb}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Bundles & packs matériel</h2>
          <p className="mt-2 text-sm text-slate-600">Montants « à partir de », personnalisables selon stock et configuration.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {boutiqueItBundles.map((b) => (
              <article key={b.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-heading text-lg font-bold text-haitechBlue">{b.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{b.tagline}</p>
                <p className="mt-3 font-semibold text-haitechBlue">À partir de {formatPrice(b.fromPriceFcfa)}</p>
                <ul className="mt-3 space-y-1 text-sm text-slate-700">
                  {b.items.map((it) => (
                    <li key={it}>• {it}</li>
                  ))}
                </ul>
                <div className="mt-4">
                  <OrderRequestButton
                    sourceType="boutique_it"
                    productName={`Bundle: ${b.title}`}
                    amount={b.fromPriceFcfa}
                    compact
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Pourquoi acheter chez nous</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {boutiqueItTrustPoints.map((point) => (
              <div key={point} className="rounded-xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-700">
                ✔ {point}
              </div>
            ))}
          </div>
          <h3 className="mt-10 font-heading text-lg font-bold text-haitechBlue">Livraison & SAV</h3>
          <ul className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
            {boutiqueItDeliveryPoints.map((line) => (
              <li key={line} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-2xl bg-haitechBlue p-8 text-white">
          <h2 className="font-heading text-3xl font-bold">💥 Promo du moment : -10% sur certains accessoires</h2>
          <a
            href={whatsappProductLink("offre spéciale Boutique IT")}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue"
          >
            Commander maintenant
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Comment commander ?</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {boutiqueItFaqSteps.map((step) => (
            <div key={step.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold text-haitechBlue">{step.title}</p>
              <p className="mt-2 text-sm text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-2xl bg-haitechBlue p-8 text-white">
          <h2 className="font-heading text-3xl font-bold">Besoin d’un équipement spécifique ?</h2>
          <a
            href={whatsappProductLink("équipement spécifique")}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue"
          >
            Contactez-nous sur WhatsApp
          </a>
        </div>
      </section>

      <a
        href={whatsappProductLink("produit informatique")}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-xl"
      >
        WhatsApp
      </a>
    </div>
  );
}
