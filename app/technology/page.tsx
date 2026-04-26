"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { OrderRequestButton } from "@/components/OrderRequestButton";
import { itAddOns, itManagedTiers, itServiceLines, itServicePacks, whatsappHref } from "@/lib/offers-catalog";
import type { PublicItCatalog } from "@/lib/repositories/it-catalog-repository";

const whatsappItLink = whatsappHref("Bonjour, je souhaite un service informatique HAITECH GROUP");
const calendarLink = "https://calendly.com/haitech-group/diagnostic-it";

function formatPriceFcfa(v: number) {
  return `${v.toLocaleString("fr-FR")} FCFA`;
}

function slugifyPackTitle(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getPackActionLabel(title: string) {
  if (title.toLowerCase().includes("starter")) return "Choisir Starter";
  if (title.toLowerCase().includes("pro")) return "Choisir Pro";
  if (title.toLowerCase().includes("premium")) return "Demander une étude";
  if (title.toLowerCase().includes("audit")) return "Discutons-en";
  return "Commander";
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
  const [isMobile, setIsMobile] = useState(false);
  const [openAddons, setOpenAddons] = useState(false);
  const [openBenefits, setOpenBenefits] = useState(false);
  const [qualification, setQualification] = useState<"incident" | "project" | "outsourcing">("project");
  const [estimatorPosts, setEstimatorPosts] = useState(10);
  const [estimatorType, setEstimatorType] = useState("PME services");
  const [estimatorUrgency, setEstimatorUrgency] = useState<"normale" | "haute" | "critique">("normale");

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

  useEffect(() => {
    function syncMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    syncMobile();
    window.addEventListener("resize", syncMobile);
    return () => window.removeEventListener("resize", syncMobile);
  }, []);

  const { serviceLines, packs, addons } = catalog;
  const reduceMotion = useReducedMotion();
  const shouldAnimate = !reduceMotion && !isMobile;
  const basePerPoste = 20_000;

  const managedPlans = [
    {
      name: "Starter",
      badge: "",
      audience: "Pour indépendants et petites structures",
      price: 20_000,
      support: "Assistance 5j/7 (heures ouvrées)",
      response: "< 8h",
      includes: [
        "Maintenance préventive (2 passages / mois)",
        "Dépannage à distance",
        "Mises à jour et sécurité de base",
        "Sauvegarde simple des postes",
        "Assistance utilisateurs"
      ],
      idealFor: "Freelances, TPE, petits bureaux",
      cta: "Choisir Starter"
    },
    {
      name: "Pro",
      badge: "⭐ Le plus choisi",
      audience: "Pour PME en croissance",
      price: 45_000,
      support: "Assistance prioritaire",
      response: "< 4h",
      includes: [
        "Tout le pack Starter",
        "Supervision des postes (surveillance continue)",
        "Maintenance proactive",
        "Gestion Microsoft 365 (niveau basique)",
        "Heures d’intervention incluses",
        "Optimisation des performances"
      ],
      idealFor: "PME, startups structurées",
      cta: "Choisir Pro"
    },
    {
      name: "Premium",
      badge: "",
      audience: "Pour entreprises exigeantes",
      price: 75_000,
      support: "SLA personnalisé, support étendu (option HNO)",
      response: "Prioritaire",
      includes: [
        "Tout le pack Pro",
        "Monitoring avancé 24/7 (option)",
        "Rapport mensuel détaillé",
        "Comité de suivi trimestriel",
        "Sécurité renforcée",
        "Astreinte (option)"
      ],
      idealFor: "Entreprises critiques, structures sensibles",
      cta: "Demander un devis"
    }
  ] as const;

  const monthlyEstimate = useMemo(() => {
    const urgencyMultiplier = estimatorUrgency === "critique" ? 1.25 : estimatorUrgency === "haute" ? 1.1 : 1;
    return Math.round(estimatorPosts * basePerPoste * urgencyMultiplier);
  }, [estimatorPosts, estimatorUrgency]);

  const recommendation = useMemo(() => {
    if (estimatorPosts <= 5) return "Pack recommandé: Starter";
    if (estimatorPosts <= 25) return "Pack recommandé: Pro";
    return "Pack recommandé: Premium";
  }, [estimatorPosts]);

  const qualifyingMessage = useMemo(() => {
    if (qualification === "incident") return "Priorité support: intervention rapide + diagnostic immédiat.";
    if (qualification === "outsourcing") return "Priorité externalisation: audit parc + proposition infogérance.";
    return "Priorité projet: cadrage besoin + feuille de route d'exécution.";
  }, [qualification]);

  const kpiCards = [
    { label: "Temps moyen de résolution", value: "< 4h" },
    { label: "Incidents évités (moyenne annuelle)", value: "37%" },
    { label: "Satisfaction clients", value: "96%" },
    { label: "Disponibilité postes critiques", value: "99.2%" }
  ];

  const benefitCards = [
    "Réduction des interruptions opérationnelles",
    "Pilotage budgétaire IT plus prévisible",
    "Sécurité renforcée sur les postes et accès",
    "Accompagnement continu et reporting lisible",
    "Décisions rapides grâce aux indicateurs"
  ];

  const comparisonRows = [
    {
      label: "Support utilisateurs",
      values: ["✔️", "✔️", "✔️"]
    },
    {
      label: "Temps de réponse",
      values: ["8h", "4h", "Prioritaire"]
    },
    {
      label: "Maintenance préventive",
      values: ["✔️", "✔️", "✔️"]
    },
    {
      label: "Supervision",
      values: ["❌", "✔️", "✔️"]
    },
    {
      label: "Sauvegarde",
      values: ["Basique", "✔️", "Avancée"]
    },
    {
      label: "M365",
      values: ["❌", "✔️", "✔️"]
    },
    {
      label: "Monitoring 24/7",
      values: ["❌", "❌", "✔️ (option)"]
    },
    {
      label: "Reporting",
      values: ["❌", "❌", "✔️"]
    }
  ];

  return (
    <div className="bg-white">
      <section
        className="relative overflow-hidden py-16 text-white md:py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,42,94,0.78), rgba(10,42,94,0.78)), url('/slide-transformation.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "scroll"
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2">
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 22 } : false}
            animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
            transition={shouldAnimate ? { duration: 0.5 } : undefined}
          >
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
                className="btn-primary bg-haitechGold text-haitechBlue hover:bg-haitechGold/90"
              >
                Demander un devis
              </a>
              <a href="#diagnostic-rapide" className="text-sm font-semibold text-white/90 underline underline-offset-4">
                Diagnostic gratuit 15 min
              </a>
            </div>
          </motion.div>
          <div className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-haitechGold">Priorité business</p>
            <h2 className="font-heading text-xl font-bold">3 blocs clés pour décider vite</h2>
            <ul className="space-y-2 text-sm text-slate-100">
              <li>• Nos services clés</li>
              <li>• Packs recommandés</li>
              <li>• Diagnostic gratuit en 15 minutes</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="sticky top-[72px] z-30 border-y border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-3 text-xs font-semibold text-slate-700 md:text-sm">
          {[
            { href: "#services-it", label: "Services" },
            { href: "#packs-it", label: "Packs" },
            { href: "#infogerance", label: "Infogérance" },
            { href: "#process", label: "Process" },
            { href: "#contact", label: "Contact" }
          ].map((item) => (
            <a key={item.href} href={item.href} className="rounded-full border border-slate-200 px-3 py-1.5 hover:bg-slate-100">
              {item.label}
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <a href="#services-it" className="surface-card p-5 hover:shadow-md">
            <p className="text-xs uppercase tracking-wide text-slate-500">Priorité 1</p>
            <h3 className="mt-2 font-heading text-lg font-bold text-haitechBlue">Nos services clés</h3>
            <p className="mt-2 text-sm text-slate-600">Vue rapide des expertises activables immédiatement.</p>
          </a>
          <a href="#packs-it" className="surface-card p-5 hover:shadow-md">
            <p className="text-xs uppercase tracking-wide text-slate-500">Priorité 2</p>
            <h3 className="mt-2 font-heading text-lg font-bold text-haitechBlue">Packs recommandés</h3>
            <p className="mt-2 text-sm text-slate-600">Offres prêtes à déployer selon votre contexte.</p>
          </a>
          <a href="#diagnostic-rapide" className="surface-card p-5 hover:shadow-md">
            <p className="text-xs uppercase tracking-wide text-slate-500">Priorité 3</p>
            <h3 className="mt-2 font-heading text-lg font-bold text-haitechBlue">Diagnostic gratuit 15 min</h3>
            <p className="mt-2 text-sm text-slate-600">Qualification express et plan d’action initial.</p>
          </a>
        </div>
      </section>

      <section id="services-it" className="mx-auto max-w-7xl px-4 py-14 md:py-16">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Nos Services IT</h2>
        <p className="mt-2 text-sm text-slate-600">Des briques de service activables seules ou combinées selon vos objectifs.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {serviceLines.map((service, idx) => (
            <a
              key={`${service.title}-${idx}`}
              href={whatsappItLink}
              target="_blank"
              rel="noreferrer"
              aria-label={`Contacter HAITECH pour ${service.title}`}
              className="surface-card group p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-haitechBlue/20 focus-visible:ring-2 focus-visible:ring-haitechBlue/50"
            >
              <p className="text-3xl">{service.icon}</p>
              <h3 className="mt-3 font-heading text-xl font-bold text-haitechBlue">{service.title}</h3>
              <p className="mt-3 text-slate-600">{service.desc}</p>
              <span className="btn-primary mt-5 inline-block px-4 py-2 text-sm group-hover:bg-haitechGold group-hover:text-haitechBlue">
                {service.cta}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section id="packs-it" className="mx-auto max-w-7xl px-4 py-14 md:py-16">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Nos packs</h2>
        <p className="mt-2 text-sm text-slate-600">Tarifs indicatifs, positionnement clair et périmètre défini pour décider rapidement.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {packs.map((pack) => (
            <article
              key={pack.title}
              className={`surface-card p-6 ${
                pack.badge ? "border-haitechGold bg-gradient-to-b from-haitechGold/10 to-white" : "bg-white"
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
                <p className="mt-2 text-sm font-semibold text-haitechBlue">
                  À partir de {formatPriceFcfa(pack.fromPriceFcfa)} (fourchette {formatPriceFcfa(pack.fromPriceFcfa)} -{" "}
                  {formatPriceFcfa(Math.round(pack.fromPriceFcfa * 1.3))})
                </p>
              ) : null}
              <p className="mt-1 text-xs text-slate-500">Délai moyen de mise en place: 3 à 10 jours ouvrés.</p>
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
                <a href={whatsappItLink} target="_blank" rel="noreferrer" className="btn-secondary inline-block px-4 py-2 text-sm">
                  {getPackActionLabel(pack.title)}
                </a>
                <a href={`/api/services-it/packs/${slugifyPackTitle(pack.title)}/pdf`} className="btn-secondary inline-block px-4 py-2 text-sm">
                  Télécharger la fiche service
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="surface-card mt-10 p-6">
          <h3 className="font-heading text-lg font-bold text-haitechBlue">Options & services complémentaires</h3>
          <p className="mt-1 text-sm text-slate-600">Modules additionnels à activer selon votre contexte opérationnel.</p>
          <button
            type="button"
            className="btn-secondary mt-4 px-4 py-2 text-sm"
            onClick={() => setOpenAddons((prev) => !prev)}
            aria-expanded={openAddons}
          >
            {openAddons ? "Masquer les options" : "Afficher les options"}
          </button>
          {openAddons ? (
            <ul className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
              {addons.map((a) => (
                <li key={a}>• {a}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="mt-8 rounded-xl bg-haitechBlue p-6 text-white">
          <h3 className="font-heading text-2xl font-bold">Vous avez un besoin spécifique ?</h3>
          <p className="mt-2 text-sm text-slate-100">Un seul point de contact pour cadrer et chiffrer votre besoin en moins de 15 minutes.</p>
          <a
            href={whatsappItLink}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-4 inline-block bg-haitechGold text-haitechBlue hover:bg-haitechGold/90"
          >
            Demander un devis sur WhatsApp
          </a>
        </div>
      </section>

      <section id="infogerance" className="py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Infogérance & maintenance (par poste)</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Forfaits indicatifs par poste et par mois — devis obligatoire selon parc, serveurs et options. SLA visés,
            non contractuels tant que le contrat n&apos;est pas signé.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {managedPlans.map((tier, idx) => (
              <motion.article
                key={tier.name}
                initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
                whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true, amount: 0.2 }}
                transition={shouldAnimate ? { duration: 0.35, delay: idx * 0.04 } : undefined}
                className={`surface-card bg-white p-6 ${idx === 1 ? "border-haitechGold ring-2 ring-haitechGold/30" : ""}`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{tier.audience}</p>
                <h3 className="mt-2 font-heading text-xl font-bold text-haitechBlue">{tier.name}</h3>
                {tier.badge ? <p className="mt-1 text-xs font-semibold text-amber-700">{tier.badge}</p> : null}
                <p className="mt-2 text-2xl font-extrabold text-haitechBlue">
                  à partir de {formatPriceFcfa(tier.price)}
                  <span className="text-sm font-normal text-slate-500"> / poste / mois</span>
                </p>
                <p className="mt-2 text-xs text-slate-500">{tier.support}</p>
                <p className="mt-1 text-xs text-slate-500">Temps de réponse: {tier.response}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {tier.includes.map((h) => (
                    <li key={h}>• {h}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-slate-600">Idéal pour: {tier.idealFor}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <OrderRequestButton sourceType="services_it" productName={`Infogérance ${tier.name} (estimation)`} amount={tier.price} compact />
                  <a href={whatsappItLink} target="_blank" rel="noreferrer" className="btn-secondary px-3 py-1.5 text-xs">
                    {tier.cta}
                  </a>
                </div>
              </motion.article>
            ))}
          </div>

          {managedPlans.length > 0 ? (
            <div className="surface-card mt-8 overflow-x-auto p-5">
              <h3 className="font-heading text-lg font-bold text-haitechBlue">Tableau comparatif</h3>
              <table className="mt-4 min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-slate-500">Critère</th>
                    {managedPlans.map((tier) => (
                      <th key={`head-${tier.name}`} className="px-3 py-2 font-semibold text-haitechBlue">
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.label} className="border-b border-slate-100">
                      <td className="px-3 py-2 font-semibold text-slate-700">{row.label}</td>
                      {row.values.map((value, idx) => (
                        <td key={`${row.label}-${idx}`} className="px-3 py-2 text-slate-600">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </section>

      <section id="process" className="bg-slate-50 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Comment nous travaillons</h2>
          <p className="mt-2 text-sm text-slate-600">Un process court, lisible et orienté résultat opérationnel.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {["1. Analyse du besoin", "2. Proposition adaptée", "3. Mise en œuvre", "4. Suivi & optimisation"].map((step, i) => (
              <motion.div
                key={step}
                initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
                whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true }}
                transition={shouldAnimate ? { duration: 0.3, delay: i * 0.05 } : undefined}
                className="surface-card p-5"
              >
                <p className="font-semibold text-haitechBlue">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:py-16">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">KPIs business</h2>
        <p className="mt-2 text-sm text-slate-600">Des indicateurs concrets pour piloter l’impact IT sur votre activité.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {kpiCards.map((item) => (
            <div key={item.label} className="surface-card p-5 text-center">
              <p className="font-heading text-3xl font-extrabold text-haitechBlue">{item.value}</p>
              <p className="mt-1 text-sm text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="surface-card mt-6 p-5">
          <button
            type="button"
            className="btn-secondary px-4 py-2 text-sm"
            onClick={() => setOpenBenefits((prev) => !prev)}
            aria-expanded={openBenefits}
          >
            {openBenefits ? "Masquer les bénéfices détaillés" : "Afficher les bénéfices détaillés"}
          </button>
          {openBenefits ? (
            <ul className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              {benefitCards.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section id="diagnostic-rapide" className="bg-slate-50 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Estimateur rapide de besoin IT (60 secondes)</h2>
          <p className="mt-2 text-sm text-slate-600">Renseignez votre contexte pour obtenir une recommandation immédiate.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="surface-card p-5">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Nombre de postes
                  <input
                    type="number"
                    min={1}
                    value={estimatorPosts}
                    onChange={(e) => setEstimatorPosts(Math.max(1, Number(e.target.value) || 1))}
                    className="form-input mt-1"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Type d’activité
                  <input value={estimatorType} onChange={(e) => setEstimatorType(e.target.value)} className="form-input mt-1" />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Urgence
                  <select
                    value={estimatorUrgency}
                    onChange={(e) => setEstimatorUrgency(e.target.value as "normale" | "haute" | "critique")}
                    className="form-input mt-1"
                  >
                    <option value="normale">Normale</option>
                    <option value="haute">Haute</option>
                    <option value="critique">Critique</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="surface-card p-5">
              <p className="text-sm text-slate-600">Recommandation</p>
              <p className="mt-1 font-heading text-2xl font-bold text-haitechBlue">{recommendation}</p>
              <p className="mt-2 text-sm text-slate-600">Estimation mensuelle: {formatPriceFcfa(monthlyEstimate)}</p>
              <p className="mt-2 text-xs text-slate-500">Base calcul: {estimatorPosts} postes · {estimatorType} · {formatPriceFcfa(basePerPoste)} / poste</p>
              <div className="mt-4">
                <a href={whatsappItLink} target="_blank" rel="noreferrer" className="btn-primary inline-block bg-haitechGold text-haitechBlue hover:bg-haitechGold/90">
                  Demander un devis
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Qualification avancée</h2>
          <p className="mt-2 text-sm text-slate-600">Choisissez votre besoin pour être orienté vers le bon tunnel.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setQualification("incident")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${qualification === "incident" ? "bg-haitechBlue text-white" : "bg-slate-100 text-slate-700"}`}
            >
              J&apos;ai une panne
            </button>
            <button
              type="button"
              onClick={() => setQualification("project")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${qualification === "project" ? "bg-haitechBlue text-white" : "bg-slate-100 text-slate-700"}`}
            >
              Je veux un projet
            </button>
            <button
              type="button"
              onClick={() => setQualification("outsourcing")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${qualification === "outsourcing" ? "bg-haitechBlue text-white" : "bg-slate-100 text-slate-700"}`}
            >
              Je veux externaliser IT
            </button>
          </div>
          <div className="surface-card mt-4 p-5">
            <p className="text-sm text-slate-700">{qualifyingMessage}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={whatsappItLink} target="_blank" rel="noreferrer" className="btn-primary bg-haitechGold text-haitechBlue hover:bg-haitechGold/90">
                Démarrer maintenant
              </a>
              <a href={calendarLink} target="_blank" rel="noreferrer" className="btn-secondary">
                Prendre un rendez-vous diagnostic
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Confiance & cas client</h2>
          <p className="mt-2 text-sm text-slate-600">Des secteurs accompagnés et un cas réel avant/après pour valider l’impact.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["PME services", "Retail", "Cabinets professionnels", "Education"].map((sector) => (
              <div key={sector} className="surface-card p-4 text-center text-sm font-semibold text-slate-700">
                {sector}
              </div>
            ))}
          </div>
          <div className="surface-card mt-6 p-6">
            <h3 className="font-heading text-xl font-bold text-haitechBlue">Mini cas client - avant / après</h3>
            <p className="mt-3 text-sm text-slate-700">
              <span className="font-semibold">Avant:</span> interruptions fréquentes, support non structuré, délai de traitement long.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-semibold">Après 60 jours:</span> incidents critiques en baisse de 35%, temps de réponse réduit et visibilité claire du parc.
            </p>
          </div>
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
                quote: "Accompagnement structuré, avec une vraie logique de performance.",
                author: "Direction opérationnelle"
              }
            ].map((t) => (
              <blockquote key={t.author} className="surface-card p-6">
                <p className="text-lg">⭐⭐⭐⭐⭐</p>
                <p className="mt-3 text-slate-700">{t.quote}</p>
                <footer className="mt-4 text-sm font-semibold text-haitechBlue">– {t.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 py-14 md:py-16">
        <div className="rounded-2xl bg-haitechBlue p-8 text-white">
          <h2 className="font-heading text-3xl font-bold">Parlez à un expert maintenant</h2>
          <p className="mt-2 text-sm text-slate-100">Un seul CTA principal pour lancer votre plan d&apos;action IT.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={whatsappItLink}
              target="_blank"
              rel="noreferrer"
              className="btn-primary bg-haitechGold text-haitechBlue hover:bg-haitechGold/90"
            >
              Demander un devis
            </a>
            <a href={calendarLink} target="_blank" rel="noreferrer" className="text-sm font-semibold text-white underline underline-offset-4">
              Réserver un créneau diagnostic
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
