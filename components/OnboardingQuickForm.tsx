"use client";

import { useState } from "react";

export function OnboardingQuickForm({ role }: { role: "client" | "etudiant" }) {
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [message, setMessage] = useState("");

  async function save() {
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roleTarget: role,
        primaryGoal,
        companySize: role === "client" ? companySize : undefined
      })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Sauvegarde impossible.");
      return;
    }
    setMessage("Onboarding enregistré.");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-heading text-lg font-bold text-haitechBlue">Onboarding rapide</h3>
      <p className="mt-1 text-sm text-slate-600">Aide-nous à personnaliser ton espace.</p>
      <div className="mt-4 grid gap-3">
        <input
          className="rounded border p-2"
          placeholder={role === "client" ? "Objectif business principal" : "Objectif de formation principal"}
          value={primaryGoal}
          onChange={(e) => setPrimaryGoal(e.target.value)}
        />
        {role === "client" ? (
          <input className="rounded border p-2" placeholder="Taille entreprise (ex: 1-10, 11-50...)" value={companySize} onChange={(e) => setCompanySize(e.target.value)} />
        ) : null}
        <button onClick={save} className="rounded-full bg-haitechBlue px-4 py-2 font-semibold text-white">
          Enregistrer
        </button>
      </div>
      {message ? <p className="mt-2 text-sm text-slate-700">{message}</p> : null}
    </div>
  );
}
