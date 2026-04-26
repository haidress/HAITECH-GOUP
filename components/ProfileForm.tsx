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
  const [rightsMsg, setRightsMsg] = useState("");

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

      <div className="mt-8 border-t border-slate-200 pt-6">
        <h2 className="font-heading text-lg font-bold text-haitechBlue">Données personnelles</h2>
        <p className="mt-1 text-xs text-slate-600">
          Export JSON de votre compte, commandes liées à votre e-mail et fiche client. Anonymisation : le compte est
          désactivé et les données directes effacées (les comptes admin passent par un autre processus).
        </p>
        {rightsMsg ? <p className="mt-2 text-sm text-slate-700">{rightsMsg}</p> : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-haitechBlue px-4 py-2 text-sm font-semibold text-haitechBlue"
            onClick={async () => {
              setRightsMsg("");
              const res = await fetch("/api/profile/data-export");
              const data = await res.json();
              if (!res.ok || !data.success) {
                setRightsMsg(data.message ?? "Export impossible.");
                return;
              }
              const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `haitech-export-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
              setRightsMsg("Fichier téléchargé.");
            }}
          >
            Télécharger mes données (JSON)
          </button>
          <button
            type="button"
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800"
            onClick={async () => {
              setRightsMsg("");
              const ok = window.confirm(
                "Anonymiser définitivement ce compte ? Vous serez déconnecté et ne pourrez plus vous reconnecter avec cet e-mail."
              );
              if (!ok) return;
              const res = await fetch("/api/profile/data-deletion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ confirmation: "SUPPRIMER_MES_DONNEES" })
              });
              const data = await res.json();
              if (!res.ok || !data.success) {
                setRightsMsg(data.message ?? "Action impossible.");
                return;
              }
              setRightsMsg(data.message ?? "Compte anonymisé.");
              window.location.href = "/";
            }}
          >
            Anonymiser mon compte
          </button>
        </div>
      </div>
    </form>
  );
}
