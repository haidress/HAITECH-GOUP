"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { OrderRequestButton } from "@/components/OrderRequestButton";

const whatsappBusinessLink =
  "https://wa.me/2250789174619?text=Bonjour,%20je%20suis%20intéressé%20par%20vos%20offres%20Business%20Center";

const activities = [
  {
    title: "Immobilier",
    image: "/slide-business.png",
    points: ["Vente de terrains", "Vente de maisons", "Accompagnement investissement", "Conseils acquisition"],
    cta: "Voir les biens disponibles"
  },
  {
    title: "Location & Vente de véhicules",
    image: "/slide-1.jpg",
    points: ["Location courte et longue durée", "Vente de véhicules", "Véhicules récents et fiables"],
    cta: "Voir les véhicules"
  },
  {
    title: "Conciergerie",
    image: "/slide-3.jpg",
    points: ["Assistance personnalisée", "Gestion de services", "Organisation et accompagnement"],
    cta: "Demander un service"
  },
  {
    title: "Distribution (HAITH SIGNATURE)",
    image: "/slide-visuel.png",
    points: ["T-shirts, sandales, accessoires", "Branding lifestyle", "Produits de qualité"],
    cta: "Découvrir la collection"
  }
];

type BusinessProduct = {
  id: number;
  nom: string;
  description: string | null;
  prix_base: number;
};

export default function BusinessCenterPage() {
  const [products, setProducts] = useState<BusinessProduct[]>([]);

  useEffect(() => {
    fetch("/api/catalog/products?category=Business%20Center")
      .then((r) => r.json())
      .then((d) => setProducts(d.data ?? []));
  }, []);

  return (
    <div className="bg-white">
      <section
        className="relative overflow-hidden py-16 text-white md:py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,42,94,0.72), rgba(10,42,94,0.72)), url('/slide-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
            <h1 className="font-heading text-3xl font-extrabold leading-tight md:text-5xl">
              Développez votre business avec des solutions concrètes
            </h1>
            <p className="mt-4 text-sm text-slate-100 md:text-lg">
              Immobilier, véhicules, conciergerie et distribution : tout ce dont vous avez besoin pour avancer.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#business-offres" className="rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue">
                Commander maintenant
              </a>
              <a
                href={whatsappBusinessLink}
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

      <section id="business-offres" className="mx-auto max-w-7xl px-4 py-14 md:py-16">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Nos activités Business Center</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {activities.map((item, idx) => (
            <motion.a
              key={item.title}
              href={whatsappBusinessLink}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-haitechBlue/20"
            >
              <div className="relative h-56">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <h3 className="absolute bottom-4 left-4 font-heading text-2xl font-bold text-white">{item.title}</h3>
              </div>
              <div className="p-5">
                <ul className="space-y-1 text-sm text-slate-700">
                  {item.points.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
                <span className="mt-4 inline-block rounded-full bg-haitechBlue px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-haitechGold group-hover:text-haitechBlue">
                  {item.cta}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Opportunités du moment</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {products.slice(0, 6).map((op) => (
              <article key={op.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-48">
                  <Image src="/slide-business.png" alt={op.nom} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold text-haitechBlue">{op.nom}</h3>
                  <p className="mt-1 text-sm text-slate-600">{op.description ?? "Produit Business Center"}</p>
                  <p className="mt-2 text-sm font-semibold text-haitechBlue">{Number(op.prix_base).toLocaleString("fr-FR")} FCFA</p>
                  <a
                    href={whatsappBusinessLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block rounded-full bg-haitechGold px-4 py-2 text-sm font-semibold text-haitechBlue"
                  >
                    WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:py-16">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Pourquoi choisir HAITECH Business Center</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {[
            "✅ Offres vérifiées et fiables",
            "🤝 Accompagnement personnalisé",
            "⚡ Réactivité rapide",
            "💼 Opportunités accessibles",
            "🔎 Transparence"
          ].map((item) => (
            <div key={item} className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Bénéfices clients</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {[
              "✔️ Investissements sécurisés",
              "✔️ Gain de temps",
              "✔️ Opportunités exclusives",
              "✔️ Accompagnement complet",
              "✔️ Simplicité des démarches"
            ].map((item) => (
              <div key={item} className="rounded-xl bg-haitechBlue p-5 text-sm font-semibold text-white">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:py-16">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Offres / Packs Business</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {products.slice(0, 3).map((pack, idx) => (
            <article
              key={pack.id}
              className={`rounded-2xl border p-6 shadow-sm ${
                idx === 1 ? "border-haitechGold bg-gradient-to-b from-haitechGold/10 to-white" : "border-slate-200 bg-white"
              }`}
            >
              <h3 className="font-heading text-xl font-bold text-haitechBlue">{pack.nom}</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Offre personnalisable selon besoin</li>
                <li>• Accompagnement dédié</li>
                <li>• Paiement en ligne disponible</li>
              </ul>
              <div className="mt-5">
                <OrderRequestButton
                  sourceType="business_center"
                  productName={pack.nom}
                  amount={Number(pack.prix_base)}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Comment ça marche</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              "Vous nous contactez",
              "Nous analysons votre besoin",
              "Nous proposons des solutions",
              "Nous vous accompagnons jusqu’à la réalisation"
            ].map((step) => (
              <div key={step} className="rounded-xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-700">
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:py-16">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Témoignages clients</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <blockquote className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-lg">⭐⭐⭐⭐⭐</p>
            <p className="mt-3 text-slate-700">Achat de terrain sécurisé et accompagnement transparent du début à la fin.</p>
            <footer className="mt-4 text-sm font-semibold text-haitechBlue">– Investisseur, Abidjan</footer>
          </blockquote>
          <blockquote className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-lg">⭐⭐⭐⭐⭐</p>
            <p className="mt-3 text-slate-700">Service de location de véhicule très fiable, simple et rapide.</p>
            <footer className="mt-4 text-sm font-semibold text-haitechBlue">– Client mobilité</footer>
          </blockquote>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:pb-20">
        <div className="rounded-2xl bg-haitechBlue p-8 text-white">
          <h2 className="font-heading text-3xl font-bold">Passez à l’action dès maintenant</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={whatsappBusinessLink}
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
        href={whatsappBusinessLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-xl"
      >
        WhatsApp
      </a>
    </div>
  );
}
