import { PageHero } from "@/components/PageHero";

export default function AboutPage() {
  return (
    <div>
      <PageHero
        title="À propos de HAITECH GROUP"
        description="Nous construisons des solutions utiles pour les particuliers, entrepreneurs, PME et institutions."
      />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <p className="max-w-3xl text-slate-700">
          Basé à Abidjan, HAITECH GROUP combine expertise technologique, vision business et culture de
          l&apos;excellence pour accompagner durablement ses clients vers la performance.
        </p>
      </section>
    </div>
  );
}
