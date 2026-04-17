import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export default function AccessDeniedPage() {
  return (
    <div>
      <PageHero
        title="Accès interdit"
        description="Votre rôle ne permet pas d'accéder à cette section."
      />
      <section className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-slate-700">
          Contactez un administrateur si vous pensez qu&apos;il s&apos;agit d&apos;une erreur de permission.
        </p>
        <Link href="/" className="mt-4 inline-block rounded-full bg-haitechBlue px-5 py-3 font-semibold text-white">
          Retour à l&apos;accueil
        </Link>
      </section>
    </div>
  );
}
