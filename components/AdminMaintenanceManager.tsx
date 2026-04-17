"use client";

import { useEffect, useState } from "react";

type EnterpriseClient = {
  id: number;
  entreprise: string | null;
  type_client: "entreprise";
  nom: string;
  prenom: string | null;
  email: string;
};

type Intervention = {
  id: number;
  client_id: number;
  titre: string;
  details: string | null;
  intervention_type: "preventive" | "corrective" | "installation" | "audit";
  statut: "planifiee" | "en_cours" | "terminee" | "reportee";
  scheduled_at: string;
  entreprise: string | null;
  nom: string;
  prenom: string | null;
  assigned_technician_user_id?: number | null;
  technician_name?: string | null;
  eta_at?: string | null;
  checkin_at?: string | null;
  checkout_at?: string | null;
  labor_minutes?: number;
  labor_cost?: number;
};

type Technician = {
  id: number;
  nom: string;
  prenom: string | null;
  niveau: "N1" | "N2" | "terrain";
  disponibilite: "disponible" | "occupe" | "off";
};

export function AdminMaintenanceManager() {
  const [clients, setClients] = useState<EnterpriseClient[]>([]);
  const [items, setItems] = useState<Intervention[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [message, setMessage] = useState("");
  const [calendarView, setCalendarView] = useState<"week" | "month">("week");
  const [form, setForm] = useState({
    clientId: "",
    titre: "",
    details: "",
    interventionType: "preventive" as Intervention["intervention_type"],
    statut: "planifiee" as Intervention["statut"],
    scheduledAt: ""
  });

  async function loadData() {
    try {
      const response = await fetch("/api/admin/maintenance");
      let data: Record<string, unknown> = {};
      try {
        data = (await response.json()) as Record<string, unknown>;
      } catch {
        data = {};
      }
      if (!response.ok) {
        setMessage(
          typeof data.message === "string" && data.message
            ? data.message
            : `Chargement impossible (${response.status}).`
        );
        setClients([]);
        setItems([]);
        setTechnicians([]);
        return;
      }
      setClients((data.clients as EnterpriseClient[]) ?? []);
      setItems((data.data as Intervention[]) ?? []);
      setTechnicians((data.technicians as Technician[]) ?? []);
    } catch (e) {
      console.error(e);
      setMessage("Réseau ou serveur indisponible. Réessayez dans un instant.");
      setClients([]);
      setItems([]);
      setTechnicians([]);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createIntervention() {
    if (!form.clientId || !form.titre || !form.scheduledAt) {
      setMessage("Client, titre et date sont requis.");
      return;
    }
    const response = await fetch("/api/admin/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: Number(form.clientId),
        titre: form.titre,
        details: form.details || undefined,
        interventionType: form.interventionType,
        statut: form.statut,
        scheduledAt: form.scheduledAt
      })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Création impossible.");
      return;
    }
    setMessage("Intervention programmée.");
    setForm((prev) => ({ ...prev, titre: "", details: "", scheduledAt: "" }));
    await loadData();
  }

  async function updateStatut(id: number, statut: Intervention["statut"]) {
    const response = await fetch(`/api/admin/maintenance/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Mise à jour impossible.");
      return;
    }
    setMessage("Statut intervention mis à jour.");
    await loadData();
  }

  async function updateIntervention(id: number, payload: Record<string, unknown>, successMessage: string) {
    const response = await fetch(`/api/admin/maintenance/${id}`, {
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

  async function moveInterventionToDate(id: number, targetIsoDate: string) {
    const targetDate = `${targetIsoDate}T09:00`;
    await updateIntervention(id, { scheduledAt: targetDate }, "Intervention déplacée dans le planning.");
  }

  function getVisibleDates() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const totalDays = calendarView === "week" ? 7 : 30;
    return Array.from({ length: totalDays }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  }

  async function generateFromPlans() {
    const response = await fetch("/api/admin/maintenance/generate", { method: "POST" });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Génération automatique impossible.");
      return;
    }
    setMessage(`${data.data?.created ?? 0} intervention(s) générée(s) depuis les contrats.`);
    await loadData();
  }

  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <h2 className="font-heading text-xl font-bold text-haitechBlue">Planification entreprises (maintenance & services)</h2>
      <div className="mt-3 flex gap-2">
        <button onClick={() => setCalendarView("week")} className="rounded-full border px-3 py-1 text-sm font-semibold text-haitechBlue">
          Vue semaine
        </button>
        <button onClick={() => setCalendarView("month")} className="rounded-full border px-3 py-1 text-sm font-semibold text-haitechBlue">
          Vue mois
        </button>
      </div>
      <div className="mt-3">
        <button onClick={generateFromPlans} className="rounded-full border px-4 py-2 text-sm font-semibold text-haitechBlue">
          Générer depuis plans récurrents
        </button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <select value={form.clientId} onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value }))} className="rounded border p-2">
          <option value="">Sélectionner une entreprise</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.entreprise || `${client.nom} ${client.prenom ?? ""}`.trim()}
            </option>
          ))}
        </select>
        <input
          className="rounded border p-2"
          placeholder="Titre intervention"
          value={form.titre}
          onChange={(e) => setForm((prev) => ({ ...prev, titre: e.target.value }))}
        />
        <input
          type="datetime-local"
          className="rounded border p-2"
          value={form.scheduledAt}
          onChange={(e) => setForm((prev) => ({ ...prev, scheduledAt: e.target.value }))}
        />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <select
          value={form.interventionType}
          onChange={(e) => setForm((prev) => ({ ...prev, interventionType: e.target.value as Intervention["intervention_type"] }))}
          className="rounded border p-2"
        >
          <option value="preventive">Maintenance préventive</option>
          <option value="corrective">Maintenance corrective</option>
          <option value="installation">Installation</option>
          <option value="audit">Audit</option>
        </select>
        <select
          value={form.statut}
          onChange={(e) => setForm((prev) => ({ ...prev, statut: e.target.value as Intervention["statut"] }))}
          className="rounded border p-2"
        >
          <option value="planifiee">Planifiée</option>
          <option value="en_cours">En cours</option>
          <option value="terminee">Terminée</option>
          <option value="reportee">Reportée</option>
        </select>
        <button onClick={createIntervention} className="rounded-full bg-haitechBlue px-4 py-2 font-semibold text-white">
          Programmer
        </button>
      </div>
      <textarea
        className="mt-3 w-full rounded border p-2 text-sm"
        placeholder="Détails de service, scope, contraintes, durée..."
        value={form.details}
        onChange={(e) => setForm((prev) => ({ ...prev, details: e.target.value }))}
      />

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="px-3 py-2">Entreprise</th>
              <th className="px-3 py-2">Intervention</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Technicien</th>
              <th className="px-3 py-2">ETA</th>
              <th className="px-3 py-2">Date prévue</th>
              <th className="px-3 py-2">Statut</th>
              <th className="px-3 py-2">Terrain</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-3 py-2">{item.entreprise || `${item.nom} ${item.prenom ?? ""}`.trim()}</td>
                <td className="px-3 py-2">
                  <p className="font-semibold text-haitechBlue">{item.titre}</p>
                  {item.details ? <p className="text-xs text-slate-600">{item.details}</p> : null}
                </td>
                <td className="px-3 py-2">{item.intervention_type}</td>
                <td className="px-3 py-2">
                  <select
                    value={item.assigned_technician_user_id ?? ""}
                    onChange={(e) =>
                      updateIntervention(
                        item.id,
                        { assignedTechnicianUserId: e.target.value ? Number(e.target.value) : null },
                        "Technicien affecté."
                      )
                    }
                    className="rounded border p-2"
                  >
                    <option value="">Non affecté</option>
                    {technicians.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {`${tech.nom} ${tech.prenom ?? ""}`.trim()} ({tech.niveau})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="datetime-local"
                    className="rounded border p-1 text-xs"
                    defaultValue={item.eta_at ? new Date(item.eta_at).toISOString().slice(0, 16) : ""}
                    onBlur={(e) => {
                      if (!e.target.value) return;
                      updateIntervention(item.id, { etaAt: e.target.value }, "ETA client mise à jour.");
                    }}
                  />
                </td>
                <td className="px-3 py-2">{new Date(item.scheduled_at).toLocaleString("fr-FR")}</td>
                <td className="px-3 py-2">
                  <select value={item.statut} onChange={(e) => updateStatut(item.id, e.target.value as Intervention["statut"])} className="rounded border p-2">
                    <option value="planifiee">Planifiée</option>
                    <option value="en_cours">En cours</option>
                    <option value="terminee">Terminée</option>
                    <option value="reportee">Reportée</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <div className="space-y-1">
                    <button
                      onClick={() => updateIntervention(item.id, { checkinAt: new Date().toISOString() }, "Check-in enregistré.")}
                      className="rounded border px-2 py-1 text-xs font-semibold"
                    >
                      Check-in
                    </button>
                    <button
                      onClick={() => updateIntervention(item.id, { checkoutAt: new Date().toISOString() }, "Check-out enregistré.")}
                      className="rounded border px-2 py-1 text-xs font-semibold"
                    >
                      Check-out
                    </button>
                    <button
                      onClick={() =>
                        updateIntervention(
                          item.id,
                          {
                            checklist: {
                              arrivedOk: true,
                              diagnosticOk: true,
                              actionDoneOk: true,
                              clientTestOk: true,
                              clientSignatureName: "Client validé"
                            }
                          },
                          "Checklist terrain validée."
                        )
                      }
                      className="rounded border px-2 py-1 text-xs font-semibold"
                    >
                      Valider checklist
                    </button>
                    <button
                      onClick={() => updateIntervention(item.id, { laborMinutes: 120, laborCost: 35000, interventionSummary: "Intervention terminée avec succès." }, "Temps/coût enregistrés.")}
                      className="rounded border px-2 py-1 text-xs font-semibold"
                    >
                      Enregistrer temps/coût
                    </button>
                    <button
                      onClick={async () => {
                        const response = await fetch(`/api/admin/maintenance/${item.id}/report`, { method: "POST" });
                        const data = await response.json();
                        if (!response.ok || !data.success) {
                          setMessage(data.message ?? "Rapport PDF impossible.");
                          return;
                        }
                        setMessage("Rapport PDF généré et ajouté dans Documents client.");
                      }}
                      className="rounded border px-2 py-1 text-xs font-semibold text-haitechBlue"
                    >
                      Générer rapport PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 p-3">
        <h3 className="font-heading text-lg font-bold text-haitechBlue">Planning calendrier (drag & drop)</h3>
        <div className="mt-3 grid min-w-[1200px] gap-2" style={{ gridTemplateColumns: `repeat(${getVisibleDates().length}, minmax(140px, 1fr))` }}>
          {getVisibleDates().map((date) => {
            const isoDay = date.toISOString().slice(0, 10);
            const dayItems = items.filter((item) => item.scheduled_at.slice(0, 10) === isoDay);
            return (
              <div
                key={isoDay}
                className="min-h-40 rounded-lg border border-slate-200 bg-slate-50 p-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const id = Number(e.dataTransfer.getData("text/plain"));
                  if (Number.isFinite(id) && id > 0) moveInterventionToDate(id, isoDay);
                }}
              >
                <p className="text-xs font-semibold text-haitechBlue">{date.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "2-digit" })}</p>
                <div className="mt-2 space-y-1">
                  {dayItems.map((item) => (
                    <button
                      key={item.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", String(item.id))}
                      className="w-full rounded border border-haitechBlue/20 bg-white p-1 text-left text-xs"
                    >
                      #{item.id} {item.titre}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
    </section>
  );
}
