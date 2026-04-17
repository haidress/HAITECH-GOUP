"use client";

import { useEffect, useState } from "react";

type Ticket = {
  id: number;
  title: string;
  priority: "basse" | "moyenne" | "haute" | "critique";
  status: "ouvert" | "en_cours" | "en_attente_client" | "resolu" | "ferme";
  escalation_level: number;
  updated_at: string;
  asset_name: string | null;
  remote_possible: number;
  remote_session_link: string | null;
  onsite_required: number;
  onsite_scheduled_at: string | null;
  resolution_mode: "pending" | "remote" | "onsite" | "hybrid";
};

export function ClientSupportCenter() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Ticket["priority"]>("moyenne");
  const [assetName, setAssetName] = useState("");
  const [osVersion, setOsVersion] = useState("");
  const [remotePossible, setRemotePossible] = useState(true);
  const [onsiteAddress, setOnsiteAddress] = useState("");

  async function loadTickets() {
    const response = await fetch("/api/client/incidents");
    const data = await response.json();
    setTickets(data.data?.items ?? []);
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function submitTicket() {
    const response = await fetch("/api/client/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, priority, assetName, osVersion, remotePossible, onsiteAddress })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Création incident impossible.");
      return;
    }
    setMessage("Incident créé. L'équipe support vous répondra rapidement.");
    setTitle("");
    setDescription("");
    setPriority("moyenne");
    setAssetName("");
    setOsVersion("");
    setRemotePossible(true);
    setOnsiteAddress("");
    await loadTickets();
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-heading text-xl font-bold text-haitechBlue">Centre de support</h3>
      <p className="mt-1 text-sm text-slate-600">Signalez un incident et suivez son traitement.</p>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <input className="rounded border p-2" placeholder="Titre incident" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select className="rounded border p-2" value={priority} onChange={(e) => setPriority(e.target.value as Ticket["priority"])}>
          <option value="basse">Basse</option>
          <option value="moyenne">Moyenne</option>
          <option value="haute">Haute</option>
          <option value="critique">Critique</option>
        </select>
        <button onClick={submitTicket} className="rounded-full bg-haitechBlue px-4 py-2 font-semibold text-white">
          Signaler un incident
        </button>
        <input className="rounded border p-2" placeholder="Machine (ex: PC Compta 01)" value={assetName} onChange={(e) => setAssetName(e.target.value)} />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <input className="rounded border p-2" placeholder="OS / version (ex: Windows 11)" value={osVersion} onChange={(e) => setOsVersion(e.target.value)} />
        <label className="inline-flex items-center gap-2 rounded border p-2 text-sm">
          <input type="checkbox" checked={remotePossible} onChange={(e) => setRemotePossible(e.target.checked)} />
          Intervention à distance possible
        </label>
        {!remotePossible ? (
          <input
            className="rounded border p-2"
            placeholder="Adresse de déplacement"
            value={onsiteAddress}
            onChange={(e) => setOnsiteAddress(e.target.value)}
          />
        ) : (
          <div />
        )}
      </div>
      <textarea
        className="mt-3 w-full rounded border p-2 text-sm"
        placeholder="Décrivez le problème..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="mt-5 space-y-2">
        {tickets.map((ticket) => (
          <article key={ticket.id} className="rounded-xl border border-slate-200 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-haitechBlue">
                #{ticket.id} - {ticket.title}
              </p>
              <span className="text-xs text-slate-600">
                {ticket.status} | {ticket.priority} | mode {ticket.resolution_mode} | escalade {ticket.escalation_level}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              {ticket.asset_name ? `Machine: ${ticket.asset_name}` : "Machine non renseignée"} |{" "}
              {ticket.remote_possible ? "Diagnostic à distance possible" : "Déplacement requis"}
            </p>
            {ticket.remote_session_link ? (
              <a href={ticket.remote_session_link} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-semibold text-haitechBlue underline">
                Ouvrir session distante
              </a>
            ) : null}
            {ticket.onsite_required && ticket.onsite_scheduled_at ? (
              <p className="mt-1 text-xs text-amber-700">
                Déplacement planifié: {new Date(ticket.onsite_scheduled_at).toLocaleString("fr-FR")}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-slate-500">Maj: {new Date(ticket.updated_at).toLocaleString("fr-FR")}</p>
          </article>
        ))}
      </div>
      {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
    </section>
  );
}
