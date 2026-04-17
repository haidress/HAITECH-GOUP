import { PageHero } from "@/components/PageHero";
import { whatsappLink } from "@/components/site-data";
import { ContactLeadForm } from "@/components/ContactLeadForm";

export default function ContactPage() {
  return (
    <div>
      <PageHero
        title="Contact & Demande de devis"
        description="Décrivez votre besoin et recevez une proposition adaptée à votre objectif."
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-2">
        <ContactLeadForm />

        <div className="rounded-2xl bg-slate-50 p-6">
          <h3 className="font-heading text-xl font-bold text-haitechBlue">Coordonnées</h3>
          <p className="mt-2">Email : haitechgroupe@gmail.com</p>
          <p>Téléphone : 07 89 17 46 19</p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block rounded-full bg-haitechGold px-5 py-3 font-semibold text-haitechBlue"
          >
            Démarrer une conversation WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
