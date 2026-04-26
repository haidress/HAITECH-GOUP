import type { Metadata } from "next";
import { whatsappLink } from "@/components/site-data";
import { ContactLeadForm } from "@/components/ContactLeadForm";
import { buildPageMetadata } from "@/lib/page-metadata";
import { defaultSiteMetadata } from "@/lib/site-default-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/contact", {
    ...defaultSiteMetadata,
    title: "Contact & demande de devis — HAITECH GROUP",
    description:
      "Contactez HAITECH GROUP pour un devis IT, une formation ou une demande business. Formulaire sécurisé et équipe réactive."
  });
}

export default function ContactPage() {
  return (
    <div>
      <section className="bg-haitechBlue py-14 text-white md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="font-heading text-3xl font-extrabold md:text-5xl">Parlons de votre projet</h1>
          <p className="mt-4 max-w-3xl text-sm text-slate-100 md:text-lg">
            Decrivez votre besoin et recevez une proposition claire, adaptee a votre budget et a vos objectifs.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm font-semibold">+155 000 abonnes geres</div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm font-semibold">+80 000 abonnes developpes</div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm font-semibold">Plusieurs entreprises accompagnees</div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm font-semibold">Reponse rapide sous 24h</div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="btn-primary bg-haitechGold text-haitechBlue hover:bg-haitechGold/90"
            >
              Discuter directement sur WhatsApp
            </a>
            <a href="#formulaire-contact" className="btn-secondary border-white text-white hover:bg-white hover:text-haitechBlue">
              Ou remplir le formulaire ci-dessous
            </a>
          </div>
        </div>
      </section>

      <section id="formulaire-contact" className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-2">
        <ContactLeadForm />

        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-50 p-6">
            <h3 className="font-heading text-xl font-bold text-haitechBlue">Contact direct</h3>
            <p className="mt-2 text-slate-700">Email : haitechgroupe@gmail.com</p>
            <p className="text-slate-700">Telephone : 07 89 17 46 19</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <h3 className="font-heading text-xl font-bold text-emerald-800">Besoin d&apos;une reponse rapide ?</h3>
            <p className="mt-2 text-sm text-emerald-900">
              Discutez directement avec nous sur WhatsApp et obtenez une premiere orientation en quelques minutes.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Demarrer la conversation WhatsApp
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-heading text-xl font-bold text-haitechBlue">Pourquoi nous faire confiance ?</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Experience avec plusieurs entreprises locales</li>
              <li>Resultats concrets sur les reseaux sociaux</li>
              <li>Solutions adaptees au marche ivoirien</li>
              <li>Accompagnement personnalise</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-heading text-2xl font-bold text-haitechBlue">
              Votre projet merite une solution professionnelle
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-700">
              Que ce soit pour un site web, vos reseaux sociaux ou votre image de marque, nous vous accompagnons de A a Z.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#formulaire-contact" className="btn-primary">
              Recevoir une proposition maintenant
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary border-haitechBlue text-haitechBlue"
            >
              Echanger sur WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
