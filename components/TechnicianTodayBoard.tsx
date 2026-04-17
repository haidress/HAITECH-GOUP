"use client";

import { useEffect, useState } from "react";

type Intervention = {
  id: number;
  titre: string;
  statut: "planifiee" | "en_cours" | "terminee" | "reportee";
  scheduled_at: string;
  eta_at: string | null;
  checkin_at: string | null;
  checkout_at: string | null;
  labor_minutes: number;
  labor_cost: number;
};

export function TechnicianTodayBoard() {
  const [items, setItems] = useState<Intervention[]>([]);
  const [message, setMessage] = useState("");

  async function loadData() {
    const response = await fetch("/api/technicien/interventions");
    const data = await response.json();
    setItems(data.data ?? []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function update(id: number, payload: Record<string, unknown>, successMessage: string) {
    const response = await fetch(`/api/technicien/interventions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Mise à jour impossible.");
      return;
    }
    setMessage(successMessage);
    await loadData();
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="font-heading text-lg font-bold text-haitechBlue">Actions rapides technicien</h3>
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-200 p-3 text-sm">
            <p className="font-semibold text-haitechBlue">#{item.id} - {item.titre}</p>
            <p>Statut: {item.statut} | Prévu: {new Date(item.scheduled_at).toLocaleString("fr-FR")}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={() => update(item.id, { statut: "en_cours", checkinAt: new Date().toISOString() }, "Intervention démarrée.")} className="rounded border px-2 py-1 text-xs font-semibold">
                Démarrer + check-in
              </button>
              <button
                onClick={() =>
                  update(item.id, { statut: "terminee", checkoutAt: new Date().toISOString(), laborMinutes: 90, laborCost: 25000 }, "Intervention clôturée.")
                }
                className="rounded border px-2 py-1 text-xs font-semibold"
              >
                Terminer + check-out
              </button>
            </div>
          </article>
        ))}
        {!items.length ? <p className="text-sm text-slate-600">Aucune intervention assignée.</p> : null}
      </div>
      {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
    </section>
  );
}
