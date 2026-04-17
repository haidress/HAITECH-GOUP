import { PageHero } from "@/components/PageHero";

export default function BlogPage() {
  return (
    <div>
      <PageHero
        title="Blog HAITECH"
        description="Conseils IT, business et formation pour améliorer votre visibilité et votre performance."
      />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {["SEO local en Côte d'Ivoire", "Comment qualifier ses leads", "Digitaliser son entreprise"].map(
            (article) => (
              <article key={article} className="rounded-2xl border border-slate-200 p-6">
                <h3 className="font-heading text-lg font-bold text-haitechBlue">{article}</h3>
                <p className="mt-2 text-slate-600">Article optimisé pour le référencement naturel.</p>
              </article>
            )
          )}
        </div>
      </section>
    </div>
  );
}
