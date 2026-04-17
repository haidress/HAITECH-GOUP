import { LoginForm } from "@/components/LoginForm";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-180px)] bg-slate-100 px-4 py-10">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="grid min-h-[620px] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative">
            <Image src="/slide-transformation.png" alt="Visuel HAITECH GROUP" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-br from-haitechBlue/85 via-haitechBlue/70 to-haitechBlue/55" />
            <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white">
              <div>
                <p className="inline-flex rounded-full border border-white/30 px-3 py-1 text-xs font-semibold tracking-wide">
                  HAITECH GROUP
                </p>
                <h1 className="mt-5 font-heading text-3xl font-extrabold md:text-4xl">Connexion à votre espace</h1>
                <p className="mt-3 max-w-md text-sm text-slate-100">
                  Interface sécurisée pour administrateurs, clients et apprenants. Vos données restent protégées.
                </p>
              </div>
              <div className="space-y-3 rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur">
                <p className="text-sm font-semibold">Accès rapide</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-white/40 px-3 py-1">Dashboard admin</span>
                  <span className="rounded-full border border-white/40 px-3 py-1">Espace client</span>
                  <span className="rounded-full border border-white/40 px-3 py-1">E-learning</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-white p-6 md:p-10">
            <div className="mb-5 flex flex-wrap gap-3">
              <Link href="/inscription" className="rounded-full bg-haitechGold px-5 py-2 text-sm font-semibold text-haitechBlue">
                Créer un compte
              </Link>
              <Link href="/" className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-haitechBlue">
                Retour accueil
              </Link>
            </div>
            <LoginForm />
          </div>
        </div>
      </section>
    </div>
  );
}
