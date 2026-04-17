"use client";

import { useCallback, useEffect, useState } from "react";

type Incident = {
  id: number;
  title: string;
  priority: "basse" | "moyenne" | "haute" | "critique";
  status: "ouvert" | "en_cours" | "en_attente_client" | "resolu" | "ferme";
  escalation_level: number;
  updated_at: string;
  entreprise: string | null;
  client_email: string;
  asset_name: string | null;
  remote_possible: number;
  remote_session_link: string | null;
  onsite_required: number;
  onsite_scheduled_at: string | null;
  resolution_mode: "pending" | "remote" | "onsite" | "hybrid";
  eta_at: string | null;
  assigned_technician_user_id: number | null;
  technician_name: string | null;
};

type Technician = {
  id: number;
  nom: string;
  prenom: string | null;
};

export function AdminIncidentManager() {
  const [items, setItems] = useState<Incident[]>([]);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [remoteLinkDraft, setRemoteLinkDraft] = useState<Record<number, string>>({});
  const [onsiteDateDraft, setOnsiteDateDraft] = useState<Record<number, string>>({});

  const loadData = useCallback(async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (priorityFilter) params.set("priority", priorityFilter);
    const response = await fetch(`/api/admin/incidents${params.toString() ? `?${params.toString()}` : ""}`);
    const data = await response.json();
    setItems(data.data ?? []);
    const techniciansResponse = await fetch("/api/admin/techniciens");
    const techniciansData = await techniciansResponse.json();
    setTechnicians(techniciansData.data ?? []);
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function patchIncident(id: number, payload: Record<string, unknown>) {
    const response = await fetch(`/api/admin/incidents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Mise à jour impossible.");
      return;
    }
    setMessage("Incident mis à jour.");
    await loadData();
  }

  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <h2 className="font-heading text-xl font-bold text-haitechBlue">Incidents & escalades</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded border p-2 text-sm">
          <option value="">Tous statuts</option>
          <option value="ouvert">Ouvert</option>
          <option value="en_cours">En cours</option>
          <option value="en_attente_client">En attente client</option>
          <option value="resolu">Résolu</option>
          <option value="ferme">Fermé</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="rounded border p-2 text-sm">
          <option value="">Toutes priorités</option>
          <option value="basse">Basse</option>
          <option value="moyenne">Moyenne</option>
          <option value="haute">Haute</option>
          <option value="critique">Critique</option>
        </select>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-[1450px] text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Sujet</th>
              <th className="px-3 py-2">Priorité</th>
              <th className="px-3 py-2">Mode résolution</th>
              <th className="px-3 py-2">Escalade</th>
              <th className="px-3 py-2">Statut</th>
              <th className="px-3 py-2">Technicien / ETA</th>
              <th className="px-3 py-2">Remote / Déplacement</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-3 py-2">{item.entreprise || item.client_email}</td>
                <td className="px-3 py-2">
                  #{item.id} {item.title}
                  <p className="text-xs text-slate-500">{item.asset_name ?? "Machine non renseignée"}</p>
                </td>
                <td className="px-3 py-2">{item.priority}</td>
                <td className="px-3 py-2">{item.resolution_mode}</td>
                <td className="px-3 py-2">{item.escalation_level}</td>
                <td className="px-3 py-2">{item.status}</td>
                <td className="px-3 py-2">
                  <div className="space-y-2">
                    <select
                      value={item.assigned_technician_user_id ?? ""}
                      onChange={(e) =>
                        patchIncident(item.id, { assignedTechnicianUserId: e.target.value ? Number(e.target.value) : null })
                      }
                      className="rounded border p-1 text-xs"
                    >
                      <option value="">Non assigné</option>
                      {technicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {`${tech.nom} ${tech.prenom ?? ""}`.trim()}
                        </option>
                      ))}
                    </select>
                    <input
                      type="datetime-local"
                      className="rounded border p-1 text-xs"
                      defaultValue={item.eta_at ? new Date(item.eta_at).toISOString().slice(0, 16) : ""}
                      onBlur={(e) => {
                        if (!e.target.value) return;
                        patchIncident(item.id, { etaAt: e.target.value });
                      }}
                    />
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => patchIncident(item.id, { resolutionMode: "remote", onsiteRequired: false })}
                        className="rounded border px-2 py-1 text-xs font-semibold"
                      >
                        Mode remote
                      </button>
                      <button
                        onClick={() => patchIncident(item.id, { resolutionMode: "onsite", onsiteRequired: true })}
                        className="rounded border px-2 py-1 text-xs font-semibold"
                      >
                        Mode déplacement
                      </button>
                    </div>
                    <input
                      className="w-52 rounded border p-1 text-xs"
                      placeholder="Lien AnyDesk/TeamViewer"
                      value={remoteLinkDraft[item.id] ?? item.remote_session_link ?? ""}
                      onChange={(e) => setRemoteLinkDraft((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    />
                    <button
                      onClick={() => patchIncident(item.id, { remoteSessionLink: remoteLinkDraft[item.id] ?? item.remote_session_link ?? "", remoteTool: "anydesk" })}
                      className="rounded border px-2 py-1 text-xs font-semibold"
                    >
                      Enregistrer lien remote
                    </button>
                    <input
                      type="datetime-local"
                      className="w-52 rounded border p-1 text-xs"
                      value={onsiteDateDraft[item.id] ?? (item.onsite_scheduled_at ? new Date(item.onsite_scheduled_at).toISOString().slice(0, 16) : "")}
                      onChange={(e) => setOnsiteDateDraft((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    />
                    <button
                      onClick={() =>
                        patchIncident(item.id, {
                          onsiteRequired: true,
                          onsiteScheduledAt: onsiteDateDraft[item.id] ?? undefined,
                          resolutionMode: "onsite"
                        })
                      }
                      className="rounded border px-2 py-1 text-xs font-semibold"
                    >
                      Planifier déplacement
                    </button>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button onClick={() => patchIncident(item.id, { escalate: true })} className="rounded border px-2 py-1 text-xs font-semibold">
                      Escalader
                    </button>
                    <button onClick={() => patchIncident(item.id, { status: "en_cours" })} className="rounded border px-2 py-1 text-xs font-semibold">
                      En cours
                    </button>
                    <button onClick={() => patchIncident(item.id, { status: "resolu" })} className="rounded border px-2 py-1 text-xs font-semibold">
                      Résolu
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
    </section>
  );
}
