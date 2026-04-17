"use client";

import { useCallback, useEffect, useState } from "react";
import type { ItManagedTier, ItServiceLine, ItServicePack } from "@/lib/offers-catalog";
import type { PublicItCatalog } from "@/lib/repositories/it-catalog-repository";

function emptyCatalog(): PublicItCatalog {
  return {
    serviceLines: [{ icon: "🌐", title: "", desc: "", cta: "" }],
    managedTiers: [
      { name: "", audience: "", fromPricePerPosteFcfa: 0, highlights: [""], sla: "" }
    ],
    packs: [{ title: "", badge: "", subtitle: "", audience: "", items: [""], fromPriceFcfa: 0 }],
    addons: [""]
  };
}

export function AdminItCatalogManager() {
  const [catalog, setCatalog] = useState<PublicItCatalog | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/it-catalog");
      const data = await res.json();
      if (!res.ok || !data.success || !data.data) {
        setMessage(data.message ?? "Chargement impossible.");
        setCatalog(emptyCatalog());
        return;
      }
      setCatalog(data.data as PublicItCatalog);
    } catch {
      setMessage("Erreur réseau.");
      setCatalog(emptyCatalog());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!catalog) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/it-catalog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catalog)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage(data.message ?? "Sauvegarde impossible.");
        return;
      }
      setMessage("Catalogue enregistré. La page Services informatique affichera ces contenus pour tous les visiteurs.");
      await load();
    } catch {
      setMessage("Erreur réseau à la sauvegarde.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !catalog) {
    return <p className="text-sm text-slate-600">Chargement du catalogue…</p>;
  }

  function updateLine(i: number, patch: Partial<ItServiceLine>) {
    setCatalog((prev) =>
      prev
        ? {
            ...prev,
            serviceLines: prev.serviceLines.map((row, j) => (j === i ? { ...row, ...patch } : row))
          }
        : prev
    );
  }

  function addLine() {
    setCatalog((prev) =>
      prev
        ? {
            ...prev,
            serviceLines: [...prev.serviceLines, { icon: "✨", title: "Nouveau service", desc: "", cta: "Contact" }]
          }
        : prev
    );
  }

  function removeLine(i: number) {
    setCatalog((prev) =>
      prev && prev.serviceLines.length > 1
        ? { ...prev, serviceLines: prev.serviceLines.filter((_, j) => j !== i) }
        : prev
    );
  }

  function updateTier(i: number, patch: Partial<ItManagedTier>) {
    setCatalog((prev) =>
      prev
        ? {
            ...prev,
            managedTiers: prev.managedTiers.map((row, j) => (j === i ? { ...row, ...patch } : row))
          }
        : prev
    );
  }

  function setTierHighlights(i: number, text: string) {
    const highlights = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    updateTier(i, { highlights: highlights.length ? highlights : [""] });
  }

  function addTier() {
    setCatalog((prev) =>
      prev
        ? {
            ...prev,
            managedTiers: [
              ...prev.managedTiers,
              { name: "Nouveau palier", audience: "", fromPricePerPosteFcfa: 0, highlights: [""], sla: "" }
            ]
          }
        : prev
    );
  }

  function removeTier(i: number) {
    setCatalog((prev) =>
      prev && prev.managedTiers.length > 1
        ? { ...prev, managedTiers: prev.managedTiers.filter((_, j) => j !== i) }
        : prev
    );
  }

  function updatePack(i: number, patch: Partial<ItServicePack>) {
    setCatalog((prev) =>
      prev
        ? {
            ...prev,
            packs: prev.packs.map((row, j) => (j === i ? { ...row, ...patch } : row))
          }
        : prev
    );
  }

  function setPackItems(i: number, text: string) {
    const items = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    updatePack(i, { items: items.length ? items : [""] });
  }

  function addPack() {
    setCatalog((prev) =>
      prev
        ? {
            ...prev,
            packs: [
              ...prev.packs,
              {
                title: "Nouveau pack",
                badge: "",
                subtitle: "Service",
                audience: "",
                items: ["Point 1"],
                fromPriceFcfa: 0
              }
            ]
          }
        : prev
    );
  }

  function removePack(i: number) {
    setCatalog((prev) =>
      prev && prev.packs.length > 1 ? { ...prev, packs: prev.packs.filter((_, j) => j !== i) } : prev
    );
  }

  function setAddonsText(text: string) {
    const addons = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    setCatalog((prev) => (prev ? { ...prev, addons: addons.length ? addons : [""] } : prev));
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="rounded-full bg-haitechBlue px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Publier sur le site (sauvegarder)"}
        </button>
        <button type="button" onClick={() => void load()} className="rounded-full border px-4 py-2 text-sm font-semibold text-haitechBlue">
          Recharger depuis la base
        </button>
        <a href="/technology" target="_blank" rel="noreferrer" className="text-sm font-semibold text-haitechBlue underline">
          Voir la page publique
        </a>
      </div>
      {message ? <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">{message}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-xl font-bold text-haitechBlue">Lignes « Nos Services IT »</h2>
          <button type="button" onClick={addLine} className="rounded-full border px-3 py-1 text-xs font-semibold text-haitechBlue">
            + Ajouter
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">Ordre = ordre d&apos;affichage sur /technology (du haut vers le bas).</p>
        <div className="mt-4 space-y-4">
          {catalog.serviceLines.map((line, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="grid gap-3 md:grid-cols-4">
                <label className="text-xs font-semibold text-slate-600">
                  Icône (emoji)
                  <input
                    className="mt-1 w-full rounded border p-2 text-sm"
                    value={line.icon}
                    onChange={(e) => updateLine(i, { icon: e.target.value })}
                  />
                </label>
                <label className="text-xs font-semibold text-slate-600 md:col-span-2">
                  Titre
                  <input
                    className="mt-1 w-full rounded border p-2 text-sm"
                    value={line.title}
                    onChange={(e) => updateLine(i, { title: e.target.value })}
                  />
                </label>
                <div className="flex items-end">
                  <button type="button" onClick={() => removeLine(i)} className="text-xs font-semibold text-red-600">
                    Supprimer
                  </button>
                </div>
              </div>
              <label className="mt-2 block text-xs font-semibold text-slate-600">
                Description
                <textarea
                  className="mt-1 w-full rounded border p-2 text-sm"
                  rows={2}
                  value={line.desc}
                  onChange={(e) => updateLine(i, { desc: e.target.value })}
                />
              </label>
              <label className="mt-2 block text-xs font-semibold text-slate-600">
                Texte du bouton (CTA)
                <input
                  className="mt-1 w-full rounded border p-2 text-sm"
                  value={line.cta}
                  onChange={(e) => updateLine(i, { cta: e.target.value })}
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-xl font-bold text-haitechBlue">Paliers infogérance</h2>
          <button type="button" onClick={addTier} className="rounded-full border px-3 py-1 text-xs font-semibold text-haitechBlue">
            + Ajouter
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {catalog.managedTiers.map((tier, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <label className="text-xs font-semibold text-slate-600">
                  Nom
                  <input
                    className="mt-1 w-full rounded border p-2 text-sm"
                    value={tier.name}
                    onChange={(e) => updateTier(i, { name: e.target.value })}
                  />
                </label>
                <label className="text-xs font-semibold text-slate-600">
                  Cible
                  <input
                    className="mt-1 w-full rounded border p-2 text-sm"
                    value={tier.audience}
                    onChange={(e) => updateTier(i, { audience: e.target.value })}
                  />
                </label>
                <label className="text-xs font-semibold text-slate-600">
                  Prix / poste / mois (FCFA)
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded border p-2 text-sm"
                    value={tier.fromPricePerPosteFcfa}
                    onChange={(e) => updateTier(i, { fromPricePerPosteFcfa: Number(e.target.value) || 0 })}
                  />
                </label>
              </div>
              <label className="mt-2 block text-xs font-semibold text-slate-600">
                SLA (texte)
                <input
                  className="mt-1 w-full rounded border p-2 text-sm"
                  value={tier.sla}
                  onChange={(e) => updateTier(i, { sla: e.target.value })}
                />
              </label>
              <label className="mt-2 block text-xs font-semibold text-slate-600">
                Points forts (1 ligne = 1 puce)
                <textarea
                  className="mt-1 w-full rounded border p-2 font-mono text-xs"
                  rows={4}
                  value={tier.highlights.join("\n")}
                  onChange={(e) => setTierHighlights(i, e.target.value)}
                />
              </label>
              <button type="button" onClick={() => removeTier(i)} className="mt-2 text-xs font-semibold text-red-600">
                Supprimer ce palier
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-xl font-bold text-haitechBlue">Packs & offres</h2>
          <button type="button" onClick={addPack} className="rounded-full border px-3 py-1 text-xs font-semibold text-haitechBlue">
            + Ajouter
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {catalog.packs.map((pack, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-xs font-semibold text-slate-600">
                  Titre du pack
                  <input
                    className="mt-1 w-full rounded border p-2 text-sm"
                    value={pack.title}
                    onChange={(e) => updatePack(i, { title: e.target.value })}
                  />
                </label>
                <label className="text-xs font-semibold text-slate-600">
                  Badge (optionnel)
                  <input
                    className="mt-1 w-full rounded border p-2 text-sm"
                    value={pack.badge}
                    onChange={(e) => updatePack(i, { badge: e.target.value })}
                  />
                </label>
              </div>
              <div className="mt-2 grid gap-3 md:grid-cols-2">
                <label className="text-xs font-semibold text-slate-600">
                  Sous-titre (catégorie)
                  <input
                    className="mt-1 w-full rounded border p-2 text-sm"
                    value={pack.subtitle}
                    onChange={(e) => updatePack(i, { subtitle: e.target.value })}
                  />
                </label>
                <label className="text-xs font-semibold text-slate-600">
                  Cible client
                  <input
                    className="mt-1 w-full rounded border p-2 text-sm"
                    value={pack.audience}
                    onChange={(e) => updatePack(i, { audience: e.target.value })}
                  />
                </label>
              </div>
              <label className="mt-2 block text-xs font-semibold text-slate-600">
                Prix à partir de (FCFA, 0 si sur devis uniquement)
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded border p-2 text-sm"
                  value={pack.fromPriceFcfa ?? 0}
                  onChange={(e) => updatePack(i, { fromPriceFcfa: Number(e.target.value) || 0 })}
                />
              </label>
              <label className="mt-2 block text-xs font-semibold text-slate-600">
                Inclus (1 ligne = 1 puce)
                <textarea
                  className="mt-1 w-full rounded border p-2 font-mono text-xs"
                  rows={5}
                  value={pack.items.join("\n")}
                  onChange={(e) => setPackItems(i, e.target.value)}
                />
              </label>
              <button type="button" onClick={() => removePack(i)} className="mt-2 text-xs font-semibold text-red-600">
                Supprimer ce pack
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-heading text-xl font-bold text-haitechBlue">Options complémentaires</h2>
        <p className="mt-1 text-xs text-slate-500">Une ligne = une option affichée sous les packs.</p>
        <textarea
          className="mt-3 w-full rounded border p-3 font-mono text-sm"
          rows={8}
          value={catalog.addons.join("\n")}
          onChange={(e) => setAddonsText(e.target.value)}
        />
      </section>
    </div>
  );
}
