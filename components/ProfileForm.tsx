"use client";

import { useEffect, useState } from "react";

type Profile = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
};

export function ProfileForm() {
  const [profile, setProfile] = useState<Profile>({ nom: "", prenom: "", email: "", telephone: "" });
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProfile({
            nom: data.data.nom ?? "",
            prenom: data.data.prenom ?? "",
            email: data.data.email ?? "",
            telephone: data.data.telephone ?? ""
          });
        }
      });
  }, []);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: profile.nom,
        prenom: profile.prenom,
        telephone: profile.telephone
      })
    });
    const data = await response.json();
    setFeedback(data.message ?? (response.ok ? "Profil mis à jour." : "Erreur."));
  }

  return (
    <form onSubmit={save} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <h1 className="font-heading text-2xl font-bold text-haitechBlue">Mon profil</h1>
      <input className="w-full rounded-lg border p-3" value={profile.nom} onChange={(e) => setProfile((p) => ({ ...p, nom: e.target.value }))} placeholder="Nom" />
      <input
        className="w-full rounded-lg border p-3"
        value={profile.prenom}
        onChange={(e) => setProfile((p) => ({ ...p, prenom: e.target.value }))}
        placeholder="Prénom"
      />
      <input className="w-full rounded-lg border bg-slate-50 p-3" value={profile.email} readOnly />
      <input
        className="w-full rounded-lg border p-3"
        value={profile.telephone}
        onChange={(e) => setProfile((p) => ({ ...p, telephone: e.target.value }))}
        placeholder="Téléphone"
      />
      <button type="submit" className="rounded-full bg-haitechBlue px-6 py-3 font-semibold text-white">
        Enregistrer
      </button>
      {feedback ? <p className="text-sm text-slate-700">{feedback}</p> : null}
    </form>
  );
}
