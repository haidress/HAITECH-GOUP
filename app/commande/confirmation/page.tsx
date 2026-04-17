"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CommandeConfirmationPage() {
  const params = useSearchParams();
  const order = params.get("order") ?? "-";
  const reference = params.get("reference") ?? "-";
  const email = params.get("email") ?? "";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="font-heading text-3xl font-bold text-haitechBlue">Commande reçue avec succès</h1>
        <p className="mt-2 text-sm text-slate-600">Commande interne: #{order}</p>
        <p className="text-sm text-slate-700">
          Référence client: <span className="font-semibold text-haitechBlue">{reference}</span>
        </p>
        <p className="mt-3 text-sm text-slate-700">
          Votre demande est bien enregistrée. Délai moyen de prise en charge: 30 minutes à 2 heures ouvrées.
        </p>
        <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-haitechBlue">Prochaines étapes</p>
          <p>1) Validation de disponibilité</p>
          <p>2) Contact commercial</p>
          <p>3) Finalisation et livraison/prestation</p>
        </div>
        <div className="mt-6 flex gap-3">
          <Link href="/" className="rounded-full bg-haitechBlue px-5 py-2 text-sm font-semibold text-white">
            Retour accueil
          </Link>
          <Link
            href={`/commande/suivi?reference=${encodeURIComponent(reference)}&email=${encodeURIComponent(email)}`}
            className="rounded-full border px-5 py-2 text-sm font-semibold text-haitechBlue"
          >
            Suivre ma commande
          </Link>
        </div>
      </div>
    </div>
  );
}
