import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { academyModalites, academyParcours } from "@/lib/offers-catalog";

export default function ElearningPage() {
  return (
    <div>
      <PageHero
        title="Plateforme de formation (E-learning)"
        description="Cours vidéo, supports PDF, quiz, progression et certificats — prolongement naturel du catalogue HAITECH Academy."
      />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 p-6">
            <h3 className="font-heading text-lg font-bold text-haitechBlue">Catalogue</h3>
            <p className="mt-2 text-slate-600">
              Parcours structurés par niveau et par métier — voir les offres détaillées sur Academy.
            </p>
            <Link href="/academy#formations-list" className="mt-4 inline-block text-sm font-semibold text-haitechBlue underline">
              Ouvrir le catalogue Academy
            </Link>
          </article>
          <article className="rounded-2xl border border-slate-200 p-6">
            <h3 className="font-heading text-lg font-bold text-haitechBlue">Suivi</h3>
            <p className="mt-2 text-slate-600">Progression individuelle, quiz et rapports pour les managers (sur devis).</p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-6">
            <h3 className="font-heading text-lg font-bold text-haitechBlue">Certification</h3>
            <p className="mt-2 text-slate-600">Attestations de fin de parcours et modules certifiants identifiés sur le catalogue.</p>
          </article>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue">Parcours disponibles aussi en blended</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {academyParcours.map((p) => (
              <div key={p.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-heading text-lg font-bold text-haitechBlue">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{p.duration}</p>
                <ul className="mt-3 space-y-1 text-sm text-slate-600">
                  {p.modules.map((m) => (
                    <li key={m}>• {m}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue">Modalités pédagogiques</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {academyModalites.map((m) => (
            <div key={m.title} className="rounded-xl border border-slate-200 p-5">
              <p className="font-heading font-bold text-haitechBlue">{m.title}</p>
              <p className="mt-2 text-sm text-slate-600">{m.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl bg-haitechBlue p-6 text-white">
          <p className="font-heading text-xl font-bold">Passer par Academy pour commander</p>
          <p className="mt-2 text-sm text-slate-100">Inscription, paiement et accès sont coordonnés depuis la page Academy.</p>
          <Link href="/academy" className="mt-4 inline-block rounded-full bg-haitechGold px-5 py-2.5 text-sm font-semibold text-haitechBlue">
            Aller à HAITECH Academy
          </Link>
        </div>
      </section>
    </div>
  );
}
