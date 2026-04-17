"use client";

import { useCallback, useEffect, useState } from "react";
import type { HomePublicContent } from "@/lib/repositories/home-content-repository";

function empty(): HomePublicContent {
  return {
    announcementTitle: "",
    announcementBody: "",
    announcementCtaLabel: "",
    announcementCtaHref: "",
    announcementVisible: false,
    heroCtaPrimaryLabel: "Demander un devis",
    heroCtaPrimaryLabelB: "Obtenir une proposition",
    homeExperimentVariant: "A",
    lastSiteUpdateLabel: ""
  };
}

export function AdminHomeContentManager() {
  const [form, setForm] = useState<HomePublicContent>(empty());
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/home-content");
      const data = await res.json();
      if (!res.ok || !data.success || !data.data) {
        setMessage(data.message ?? "Chargement impossible.");
        return;
      }
      const h = data.data as HomePublicContent;
      setForm({
        ...h,
        announcementTitle: h.announcementTitle ?? "",
        announcementBody: h.announcementBody ?? "",
        announcementCtaLabel: h.announcementCtaLabel ?? "",
        announcementCtaHref: h.announcementCtaHref ?? "",
        lastSiteUpdateLabel: h.lastSiteUpdateLabel ?? ""
      });
    } catch {
      setMessage("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const payload: HomePublicContent = {
        ...form,
        announcementTitle: form.announcementTitle?.trim() || null,
        announcementBody: form.announcementBody?.trim() || null,
        announcementCtaLabel: form.announcementCtaLabel?.trim() || null,
        announcementCtaHref: form.announcementCtaHref?.trim() || null,
        lastSiteUpdateLabel: form.lastSiteUpdateLabel?.trim() || null
      };
      const res = await fetch("/api/admin/home-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage(data.message ?? "Sauvegarde impossible.");
        return;
      }
      setMessage("Contenu accueil enregistré. Pensez à renseigner « Dernière mise à jour » pour le carrousel de preuve.");
      await load();
    } catch {
      setMessage("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  }

  function stampNow() {
    const label = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    setForm((f) => ({ ...f, lastSiteUpdateLabel: label }));
  }

  if (loading) return <p className="text-sm text-slate-600">Chargement…</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="rounded-full bg-haitechBlue px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Publier sur l’accueil"}
        </button>
        <button type="button" onClick={() => void load()} className="rounded-full border px-4 py-2 text-sm font-semibold text-haitechBlue">
          Recharger
        </button>
        <button type="button" onClick={stampNow} className="rounded-full border border-dashed px-4 py-2 text-sm text-slate-600">
          Mettre la date du jour (texte affiché)
        </button>
        <a href="/" target="_blank" rel="noreferrer" className="text-sm font-semibold text-haitechBlue underline">
          Voir l’accueil
        </a>
      </div>
      {message ? <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">{message}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-heading text-lg font-bold text-haitechBlue">Bandeau « Actu » (hero vivant)</h2>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.announcementVisible}
            onChange={(e) => setForm((f) => ({ ...f, announcementVisible: e.target.checked }))}
          />
          Afficher le bandeau
        </label>
        <input
          className="mt-3 w-full rounded border p-2 text-sm"
          placeholder="Titre (ex. Prochaine session Academy — 24 avril)"
          value={form.announcementTitle ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, announcementTitle: e.target.value }))}
        />
        <textarea
          className="mt-2 w-full rounded border p-2 text-sm"
          rows={3}
          placeholder="Texte court (promo, lien vers événement…)"
          value={form.announcementBody ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, announcementBody: e.target.value }))}
        />
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <input
            className="rounded border p-2 text-sm"
            placeholder="Libellé bouton (ex. S’inscrire)"
            value={form.announcementCtaLabel ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, announcementCtaLabel: e.target.value }))}
          />
          <input
            className="rounded border p-2 text-sm"
            placeholder="Lien (https://… ou /academy)"
            value={form.announcementCtaHref ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, announcementCtaHref: e.target.value }))}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-heading text-lg font-bold text-haitechBlue">Expérimentation (libellé CTA principal)</h2>
        <p className="mt-1 text-xs text-slate-500">
          Variante A ou B : change le texte du premier bouton du hero (« Demander un devis »). Pour des A/B statistiques,
          branchez ensuite Google Analytics ou un outil dédié.
        </p>
        <div className="mt-3 flex flex-wrap gap-4">
          <label className="text-sm">
            Variante active
            <select
              className="mt-1 block rounded border p-2"
              value={form.homeExperimentVariant}
              onChange={(e) =>
                setForm((f) => ({ ...f, homeExperimentVariant: e.target.value === "B" ? "B" : "A" }))
              }
            >
              <option value="A">A — libellé principal</option>
              <option value="B">B — libellé alternatif</option>
            </select>
          </label>
        </div>
        <input
          className="mt-3 w-full max-w-md rounded border p-2 text-sm"
          value={form.heroCtaPrimaryLabel}
          onChange={(e) => setForm((f) => ({ ...f, heroCtaPrimaryLabel: e.target.value }))}
        />
        <p className="mt-2 text-xs text-slate-500">Libellé variante B</p>
        <input
          className="mt-1 w-full max-w-md rounded border p-2 text-sm"
          value={form.heroCtaPrimaryLabelB}
          onChange={(e) => setForm((f) => ({ ...f, heroCtaPrimaryLabelB: e.target.value }))}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-heading text-lg font-bold text-haitechBlue">Fraîcheur du site (preuve)</h2>
        <p className="mt-1 text-xs text-slate-500">Affichée près du carrousel « Avis & réalisations ».</p>
        <input
          className="mt-2 w-full max-w-lg rounded border p-2 text-sm"
          placeholder="Ex. 17 avril 2026"
          value={form.lastSiteUpdateLabel ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, lastSiteUpdateLabel: e.target.value }))}
        />
      </section>
    </div>
  );
}
