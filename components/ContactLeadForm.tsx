"use client";

import { useState } from "react";

type FormState = {
  nom: string;
  email: string;
  telephone: string;
  source: "site" | "whatsapp" | "autre";
  serviceType: "Technology" | "Business Center" | "Academy";
  besoin: string;
  budget: string;
};

const initialState: FormState = {
  nom: "",
  email: "",
  telephone: "",
  source: "site",
  serviceType: "Technology",
  besoin: "",
  budget: ""
};

export function ContactLeadForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const payload = {
        nom: form.nom,
        email: form.email,
        telephone: form.telephone,
        source: form.source,
        besoin: `[${form.serviceType}] ${form.besoin}`,
        budget: form.budget ? Number(form.budget) : undefined
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as { success: boolean; message: string };

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Échec d'envoi.");
      }

      setStatus("success");
      setFeedback(data.message);
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Une erreur est survenue.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 p-6">
      <h2 className="font-heading text-2xl font-bold text-haitechBlue">Formulaire de qualification</h2>
      <input
        className="w-full rounded-lg border p-3"
        placeholder="Nom complet"
        value={form.nom}
        onChange={(e) => setForm((prev) => ({ ...prev, nom: e.target.value }))}
        required
      />
      <input
        className="w-full rounded-lg border p-3"
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        required
      />
      <input
        className="w-full rounded-lg border p-3"
        placeholder="Téléphone (optionnel)"
        value={form.telephone}
        onChange={(e) => setForm((prev) => ({ ...prev, telephone: e.target.value }))}
      />
      <select
        className="w-full rounded-lg border p-3"
        value={form.source}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            source: e.target.value as "site" | "whatsapp" | "autre"
          }))
        }
      >
        <option value="site">Source: Site web</option>
        <option value="whatsapp">Source: WhatsApp</option>
        <option value="autre">Source: Autre</option>
      </select>
      <select
        className="w-full rounded-lg border p-3"
        value={form.serviceType}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            serviceType: e.target.value as "Technology" | "Business Center" | "Academy"
          }))
        }
      >
        <option>Technology</option>
        <option>Business Center</option>
        <option>Academy</option>
      </select>
      <textarea
        className="h-28 w-full rounded-lg border p-3"
        placeholder="Votre besoin"
        value={form.besoin}
        onChange={(e) => setForm((prev) => ({ ...prev, besoin: e.target.value }))}
        required
      />
      <input
        className="w-full rounded-lg border p-3"
        placeholder="Budget estimatif (optionnel)"
        type="number"
        min="0"
        value={form.budget}
        onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-haitechBlue px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        {status === "loading" ? "Envoi en cours..." : "Envoyer la demande"}
      </button>
      {feedback ? (
        <p className={`text-sm ${status === "success" ? "text-emerald-600" : "text-red-600"}`}>{feedback}</p>
      ) : null}
    </form>
  );
}
