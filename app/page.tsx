import Link from "next/link";
import { ServicesActionSection } from "@/components/ServicesActionSection";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { TrustedLogosMarquee } from "@/components/TrustedLogosMarquee";
import { whatsappLink } from "@/components/site-data";
import { ParallaxGrowthSection } from "@/components/ParallaxGrowthSection";
import { HomeHeroSection } from "@/components/HomeHeroSection";
import { HomeAudienceSegment } from "@/components/HomeAudienceSegment";
import { HomeProofCarousel } from "@/components/HomeProofCarousel";
import { HomeParcoursBlocks } from "@/components/HomeParcoursBlocks";
import { HomeJsonLd } from "@/components/HomeJsonLd";

const poles = [
  {
    icon: "🖥️",
    title: "Services informatique",
    description: "Infogérance, développement, cybersécurité, packs métiers et options à la carte.",
    href: "/technology"
  },
  {
    icon: "🛒",
    title: "Boutique IT",
    description: "Matériel, accessoires, bundles télétravail et équipements pro — commande & SAV.",
    href: "/boutique-it"
  },
  {
    icon: "🎓",
    title: "HAITECH Academy",
    description: "Formations, e-books, parcours longs et modalités inter / intra / e-learning.",
    href: "/academy"
  },
  {
    icon: "🏢",
    title: "Business Center",
    description: "Immobilier, mobilité, conciergerie et distribution — opportunités business.",
    href: "/business-center"
  }
];

export default function Home() {
  return (
    <div>
      <HomeJsonLd />
      <HomeHeroSection />
      <HomeAudienceSegment />
      <HomeParcoursBlocks />
      <HomeProofCarousel />

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-4xl">
          Nos solutions pour accélérer votre croissance 🚀
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
          Quatre pôles complémentaires : services IT, boutique matériel, formations digitales et business center pour
          couvrir vos projets de bout en bout.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {poles.map((p) => (
            <article
              key={p.title}
              className="group rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-haitechBlue/20 md:p-6"
            >
              <div className="inline-flex rounded-xl bg-haitechBlue/10 p-3 text-3xl">{p.icon}</div>
              <h3 className="mt-3 font-heading text-xl font-bold text-haitechBlue">{p.title}</h3>
              <p className="mt-3 min-h-14 text-slate-600">{p.description}</p>
              <Link
                href={p.href}
                className="mt-5 inline-block rounded-full bg-haitechBlue px-4 py-2 text-sm font-semibold text-white transition hover:bg-haitechGold hover:text-haitechBlue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-haitechBlue"
              >
                Découvrir
              </Link>
            </article>
          ))}
        </div>
      </section>

      <ParallaxGrowthSection />

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="font-heading text-3xl font-bold text-haitechBlue">Pourquoi choisir HAITECH GROUP ?</h2>
          <p className="mt-4 max-w-4xl text-slate-700">
            HAITECH GROUP est bien plus qu&apos;un prestataire : nous sommes un partenaire stratégique qui
            accompagne votre croissance grâce à la technologie, au business et à la formation.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-5">
              <h3 className="font-heading text-lg font-bold text-haitechBlue">🚀 Notre mission</h3>
              <p className="mt-2 text-slate-600">
                Fournir des solutions innovantes, accessibles et performantes pour accélérer la croissance des
                particuliers et des entreprises.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-5">
              <h3 className="font-heading text-lg font-bold text-haitechBlue">🌍 Notre vision</h3>
              <p className="mt-2 text-slate-600">
                Devenir un acteur majeur de la transformation digitale et du développement économique en Afrique.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-5">
              <h3 className="font-heading text-lg font-bold text-haitechBlue">⭐ Nos valeurs</h3>
              <p className="mt-2 text-slate-600">Innovation – Qualité – Confiance – Accessibilité – Impact</p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              { label: "projets réalisés", end: 50, prefix: "+" },
              { label: "clients accompagnés", end: 100, prefix: "+" },
              { label: "pôles d'expertise", end: 4 },
              { label: "orienté résultats", end: 100, suffix: "%" }
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-haitechBlue p-5 text-center text-white">
                <p className="font-heading text-3xl font-extrabold text-haitechGold">
                  <AnimatedCounter end={item.end} prefix={item.prefix} suffix={item.suffix} />
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-100">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServicesActionSection />

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="font-heading text-3xl font-bold text-haitechBlue">Pourquoi nous faire confiance ?</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "⚡ Réactivité",
                text: "Nous répondons rapidement et accompagnons nos clients à chaque étape."
              },
              {
                title: "🎯 Solutions sur mesure",
                text: "Chaque projet est adapté à vos besoins réels et à votre budget."
              },
              {
                title: "💼 Expertise multi-domaines",
                text: "Du développement informatique à la formation professionnelle, nous vous aidons à accélérer votre croissance."
              },
              {
                title: "📈 Résultats concrets",
                text: "Notre objectif est simple : vous faire gagner du temps et de l’argent."
              },
              {
                title: "🔐 Fiabilité & sécurité",
                text: "Vos données et vos projets sont entre de bonnes mains."
              },
              {
                title: "🤝 Accompagnement complet",
                text: "De l’idée à la réalisation, nous restons à vos côtés."
              }
            ].map((point) => (
              <div key={point.title} className="rounded-xl bg-slate-50 p-5">
                <h3 className="font-heading text-lg font-bold text-haitechBlue">{point.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{point.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl bg-haitechBlue p-6 text-white">
            <h3 className="font-heading text-2xl font-bold">🚀 Lancez votre projet dès aujourd’hui</h3>
            <p className="mt-2 text-slate-100">
              Discutons ensemble sur WhatsApp et trouvons la solution idéale.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block rounded-full bg-haitechGold px-5 py-2.5 font-semibold text-haitechBlue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-haitechGold"
            >
              🟢 Parler sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:pb-20">
        <div className="rounded-2xl bg-slate-50 p-8">
          <h2 className="font-heading text-3xl font-bold text-haitechBlue">Appel à l&apos;action</h2>
          <p className="mt-3 max-w-2xl text-slate-700">
            🚀 Donnez vie à votre projet dès aujourd&apos;hui. Discutons ensemble et obtenez une solution
            adaptée à vos besoins.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-block rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-haitechGold"
          >
            Parler à un conseiller
          </Link>
        </div>
      </section>

      <TrustedLogosMarquee />
    </div>
  );
}
