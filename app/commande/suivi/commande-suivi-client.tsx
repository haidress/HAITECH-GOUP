"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

type TrackResult = {
  referenceCode: string;
  sourceType: string;
  productName: string;
  amount: number;
  status: string;
  createdAt: string;
  lastStatusAt: string | null;
  history: Array<{ note: string; action_type: string; created_at: string }>;
};

export function CommandeSuiviClient() {
  const params = useSearchParams();
  const [referenceCode, setReferenceCode] = useState(params.get("reference") ?? "");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function trackOrder() {
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceCode, email })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setResult(null);
        setMessage(data.message ?? "Impossible de retrouver cette commande.");
        return;
      }
      setResult(data.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="font-heading text-3xl font-bold text-haitechBlue">Suivi de commande</h1>
        <p className="mt-2 text-sm text-slate-600">
          Saisissez votre référence client et votre email pour voir l&apos;avancement.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className="rounded border p-3"
            placeholder="Référence (ex: CMD-...)"
            value={referenceCode}
            onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
          />
          <input
            className="rounded border p-3"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          onClick={trackOrder}
          disabled={loading || !referenceCode || !email}
          className="mt-4 rounded-full bg-haitechBlue px-6 py-3 text-sm font-semibold text-white disabled:opacity-70"
        >
          {loading ? "Recherche..." : "Suivre ma commande"}
        </button>
        {message ? <p className="mt-3 text-sm text-red-600">{message}</p> : null}

        {result ? (
          <div className="mt-6 space-y-4 rounded-xl bg-slate-50 p-5">
            <p className="text-sm">
              Référence: <span className="font-semibold text-haitechBlue">{result.referenceCode}</span>
            </p>
            <p className="text-sm">Produit: {result.productName}</p>
            <p className="text-sm">Montant: {result.amount.toLocaleString("fr-FR")} FCFA</p>
            <p className="text-sm">
              Statut actuel: <span className="font-semibold text-haitechBlue">{result.status}</span>
            </p>
            <p className="text-xs text-slate-500">
              Dernière mise à jour:{" "}
              {result.lastStatusAt ? new Date(result.lastStatusAt).toLocaleString("fr-FR") : new Date(result.createdAt).toLocaleString("fr-FR")}
            </p>
            <div>
              <p className="text-sm font-semibold text-haitechBlue">Historique</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                {result.history.length ? (
                  result.history.map((item, idx) => (
                    <li key={idx} className="rounded border border-slate-200 bg-white p-3">
                      <p>{item.note}</p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(item.created_at).toLocaleString("fr-FR")}</p>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-600">Aucune note pour le moment.</li>
                )}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
