import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { RegisterForm } from "@/components/RegisterForm";

export default function InscriptionPage() {
  return (
    <div>
      <PageHero title="Créer votre compte" description="Inscrivez-vous pour accéder à votre espace Formation ou Client." />
      <section className="mx-auto max-w-xl px-4 py-12">
        <RegisterForm />
        <p className="mt-4 text-sm text-slate-600">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="font-semibold text-haitechBlue underline">
            Connectez-vous
          </Link>
        </p>
      </section>
    </div>
  );
}
