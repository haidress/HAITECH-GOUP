import Link from "next/link";

export function HomeAudienceSegment() {
  return (
    <section className="border-y border-slate-200 bg-slate-50/80">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        <p className="text-center text-sm font-semibold text-slate-600">Par où commencer ?</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Link
            href="/#parcours-entreprise"
            className="group rounded-2xl border border-haitechBlue/20 bg-white p-6 text-center shadow-sm transition hover:border-haitechBlue hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-haitechBlue"
          >
            <span className="text-3xl">🏢</span>
            <h2 className="mt-2 font-heading text-lg font-bold text-haitechBlue">Je suis une entreprise</h2>
            <p className="mt-2 text-sm text-slate-600">
              Infogérance, cybersécurité, formations équipes et digitalisation de votre activité.
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-haitechBlue group-hover:underline">Voir le parcours pro →</span>
          </Link>
          <Link
            href="/#parcours-particulier"
            className="group rounded-2xl border border-haitechGold/40 bg-white p-6 text-center shadow-sm transition hover:border-haitechGold hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-haitechGold"
          >
            <span className="text-3xl">👤</span>
            <h2 className="mt-2 font-heading text-lg font-bold text-haitechBlue">Je suis un particulier</h2>
            <p className="mt-2 text-sm text-slate-600">
              Formation, boutique IT, support ponctuel et projets personnels (site, matériel, conseil).
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-haitechBlue group-hover:underline">Voir le parcours perso →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
