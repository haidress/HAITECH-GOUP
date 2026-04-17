import { PageHero } from "@/components/PageHero";

export default function RealisationsPage() {
  return (
    <div>
      <PageHero
        title="Réalisations"
        description="Découvrez quelques résultats concrets obtenus pour nos clients et partenaires."
      />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <article key={item} className="rounded-2xl border border-slate-200 p-6">
              <h3 className="font-heading text-lg font-bold text-haitechBlue">Projet #{item}</h3>
              <p className="mt-2 text-slate-600">
                Refonte digitale, amélioration de la visibilité et génération de leads qualifiés.
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
