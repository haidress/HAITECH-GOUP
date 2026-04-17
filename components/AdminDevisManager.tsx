"use client";

import { useEffect, useMemo, useState } from "react";

type Service = { id: number; nom: string; prix_base: number; categorie: string };
type Lead = { id: number; nom: string; email: string };
type Devis = {
  id: number;
  lead_id: number | null;
  lead_nom: string | null;
  montant_ht: number;
  remise_percent: number;
  tva_percent: number;
  montant_total: number;
  statut: string;
  created_at: string;
};

type ItemForm = { serviceId: number; quantite: number; prixUnitaire: number };

export function AdminDevisManager({ initialLeads }: { initialLeads: Lead[] }) {
  const [services, setServices] = useState<Service[]>([]);
  const [devis, setDevis] = useState<Devis[]>([]);
  const [leadId, setLeadId] = useState<number | "">("");
  const [items, setItems] = useState<ItemForm[]>([]);
  const [remisePercent, setRemisePercent] = useState<number>(0);
  const [tvaPercent, setTvaPercent] = useState<number>(18);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => setServices(d.data ?? []));
    fetch("/api/devis")
      .then((r) => r.json())
      .then((d) => setDevis(d.data ?? []));
  }, []);

  const servicesMap = useMemo(() => new Map(services.map((s) => [s.id, s])), [services]);

  function addItem() {
    if (!services.length) return;
    const first = services[0];
    setItems((prev) => [...prev, { serviceId: first.id, quantite: 1, prixUnitaire: Number(first.prix_base) }]);
  }

  async function submitDevis() {
    setMessage("");
    if (!items.length) {
      setMessage("Ajoutez au moins une ligne.");
      return;
    }

    const response = await fetch("/api/devis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: leadId === "" ? undefined : Number(leadId),
        remisePercent,
        tvaPercent,
        items
      })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Erreur lors de la création du devis.");
      return;
    }
    setMessage(`Devis #${data.devisId} créé avec succès.`);
    setItems([]);

    const refreshed = await fetch("/api/devis").then((r) => r.json());
    setDevis(refreshed.data ?? []);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 p-5">
        <h2 className="font-heading text-xl font-bold text-haitechBlue">Nouveau devis</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <select
            className="rounded border p-3"
            value={leadId}
            onChange={(e) => setLeadId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="">Lead (optionnel)</option>
            {initialLeads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.nom} - {lead.email}
              </option>
            ))}
          </select>
          <button onClick={addItem} className="rounded bg-haitechBlue px-4 py-2 font-semibold text-white">
            Ajouter une ligne
          </button>
          <input
            type="number"
            min={0}
            max={100}
            className="rounded border p-3"
            value={remisePercent}
            onChange={(e) => setRemisePercent(Number(e.target.value))}
            placeholder="Remise %"
          />
          <input
            type="number"
            min={0}
            max={100}
            className="rounded border p-3"
            value={tvaPercent}
            onChange={(e) => setTvaPercent(Number(e.target.value))}
            placeholder="TVA %"
          />
        </div>

        <div className="mt-4 space-y-3">
          {items.map((item, index) => (
            <div key={index} className="grid gap-2 rounded border p-3 md:grid-cols-4">
              <select
                className="rounded border p-2"
                value={item.serviceId}
                onChange={(e) => {
                  const nextServiceId = Number(e.target.value);
                  const nextPrice = Number(servicesMap.get(nextServiceId)?.prix_base ?? 0);
                  setItems((prev) =>
                    prev.map((line, i) =>
                      i === index ? { ...line, serviceId: nextServiceId, prixUnitaire: nextPrice } : line
                    )
                  );
                }}
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.nom}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                className="rounded border p-2"
                value={item.quantite}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((line, i) => (i === index ? { ...line, quantite: Number(e.target.value) } : line))
                  )
                }
              />
              <input
                type="number"
                min={0}
                className="rounded border p-2"
                value={item.prixUnitaire}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((line, i) => (i === index ? { ...line, prixUnitaire: Number(e.target.value) } : line))
                  )
                }
              />
              <button
                onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                className="rounded border px-3 py-2"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>

        <button onClick={submitDevis} className="mt-5 rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue">
          Générer le devis
        </button>
        {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h2 className="font-heading text-xl font-bold text-haitechBlue">Historique des devis</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Lead</th>
                <th className="px-3 py-2">Montant</th>
                <th className="px-3 py-2">TVA/Remise</th>
                <th className="px-3 py-2">Statut</th>
                <th className="px-3 py-2">PDF</th>
              </tr>
            </thead>
            <tbody>
              {devis.map((row) => (
                <tr key={row.id} className="border-b">
                  <td className="px-3 py-2">{row.id}</td>
                  <td className="px-3 py-2">{row.lead_nom ?? "-"}</td>
                  <td className="px-3 py-2">{Number(row.montant_total).toFixed(2)} FCFA</td>
                  <td className="px-3 py-2">{row.tva_percent}% / {row.remise_percent}%</td>
                  <td className="px-3 py-2">{row.statut}</td>
                  <td className="px-3 py-2">
                    <a className="text-haitechBlue underline" href={`/api/devis/${row.id}/pdf`} target="_blank" rel="noreferrer">
                      Ouvrir PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
