"use client";

import { useState } from "react";

export function NpsFeedbackWidget() {
  const [score, setScore] = useState(8);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  async function submitFeedback() {
    const response = await fetch("/api/client/nps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, comment })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Envoi impossible.");
      return;
    }
    setMessage("Merci pour votre retour.");
    setComment("");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-heading text-xl font-bold text-haitechBlue">Satisfaction (NPS)</h3>
      <p className="mt-1 text-sm text-slate-600">Sur une échelle de 0 à 10, recommanderiez-vous HAITECH GROUP ?</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input type="range" min={0} max={10} value={score} onChange={(e) => setScore(Number(e.target.value))} />
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-haitechBlue">{score}/10</span>
      </div>
      <textarea
        className="mt-3 w-full rounded border p-2 text-sm"
        placeholder="Commentaire (optionnel)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={submitFeedback} className="mt-3 rounded-full bg-haitechBlue px-4 py-2 font-semibold text-white">
        Envoyer mon avis
      </button>
      {message ? <p className="mt-2 text-sm text-slate-700">{message}</p> : null}
    </section>
  );
}
