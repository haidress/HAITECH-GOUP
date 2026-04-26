"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Row = { id: number; name: string; category: string };

export function AdminBoutiqueReferenceStockManager() {
  const [products, setProducts] = useState<Row[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/boutique/reference-stock");
    const json = await res.json();
    setLoading(false);
    if (!res.ok || !json.success) {
      setFeedback(json.message ?? "Chargement impossible.");
      return;
    }
    const rows = (json.data?.products ?? []) as Row[];
    const stock = (json.data?.stock ?? {}) as Record<string, number>;
    setProducts(rows);
    const q: Record<number, number> = {};
    for (const p of rows) {
      const v = stock[String(p.id)];
      if (v !== undefined) q[p.id] = v;
    }
    setQuantities(q);
    setFeedback("");
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        String(p.id).includes(q)
    );
  }, [products, query]);

  async function save() {
    setSaving(true);
    setFeedback("");
    const items = products
      .filter((p) => quantities[p.id] !== undefined)
      .map((p) => ({ product_id: p.id, quantity: quantities[p.id]! }));
    if (items.length === 0) {
      setSaving(false);
      setFeedback("Indiquez au moins une quantité (ou modifiez une ligne déjà suivie).");
      return;
    }
    const res = await fetch("/api/admin/boutique/reference-stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok || !json.success) {
      setFeedback(json.message ?? "Sauvegarde impossible.");
      return;
    }
    setFeedback(json.message ?? "Stock enregistré.");
    await load();
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-heading text-xl font-bold text-haitechBlue">Stock catalogue vitrine (/boutique-it)</h2>
      <p className="mt-1 text-sm text-slate-600">
        Quantités pour les références listées sur la page publique (IDs du fichier catalogue). Laisser 0 = rupture
        affichée ; une ligne n&apos;apparaît sur le site qu&apos;après enregistrement (valeur en base).
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Astuce : ne saisissez que les articles suivis ; les autres restent « disponibilité sur demande » côté site tant
        qu&apos;aucune ligne n&apos;existe en base pour cet ID.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          className="w-full rounded border px-3 py-2 text-sm sm:max-w-md"
          placeholder="Filtrer par nom, catégorie ou ID…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          disabled={saving || loading}
          onClick={() => void save()}
          className="rounded-full bg-haitechBlue px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Enregistrer tout le tableau"}
        </button>
      </div>

      {feedback ? <p className="mt-3 text-sm text-slate-700">{feedback}</p> : null}

      {loading ? (
        <p className="mt-4 text-sm text-slate-500">Chargement…</p>
      ) : (
        <div className="mt-4 max-h-[480px] overflow-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 text-left">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Produit</th>
                <th className="px-3 py-2">Rayon</th>
                <th className="px-3 py-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-mono text-xs text-slate-600">{p.id}</td>
                  <td className="px-3 py-2 font-medium text-haitechBlue">{p.name}</td>
                  <td className="px-3 py-2 text-slate-600">{p.category}</td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      className="w-24 rounded border px-2 py-1"
                      value={quantities[p.id] === undefined ? "" : quantities[p.id]}
                      placeholder="—"
                      onChange={(e) => {
                        const v = e.target.value;
                        setQuantities((prev) => {
                          const next = { ...prev };
                          if (v === "") delete next[p.id];
                          else next[p.id] = Math.max(0, Math.floor(Number(v)) || 0);
                          return next;
                        });
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
