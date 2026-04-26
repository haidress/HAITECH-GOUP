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
  academyEbookPacks,
  academyEbooksMain,
  academyEbooksSecondary,
  academyModalites,
  academyParcours,
  type AcademyFilterLabel,
  type CatalogFormation
} from "@/lib/academy-catalog";
import { whatsappHref } from "@/lib/offers-catalog";
import { academyCategoryToBlogSlug, academyFormationSlug } from "@/lib/academy-utils";

type FormationItem = CatalogFormation;

const whatsappAcademyLink = whatsappHref("Bonjour, je souhaite acheter une formation HAITECH Academy");

function formatPrice(v: number) {
  return `${v.toLocaleString("fr-FR")} FCFA`;
}

export default function AcademyPage() {
  const [selectedCategory, setSelectedCategory] = useState<AcademyFilterLabel>("Tous");
  const [query, setQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<"Tous" | "Débutant" | "Intermédiaire" | "Avancé">("Tous");
  const [selectedFormat, setSelectedFormat] = useState<"Tous" | "Présentiel / Visio" | "Hybride">("Tous");
  const [sortBy, setSortBy] = useState<"relevance" | "price-asc" | "price-desc" | "level" | "duration">("relevance");
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [leadMagnetEmail, setLeadMagnetEmail] = useState("");
  const [leadMagnetStatus, setLeadMagnetStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [leadMagnetMessage, setLeadMagnetMessage] = useState("");
  const [formations, setFormations] = useState<CatalogFormation[]>(academyCatalogFormations);
  const [selectedFormation, setSelectedFormation] = useState(academyCatalogFormations[0]?.name ?? "");
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [openModaliteIdx, setOpenModaliteIdx] = useState<number | null>(0);
  const [showAllSecondaryEbooks, setShowAllSecondaryEbooks] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/academy-formations", { cache: "no-store" });
        const json = (await res.json()) as { success?: boolean; data?: CatalogFormation[] };
        const data = Array.isArray(json.data) ? json.data : [];
        if (!cancelled && res.ok && json.success && data.length > 0) {
          setFormations(data);
          setSelectedFormation((prev) => prev || data[0]!.name);
        }
      } catch {
        // fallback statique
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredFormations = useMemo(() => {
    const durationRank = (duration: string) => {
      const match = duration.match(/(\d+)/);
      return match ? Number(match[1]) : 999;
    };
    const levelRank = (level: FormationItem["level"]) => {
      if (level === "Débutant") return 1;
      if (level === "Intermédiaire") return 2;
      return 3;
    };

    const list = formations.filter((f) => {
      const categoryMatch = selectedCategory === "Tous" ? true : f.category === selectedCategory;
      const queryMatch =
        f.name.toLowerCase().includes(query.toLowerCase()) || (f.outcomes ?? []).join(" ").toLowerCase().includes(query.toLowerCase());
      const levelMatch = selectedLevel === "Tous" ? true : f.level === selectedLevel;
      const formatMatch = selectedFormat === "Tous" ? true : f.format === selectedFormat;
      return categoryMatch && queryMatch && levelMatch && formatMatch;
    });

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "level") {
      list.sort((a, b) => levelRank(a.level) - levelRank(b.level));
    } else if (sortBy === "duration") {
      list.sort((a, b) => durationRank(a.duration) - durationRank(b.duration));
    }

    return list;
  }, [selectedCategory, query, formations, selectedLevel, selectedFormat, sortBy]);

  const selectedFormationPrice = useMemo(() => {
    return formations.find((f) => f.name === selectedFormation)?.price ?? formations[0]?.price ?? 0;
  }, [selectedFormation, formations]);

  const selectedFormationData = useMemo(() => {
    return formations.find((f) => f.name === selectedFormation) ?? formations[0];
  }, [selectedFormation, formations]);

  const faqItems = [
    {
      q: "A qui s’adressent les formations HAITECH Academy ?",
      a: "Nos parcours sont conçus pour débutants, professionnels en reconversion et entrepreneurs qui veulent monter en compétences rapidement."
    },
    {
      q: "Quels sont les modes d’apprentissage disponibles ?",
      a: "Selon les formations : PDF + vidéo, présentiel/visio ou parcours mixtes. Le format exact est indiqué dans chaque fiche."
    },
    {
      q: "Comment se passe le paiement et l’accès ?",
      a: "Après la demande de commande, un conseiller vous contacte pour confirmer le mode de paiement et vous donner l’accès."
    },
    {
      q: "Peut-on former une équipe en entreprise ?",
      a: "Oui, nous proposons des formats intra-entreprise et des parcours personnalisés en fonction de vos objectifs."
    }
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  };

  function getFormationPersona(item: FormationItem) {
    if (item.level === "Débutant") return "Idéal pour débutants, étudiants et professionnels en montée de compétence.";
    if (item.level === "Intermédiaire") return "Conçu pour profils déjà actifs qui veulent professionnaliser leurs résultats.";
    return "Adapté aux profils techniques souhaitant déployer des projets avancés.";
  }

  function getFormationPrereq(item: FormationItem) {
    if (item.level === "Débutant") return "Aucun prérequis technique strict, motivation recommandée.";
    if (item.level === "Intermédiaire") return "Bases du domaine conseillées + pratique régulière.";
    return "Bonnes bases techniques requises et capacité à réaliser un mini-projet.";
  }

  function getFormationObjectives(item: FormationItem) {
    if (item.outcomes?.length) return item.outcomes.slice(0, 3);
    if (item.category === "Développement web") {
      return ["Concevoir une interface moderne", "Structurer un mini-projet", "Publier une version exploitable"];
    }
    if (item.category === "Business & digital") {
      return ["Clarifier votre offre", "Construire un plan d’action", "Piloter vos premiers résultats"];
    }
    return ["Acquérir des bases solides", "Appliquer des méthodes professionnelles", "Produire un livrable concret"];
  }

  function getFormationCertificate(item: FormationItem) {
    return item.badge === "🎓 Certifiant" ? "Oui (attestation certifiante)" : "Attestation de suivi";
  }

  function getUpsellSuggestionsForFormation(name: string) {
    const lower = name.toLowerCase();
    if (lower.includes("excel")) return academyEbooks.filter((e) => e.title.toLowerCase().includes("excel")).slice(0, 1);
    if (lower.includes("git") || lower.includes("react") || lower.includes("javascript"))
      return academyEbooks.filter((e) => e.title.toLowerCase().includes("git")).slice(0, 1);
    if (lower.includes("cyber")) return academyEbooks.filter((e) => e.title.toLowerCase().includes("cybersécurité")).slice(0, 1);
    if (lower.includes("business") || lower.includes("entrepreneur"))
      return academyEbooks.filter((e) => e.title.toLowerCase().includes("activité")).slice(0, 1);
    return academyEbooks.slice(0, 1);
  }

  async function submitLeadMagnet(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!leadMagnetEmail.trim()) {
      setLeadMagnetStatus("error");
      setLeadMagnetMessage("Merci de renseigner votre email.");
      return;
    }
    setLeadMagnetStatus("loading");
    setLeadMagnetMessage("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: "Lead magnet Academy",
          email: leadMagnetEmail.trim(),
          source: "site",
          besoin: "Demande d'extrait gratuit / mini module Academy"
        })
      });
      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.message ?? "Impossible d'envoyer votre demande.");
      }
      setLeadMagnetStatus("success");
      setLeadMagnetMessage("Extrait demandé. Un conseiller vous contacte rapidement.");
      setLeadMagnetEmail("");
    } catch (error) {
      setLeadMagnetStatus("error");
      setLeadMagnetMessage(error instanceof Error ? error.message : "Erreur lors de l'envoi.");
    }
  }

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section
        className="academy-hero-parallax relative overflow-hidden py-16 text-white md:py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,42,94,0.72), rgba(10,42,94,0.72)), url('/academy-hero-haitech-training.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
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
            <p className="mt-3 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold text-slate-100">
              Prochaine session: places limitees sur certaines formations
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#formations-list" className="btn-primary bg-haitechGold text-haitechBlue hover:bg-haitechGold/90">
                Commander une formation
              </a>
              <a href="#ebooks" className="btn-secondary border-white text-white hover:bg-white hover:text-haitechBlue">
                Voir les e-books
              </a>
              <a href={whatsappAcademyLink} target="_blank" rel="noreferrer" className="btn-secondary border-white text-white hover:bg-white hover:text-haitechBlue">
                Parler sur WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-[72px] z-30 border-y border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 text-xs font-semibold text-slate-700 md:text-sm">
          {[
            { href: "#formations-list", label: "Formations" },
            { href: "#ebooks", label: "E-books" },
            { href: "#parcours-longs", label: "Parcours" },
            { href: "#modalites-financement", label: "Modalités" },
            { href: "#faq-academy", label: "FAQ" },
            { href: "#commande-academy", label: "Commander" }
          ].map((item) => (
            <a key={item.href} href={item.href} className="rounded-full border border-slate-200 px-3 py-1.5 transition hover:bg-slate-100">
              {item.label}
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Preuves de confiance</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: "Apprenants formes", value: "1 200+" },
            { label: "Satisfaction apprenants", value: "96%" },
            { label: "Progression/insertion constatee", value: "78%" }
          ].map((metric) => (
            <div key={metric.label} className="surface-card p-5 text-center">
              <p className="font-heading text-3xl font-extrabold text-haitechBlue">{metric.value}</p>
              <p className="mt-1 text-sm text-slate-600">{metric.label}</p>
            </div>
          ))}
        </div>

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
        <div className="surface-card mb-5 p-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-input"
              placeholder="🔍 Rechercher une formation"
            />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as "Tous" | "Débutant" | "Intermédiaire" | "Avancé")}
              className="form-input"
            >
              <option value="Tous">Niveau : Tous</option>
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
            </select>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as "Tous" | "Présentiel / Visio" | "Hybride")}
              className="form-input"
            >
              <option value="Tous">Format : Tous</option>
              <option value="Présentiel / Visio">Présentiel / Visio</option>
              <option value="Hybride">Hybride</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "relevance" | "price-asc" | "price-desc" | "level" | "duration")}
              className="form-input"
            >
              <option value="relevance">Tri : Pertinence</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="level">Niveau</option>
              <option value="duration">Durée</option>
            </select>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {filteredFormations.length} formation(s) trouvée(s) selon vos filtres.
          </p>
        </div>
        {filteredFormations.length === 0 ? (
          <div className="surface-card mb-5 bg-amber-50 p-6">
            <h3 className="font-heading text-lg font-bold text-haitechBlue">Aucun résultat pour ces filtres</h3>
            <p className="mt-2 text-sm text-slate-700">
              Essayez un autre mot-clé ou revenez à des filtres plus larges pour retrouver des formations adaptées.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedLevel("Tous");
                setSelectedFormat("Tous");
                setSortBy("relevance");
              }}
              className="btn-primary mt-4 bg-haitechGold text-haitechBlue hover:bg-haitechGold/90"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : null}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredFormations.map((f, idx) => (
            <motion.article
              key={f.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="surface-card overflow-hidden"
            >
              <div className="relative h-44 w-full">
                <Image src={f.image} alt={f.name} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 33vw" />
              </div>
              <div className="p-5">
                {f.badge ? <span className="rounded-full bg-haitechGold px-3 py-1 text-xs font-semibold text-haitechBlue">{f.badge}</span> : null}
                <h3 className="mt-3 font-heading text-xl font-bold text-haitechBlue">{f.name}</h3>
                <div className="mt-2 space-y-1 text-sm text-slate-600">
                  <p>Durée : {f.duration}</p>
                  <p>Rythme : {f.weeklyHours ?? "4 heures / semaine"}</p>
                </div>
                <p className="mt-3 font-semibold text-haitechBlue">{formatPrice(f.price)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <OrderRequestButton
                    sourceType="formation"
                    productName={f.name}
                    amount={f.price}
                    compact
                    suggestions={getUpsellSuggestionsForFormation(f.name).map((item) => ({ name: `E-book: ${item.title}`, amount: item.price }))}
                  />
                  <a href={whatsappAcademyLink} target="_blank" rel="noreferrer" className="btn-secondary px-3 py-1.5 text-xs">
                    Discutons-en
                  </a>
                  {f.brochureUrl ? (
                    <Link href={f.brochureUrl} className="btn-secondary px-3 py-1.5 text-xs">
                      Télécharger la brochure
                    </Link>
                  ) : null}
                  <Link href={`/academy/${academyFormationSlug(f.name)}`} className="btn-primary px-3 py-1.5 text-xs">
                    Voir détails
                  </Link>
                </div>
                {selectedCategory !== "Tous" ? (
                  <Link
                    href={`/blog/categorie/${academyCategoryToBlogSlug(f.category)}`}
                    className="mt-3 inline-block text-xs font-semibold text-haitechBlue hover:underline"
                  >
                    Lire les conseils blog liés à {f.category.toLowerCase()}
                  </Link>
                ) : null}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="ebooks" className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">E-books principaux</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {academyEbooksMain.map((book) => (
              <article key={book.title} className="surface-card p-4">
                <div className="relative h-36 w-full overflow-hidden rounded-xl">
                  <Image src={book.image} alt={book.title} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 25vw" />
                </div>
                <h3 className="mt-3 font-heading text-lg font-bold text-haitechBlue">{book.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{book.desc}</p>
                <p className="mt-3 font-semibold text-haitechBlue">{formatPrice(book.price)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={book.file} download className="btn-primary px-3 py-1.5 text-xs">
                    Télécharger
                  </a>
                  <Link href="#commande-academy" className="btn-secondary px-3 py-1.5 text-xs">
                    Voir détails
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="surface-card mt-10 border border-haitechBlue/10 bg-blue-50 p-6">
            <h3 className="font-heading text-xl font-bold text-haitechBlue">Packs e-books</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {academyEbookPacks.map((pack) => (
                <article key={pack.title} className="surface-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Pack {pack.badge ? <span className="text-haitechBlue">{pack.badge}</span> : null}
                  </p>
                  <h4 className="mt-1 font-heading text-lg font-bold text-haitechBlue">{pack.title}</h4>
                  <p className="mt-2 text-sm text-slate-600">{pack.desc}</p>
                  <p className="mt-2 font-semibold text-haitechBlue">{formatPrice(pack.price)}</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    {pack.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  <div className="mt-3">
                    <OrderRequestButton sourceType="formation" productName={pack.title} amount={pack.price} compact />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="font-heading text-xl font-bold text-haitechBlue">Autres guides utiles</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {(showAllSecondaryEbooks ? academyEbooksSecondary : academyEbooksSecondary.slice(0, 3)).map((book) => (
                <article key={book.title} className="surface-card p-4">
                  <h4 className="font-heading text-lg font-bold text-haitechBlue">{book.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{book.desc}</p>
                  <p className="mt-2 font-semibold text-haitechBlue">{formatPrice(book.price)}</p>
                  <a href={book.file} download className="btn-secondary mt-3 inline-block px-3 py-1.5 text-xs">
                    Télécharger
                  </a>
                </article>
              ))}
            </div>
            {academyEbooksSecondary.length > 3 ? (
              <button type="button" className="btn-secondary mt-4" onClick={() => setShowAllSecondaryEbooks((prev) => !prev)}>
                {showAllSecondaryEbooks ? "Voir moins" : "Voir plus"}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section id="commande-academy" className="mx-auto max-w-7xl px-4 py-14">
        <div className="surface-card p-6">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Passer une commande</h2>
          <p className="mt-2 text-sm text-slate-600">Cliquez sur commander pour envoyer vos coordonnées à l&apos;administrateur.</p>
          <div className="mt-4 grid gap-2 text-xs md:grid-cols-3">
            <div className="surface-card bg-slate-50 p-3 text-slate-700">1. Choisissez votre formation</div>
            <div className="surface-card bg-slate-50 p-3 text-slate-700">2. Renseignez vos coordonnées</div>
            <div className="surface-card bg-slate-50 p-3 text-slate-700">3. Validation et rappel d&apos;un conseiller</div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <input
              value={checkoutName}
              onChange={(e) => setCheckoutName(e.target.value)}
              className="form-input"
              placeholder="Nom"
            />
            <input
              value={checkoutEmail}
              onChange={(e) => setCheckoutEmail(e.target.value)}
              className="form-input"
              placeholder="Email"
              type="email"
            />
            <select value={selectedFormation} onChange={(e) => setSelectedFormation(e.target.value)} className="form-input">
              {formations.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-3 text-sm font-semibold text-haitechBlue">Montant : {formatPrice(selectedFormationPrice)}</p>
          <div className="surface-card mt-3 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-haitechBlue">Récapitulatif :</p>
            <p>Formation : {selectedFormationData?.name ?? "-"}</p>
            <p>Niveau : {selectedFormationData?.level ?? "-"}</p>
            <p>Format : {selectedFormationData?.format ?? "-"}</p>
            <p>Durée : {selectedFormationData?.duration ?? "-"}</p>
            <p>Montant : {formatPrice(selectedFormationPrice)}</p>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Vous recevrez un message de confirmation et les modalités de paiement juste après validation.
          </p>
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
              <div key={point} className="surface-card p-4 text-sm font-semibold text-slate-700">
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Témoignages</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <blockquote className="surface-card p-6">
            <p className="text-lg">⭐⭐⭐⭐⭐</p>
            <p className="mt-3 text-slate-700">Grâce à HAITECH, j’ai appris Excel et trouvé un emploi.</p>
            <footer className="mt-4 text-sm font-semibold text-haitechBlue">– Apprenant Academy</footer>
          </blockquote>
          <blockquote className="surface-card p-6">
            <p className="text-lg">⭐⭐⭐⭐⭐</p>
            <p className="mt-3 text-slate-700">Formation claire et pratique, je recommande.</p>
            <footer className="mt-4 text-sm font-semibold text-haitechBlue">– Entrepreneur débutant</footer>
          </blockquote>
        </div>
      </section>

      <section id="parcours-longs" className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Packs formation</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Packs combines pour accelerer les resultats avec un tarif preferentiel.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {academyParcours.map((p) => (
              <div key={p.title} className="surface-card p-6">
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

      <section id="modalites-financement" className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Modalités & financement</h2>
        <div className="mt-6 space-y-3">
          {academyModalites.map((m, idx) => {
            const open = openModaliteIdx === idx;
            return (
              <div key={m.title} className="surface-card overflow-hidden">
                <button
                  type="button"
                  aria-expanded={open}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                  onClick={() => setOpenModaliteIdx((prev) => (prev === idx ? null : idx))}
                >
                  <span className="font-heading text-lg font-bold text-haitechBlue">{m.title}</span>
                  <span className="text-lg text-slate-500">{open ? "−" : "+"}</span>
                </button>
                {open ? <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">{m.text}</p> : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Niveaux d’apprentissage</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["Débutant", "Intermédiaire", "Avancé"].map((level, idx) => (
              <div key={level} className="surface-card p-6 text-center">
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
            <a href="#formations-list" className="btn-primary bg-haitechGold text-haitechBlue hover:bg-haitechGold/90">
              Acheter une formation
            </a>
            <a
              href={whatsappAcademyLink}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary border-white text-white hover:bg-white hover:text-haitechBlue"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section id="faq-academy" className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">FAQ Academy</h2>
        <div className="mt-6 space-y-3">
          {faqItems.map((item, idx) => {
            const open = openFaqIdx === idx;
            return (
              <div key={item.q} className="surface-card overflow-hidden">
                <button
                  type="button"
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                  onClick={() => setOpenFaqIdx((prev) => (prev === idx ? null : idx))}
                >
                  <span className="font-semibold text-haitechBlue">{item.q}</span>
                  <span className="text-lg text-slate-500">{open ? "−" : "+"}</span>
                </button>
                {open ? <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-700">{item.a}</p> : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="surface-card bg-slate-50 p-6">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue">Mini module gratuit / extrait PDF</h2>
          <p className="mt-2 text-sm text-slate-600">
            Laissez votre email pour recevoir un extrait gratuit et découvrir la pédagogie Academy avant achat.
          </p>
          <form onSubmit={submitLeadMagnet} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={leadMagnetEmail}
              onChange={(e) => setLeadMagnetEmail(e.target.value)}
              className="form-input"
              placeholder="Votre email professionnel"
              required
            />
            <button type="submit" className="btn-primary" disabled={leadMagnetStatus === "loading"}>
              {leadMagnetStatus === "loading" ? "Envoi..." : "Recevoir l'extrait"}
            </button>
          </form>
          {leadMagnetMessage ? (
            <p className={`mt-3 text-sm ${leadMagnetStatus === "success" ? "text-emerald-600" : "text-red-600"}`}>{leadMagnetMessage}</p>
          ) : null}
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
