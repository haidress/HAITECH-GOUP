import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { OnboardingQuickForm } from "@/components/OnboardingQuickForm";

export default function BienvenuePage({
  searchParams
}: {
  searchParams: { role?: string };
}) {
  const role = searchParams.role === "etudiant" ? "etudiant" : "client";
  const isStudent = role === "etudiant";

  return (
    <div>
      <PageHero title="Bienvenue chez HAITECH GROUP" description="Votre compte est validé, vous pouvez commencer." />
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-haitechBlue">
            {isStudent ? "Parcours apprenant" : "Parcours client"}
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-haitechBlue">
            {isStudent ? "Votre espace formation est prêt" : "Votre espace business est prêt"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isStudent
              ? "Accédez à vos formations, suivez vos modules et démarrez votre montée en compétence."
              : "Accédez aux offres Business Center et lancez vos demandes en quelques clics."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={isStudent ? "/academy" : "/business-center"}
              className="rounded-full bg-haitechBlue px-5 py-2.5 text-sm font-semibold text-white"
            >
              {isStudent ? "Aller à mes formations" : "Aller au Business Center"}
            </Link>
            <Link href="/mon-profil" className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-haitechBlue">
              Compléter mon profil
            </Link>
          </div>
        </div>
        <OnboardingQuickForm role={role} />
      </section>
    </div>
  );
}
