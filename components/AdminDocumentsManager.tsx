"use client";

import { useEffect, useState } from "react";

type Client = { id: number; entreprise: string | null; nom: string; prenom: string | null };
type DocumentItem = {
  id: number;
  client_id: number;
  title: string;
  doc_type: "bon_intervention" | "rapport_pdf" | "pv_recette" | "devis" | "facture" | "autre";
  file_url: string;
  visible_to_client: number;
  entreprise: string | null;
  nom: string;
  prenom: string | null;
};

export function AdminDocumentsManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    clientId: "",
    title: "",
    docType: "rapport_pdf" as DocumentItem["doc_type"],
    fileUrl: "",
    visibleToClient: true
  });

  async function loadData() {
    const response = await fetch("/api/admin/documents");
    const data = await response.json();
    setClients(data.data?.clients ?? []);
    setDocuments(data.data?.documents ?? []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createDocument() {
    const response = await fetch("/api/admin/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: Number(form.clientId),
        title: form.title,
        docType: form.docType,
        fileUrl: form.fileUrl,
        visibleToClient: form.visibleToClient
      })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Création document impossible.");
      return;
    }
    setMessage("Document ajouté.");
    setForm((prev) => ({ ...prev, title: "", fileUrl: "" }));
    await loadData();
  }

  async function toggleVisibility(doc: DocumentItem) {
    const response = await fetch(`/api/admin/documents/${doc.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibleToClient: !Boolean(doc.visible_to_client) })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Mise à jour impossible.");
      return;
    }
    await loadData();
  }

  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <h2 className="font-heading text-xl font-bold text-haitechBlue">Documents clients</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-5">
        <select value={form.clientId} onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value }))} className="rounded border p-2">
          <option value="">Sélectionner client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.entreprise || `${client.nom} ${client.prenom ?? ""}`.trim()}
            </option>
          ))}
        </select>
        <input className="rounded border p-2" placeholder="Titre document" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
        <select value={form.docType} onChange={(e) => setForm((prev) => ({ ...prev, docType: e.target.value as DocumentItem["doc_type"] }))} className="rounded border p-2">
          <option value="bon_intervention">Bon intervention</option>
          <option value="rapport_pdf">Rapport PDF</option>
          <option value="pv_recette">PV recette</option>
          <option value="devis">Devis</option>
          <option value="facture">Facture</option>
          <option value="autre">Autre</option>
        </select>
        <input className="rounded border p-2" placeholder="https://..." value={form.fileUrl} onChange={(e) => setForm((prev) => ({ ...prev, fileUrl: e.target.value }))} />
        <button onClick={createDocument} className="rounded-full bg-haitechBlue px-4 py-2 font-semibold text-white">
          Ajouter
        </button>
      </div>
      <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.visibleToClient}
          onChange={(e) => setForm((prev) => ({ ...prev, visibleToClient: e.target.checked }))}
        />
        Visible client
      </label>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Document</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Lien</th>
              <th className="px-3 py-2">Visibilité</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b">
                <td className="px-3 py-2">{doc.entreprise || `${doc.nom} ${doc.prenom ?? ""}`.trim()}</td>
                <td className="px-3 py-2">{doc.title}</td>
                <td className="px-3 py-2">{doc.doc_type}</td>
                <td className="px-3 py-2">
                  <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-haitechBlue underline">
                    Ouvrir
                  </a>
                </td>
                <td className="px-3 py-2">
                  <button onClick={() => toggleVisibility(doc)} className="rounded border px-2 py-1 text-xs font-semibold">
                    {doc.visible_to_client ? "Visible" : "Masqué"}
                  </button>
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
