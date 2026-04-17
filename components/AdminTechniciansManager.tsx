"use client";

import { useEffect, useState } from "react";

type Technician = {
  id: number;
  nom: string;
  prenom: string | null;
  email: string;
  telephone: string | null;
  niveau: "N1" | "N2" | "terrain" | null;
  specialites: string | null;
  disponibilite: "disponible" | "occupe" | "off" | null;
};

export function AdminTechniciansManager() {
  const [items, setItems] = useState<Technician[]>([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    niveau: "terrain" as "N1" | "N2" | "terrain",
    specialites: ""
  });

  async function loadData() {
    const response = await fetch("/api/admin/techniciens");
    const data = await response.json();
    setItems(data.data ?? []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createTechnician() {
    const response = await fetch("/api/admin/techniciens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Création impossible.");
      return;
    }
    setMessage("Technicien ajouté.");
    setForm((prev) => ({ ...prev, nom: "", prenom: "", email: "", telephone: "", password: "", specialites: "" }));
    await loadData();
  }

  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <h2 className="font-heading text-xl font-bold text-haitechBlue">Techniciens (N1 / N2 / terrain)</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <input className="rounded border p-2" placeholder="Nom" value={form.nom} onChange={(e) => setForm((prev) => ({ ...prev, nom: e.target.value }))} />
        <input className="rounded border p-2" placeholder="Prénom" value={form.prenom} onChange={(e) => setForm((prev) => ({ ...prev, prenom: e.target.value }))} />
        <input className="rounded border p-2" placeholder="Email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
        <input className="rounded border p-2" placeholder="Téléphone" value={form.telephone} onChange={(e) => setForm((prev) => ({ ...prev, telephone: e.target.value }))} />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <input
          type="password"
          className="rounded border p-2"
          placeholder="Mot de passe provisoire"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
        />
        <select className="rounded border p-2" value={form.niveau} onChange={(e) => setForm((prev) => ({ ...prev, niveau: e.target.value as "N1" | "N2" | "terrain" }))}>
          <option value="N1">N1</option>
          <option value="N2">N2</option>
          <option value="terrain">Terrain</option>
        </select>
        <input
          className="rounded border p-2"
          placeholder="Spécialités (réseau, hardware...)"
          value={form.specialites}
          onChange={(e) => setForm((prev) => ({ ...prev, specialites: e.target.value }))}
        />
        <button onClick={createTechnician} className="rounded-full bg-haitechBlue px-4 py-2 font-semibold text-white">
          Ajouter technicien
        </button>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="px-3 py-2">Nom</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Niveau</th>
              <th className="px-3 py-2">Spécialités</th>
              <th className="px-3 py-2">Disponibilité</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-3 py-2">{`${item.nom} ${item.prenom ?? ""}`.trim()}</td>
                <td className="px-3 py-2">{item.email}</td>
                <td className="px-3 py-2">{item.niveau ?? "-"}</td>
                <td className="px-3 py-2">{item.specialites ?? "-"}</td>
                <td className="px-3 py-2">{item.disponibilite ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
    </section>
  );
}
