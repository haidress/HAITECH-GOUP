"use client";

import { useEffect, useMemo, useState } from "react";

type BoutiqueProduct = {
  id: number;
  slug: string;
  name: string;
  category: string;
  brand: string | null;
  image_url: string | null;
  product_condition: "neuf" | "reconditionne";
  base_price: number;
  initial_price: number | null;
  promo_price: number | null;
  promo_start_at: string | null;
  promo_end_at: string | null;
  stock: number;
  low_stock_threshold: number;
  is_published: 0 | 1;
};

const initialForm = {
  slug: "",
  name: "",
  category: "Stockage & USB",
  brand: "",
  image_url: "",
  product_condition: "neuf" as "neuf" | "reconditionne",
  base_price: 0,
  initial_price: "" as number | "",
  promo_price: "" as number | "",
  promo_start_at: "",
  promo_end_at: "",
  stock: 0,
  low_stock_threshold: 5,
  is_published: true
};

export function AdminBoutiqueProManager() {
  const [products, setProducts] = useState<BoutiqueProduct[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [productContent, setProductContent] = useState({
    variants: "[]",
    specs: "[]",
    faqs: "[]"
  });
  const [reviews, setReviews] = useState<Array<{ id: number; author_name: string; rating: number; comment: string | null; is_approved: 0 | 1 }>>([]);
  const [kpis, setKpis] = useState<{
    total_products: number;
    published_products: number;
    low_stock_products: number;
    out_of_stock_products: number;
    sales_count: number;
    views_count: number;
  } | null>(null);

  async function load() {
    const [productsRes, kpisRes] = await Promise.all([fetch("/api/admin/boutique/products"), fetch("/api/admin/boutique/kpis")]);
    const [productsJson, kpisJson] = await Promise.all([productsRes.json(), kpisRes.json()]);
    if (!productsRes.ok || !productsJson.success) return setFeedback(productsJson.message ?? "Chargement impossible.");
    setProducts(productsJson.data ?? []);
    if (kpisRes.ok && kpisJson.success) setKpis(kpisJson.data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save() {
    const payload = {
      ...form,
      brand: form.brand || null,
      initial_price: form.initial_price === "" ? null : form.initial_price,
      promo_price: form.promo_price === "" ? null : form.promo_price,
      promo_start_at: form.promo_start_at || null,
      promo_end_at: form.promo_end_at || null
    };
    const isEdit = editingId != null;
    const url = isEdit ? `/api/admin/boutique/products/${editingId}` : "/api/admin/boutique/products";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok || !json.success) return setFeedback(json.message ?? "Sauvegarde impossible.");
    setFeedback(isEdit ? "Produit Boutique IT mis à jour." : "Produit Boutique IT créé.");
    setForm(initialForm);
    setEditingId(null);
    await load();
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/boutique/upload-image", { method: "POST", body: formData });
    const json = await res.json();
    setUploading(false);
    if (!res.ok || !json.success) return setFeedback(json.message ?? "Upload image impossible.");
    setForm((prev) => ({ ...prev, image_url: json.data.url }));
    setFeedback("Image uploadée.");
  }

  async function exportXlsx() {
    window.open("/api/admin/boutique/products/export/xlsx", "_blank");
  }

  async function importXlsx(file: File) {
    setImporting(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/boutique/products/import", { method: "POST", body: formData });
    const json = await res.json();
    setImporting(false);
    if (!res.ok || !json.success) return setFeedback(json.message ?? "Import impossible.");
    setFeedback(json.message ?? "Import terminé.");
    await load();
  }

  async function loadContent(productId: number) {
    const res = await fetch(`/api/admin/boutique/products/${productId}/content`);
    const json = await res.json();
    if (!res.ok || !json.success) return setFeedback(json.message ?? "Chargement contenu impossible.");
    const variants = json.data?.variants ?? [];
    const specs = json.data?.specs ?? [];
    const faqs = json.data?.faqs ?? [];
    setReviews(json.data?.reviews ?? []);
    setProductContent({
      variants: JSON.stringify(
        variants.map((v: { sku: string; name: string; attributes_json: string; price: number; initial_price: number | null; stock: number }) => ({
          sku: v.sku,
          name: v.name,
          attributes_json: v.attributes_json,
          price: Number(v.price),
          initial_price: v.initial_price == null ? null : Number(v.initial_price),
          stock: Number(v.stock)
        })),
        null,
        2
      ),
      specs: JSON.stringify(specs.map((s: { spec_key: string; spec_value: string }) => ({ spec_key: s.spec_key, spec_value: s.spec_value })), null, 2),
      faqs: JSON.stringify(faqs.map((f: { question: string; answer: string }) => ({ question: f.question, answer: f.answer })), null, 2)
    });
  }

  async function saveContent() {
    if (!editingId) return;
    try {
      const payload = {
        variants: JSON.parse(productContent.variants),
        specs: JSON.parse(productContent.specs),
        faqs: JSON.parse(productContent.faqs)
      };
      const res = await fetch(`/api/admin/boutique/products/${editingId}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok || !json.success) return setFeedback(json.message ?? "Sauvegarde contenu impossible.");
      setFeedback("Variantes / specs / FAQs sauvegardées.");
      await loadContent(editingId);
    } catch {
      setFeedback("JSON invalide dans variantes/specs/faqs.");
    }
  }

  async function toggleReview(reviewId: number, approve: boolean) {
    const res = await fetch(`/api/admin/boutique/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_approved: approve })
    });
    const json = await res.json();
    if (!res.ok || !json.success) return setFeedback(json.message ?? "Modération impossible.");
    if (editingId) await loadContent(editingId);
  }

  const lowStockProducts = useMemo(() => products.filter((p) => p.stock <= p.low_stock_threshold), [products]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-heading text-xl font-bold text-haitechBlue">Boutique IT Pro (stock, promo, publication)</h2>
      <p className="mt-1 text-sm text-slate-600">Gestion avancée du catalogue e-commerce depuis l&apos;admin.</p>
      {kpis ? (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <p>Total produits: <strong>{kpis.total_products}</strong></p>
            <p>Publiés: <strong>{kpis.published_products}</strong></p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <p>Stock faible: <strong>{kpis.low_stock_products}</strong></p>
            <p>Rupture: <strong>{kpis.out_of_stock_products}</strong></p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <p>Vues cumulées: <strong>{kpis.views_count}</strong></p>
            <p>Ventes cumulées: <strong>{kpis.sales_count}</strong></p>
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <input className="rounded border p-3" placeholder="Slug SEO" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} />
        <input className="rounded border p-3 md:col-span-2" placeholder="Nom produit" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <input className="rounded border p-3" placeholder="Catégorie" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
        <input className="rounded border p-3" placeholder="Marque" value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} />
        <input className="rounded border p-3" placeholder="URL image" value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} />
        <label className="flex items-center gap-2 rounded border p-3 text-sm">
          <input type="file" accept="image/*" onChange={(e) => (e.target.files?.[0] ? void uploadImage(e.target.files[0]) : undefined)} />
          {uploading ? "Upload..." : "Uploader image"}
        </label>
        <select className="rounded border p-3" value={form.product_condition} onChange={(e) => setForm((p) => ({ ...p, product_condition: e.target.value as "neuf" | "reconditionne" }))}>
          <option value="neuf">Neuf</option>
          <option value="reconditionne">Reconditionné</option>
        </select>
        <input type="number" min={0} className="rounded border p-3" placeholder="Prix base" value={form.base_price} onChange={(e) => setForm((p) => ({ ...p, base_price: Number(e.target.value) }))} />
        <input type="number" min={0} className="rounded border p-3" placeholder="Prix initial" value={form.initial_price} onChange={(e) => setForm((p) => ({ ...p, initial_price: e.target.value === "" ? "" : Number(e.target.value) }))} />
        <input type="number" min={0} className="rounded border p-3" placeholder="Prix promo" value={form.promo_price} onChange={(e) => setForm((p) => ({ ...p, promo_price: e.target.value === "" ? "" : Number(e.target.value) }))} />
        <input type="datetime-local" className="rounded border p-3" value={form.promo_start_at} onChange={(e) => setForm((p) => ({ ...p, promo_start_at: e.target.value }))} />
        <input type="datetime-local" className="rounded border p-3" value={form.promo_end_at} onChange={(e) => setForm((p) => ({ ...p, promo_end_at: e.target.value }))} />
        <input type="number" min={0} className="rounded border p-3" placeholder="Stock" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))} />
        <input type="number" min={0} className="rounded border p-3" placeholder="Seuil alerte" value={form.low_stock_threshold} onChange={(e) => setForm((p) => ({ ...p, low_stock_threshold: Number(e.target.value) }))} />
        <label className="flex items-center gap-2 rounded border p-3">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))} />
          Publié
        </label>
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={save} className="rounded-full bg-haitechBlue px-5 py-2 text-sm font-semibold text-white">
          {editingId ? "Mettre à jour" : "Créer le produit"}
        </button>
        <button onClick={exportXlsx} className="rounded-full border px-5 py-2 text-sm font-semibold">
          Export XLSX
        </button>
        <label className="rounded-full border px-5 py-2 text-sm font-semibold">
          {importing ? "Import..." : "Import XLSX"}
          <input className="hidden" type="file" accept=".xlsx,.csv" onChange={(e) => (e.target.files?.[0] ? void importXlsx(e.target.files[0]) : undefined)} />
        </label>
        {editingId ? (
          <button
            onClick={() => {
              setEditingId(null);
              setForm(initialForm);
            }}
            className="rounded-full border px-5 py-2 text-sm font-semibold"
          >
            Annuler
          </button>
        ) : null}
      </div>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Alertes stock: <strong>{lowStockProducts.length}</strong> produit(s) au seuil ou en rupture.
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="px-3 py-2">Produit</th>
              <th className="px-3 py-2">Prix</th>
              <th className="px-3 py-2">Promo</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Publié</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="px-3 py-2">
                  <p className="font-semibold text-haitechBlue">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.slug}</p>
                </td>
                <td className="px-3 py-2">
                  {Number(p.base_price).toLocaleString("fr-FR")} FCFA
                  {p.initial_price != null ? <p className="text-xs text-slate-400 line-through">{Number(p.initial_price).toLocaleString("fr-FR")} FCFA</p> : null}
                </td>
                <td className="px-3 py-2">{p.promo_price != null ? `${Number(p.promo_price).toLocaleString("fr-FR")} FCFA` : "-"}</td>
                <td className={`px-3 py-2 ${p.stock <= p.low_stock_threshold ? "text-red-600" : ""}`}>{p.stock}</td>
                <td className="px-3 py-2">{p.is_published ? "Oui" : "Non"}</td>
                <td className="px-3 py-2">
                  <button
                    className="rounded border px-3 py-1"
                    onClick={() => {
                      setEditingId(p.id);
                      setForm({
                        slug: p.slug,
                        name: p.name,
                        category: p.category,
                        brand: p.brand ?? "",
                        image_url: p.image_url ?? "",
                        product_condition: p.product_condition,
                        base_price: Number(p.base_price),
                        initial_price: p.initial_price == null ? "" : Number(p.initial_price),
                        promo_price: p.promo_price == null ? "" : Number(p.promo_price),
                        promo_start_at: p.promo_start_at ? p.promo_start_at.slice(0, 16) : "",
                        promo_end_at: p.promo_end_at ? p.promo_end_at.slice(0, 16) : "",
                        stock: p.stock,
                        low_stock_threshold: p.low_stock_threshold,
                        is_published: Boolean(p.is_published)
                      });
                      void loadContent(p.id);
                    }}
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingId ? (
        <div className="mt-8 space-y-4 rounded-xl border border-slate-200 p-4">
          <h3 className="font-heading text-lg font-bold text-haitechBlue">Contenu avancé (variantes, specs, FAQs)</h3>
          <p className="text-xs text-slate-500">Format JSON attendu, par exemple un tableau d&apos;objets pour variantes/specs/faqs.</p>
          <label className="block text-xs font-semibold text-slate-600">
            Variantes JSON
            <textarea rows={8} className="mt-1 w-full rounded border p-2 font-mono text-xs" value={productContent.variants} onChange={(e) => setProductContent((p) => ({ ...p, variants: e.target.value }))} />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Specs JSON
            <textarea rows={6} className="mt-1 w-full rounded border p-2 font-mono text-xs" value={productContent.specs} onChange={(e) => setProductContent((p) => ({ ...p, specs: e.target.value }))} />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            FAQs JSON
            <textarea rows={6} className="mt-1 w-full rounded border p-2 font-mono text-xs" value={productContent.faqs} onChange={(e) => setProductContent((p) => ({ ...p, faqs: e.target.value }))} />
          </label>
          <button onClick={saveContent} className="rounded-full bg-haitechBlue px-5 py-2 text-sm font-semibold text-white">
            Sauvegarder contenu avancé
          </button>

          <div className="mt-4">
            <h4 className="font-semibold text-haitechBlue">Avis clients (modération)</h4>
            <div className="mt-2 space-y-2">
              {reviews.length === 0 ? (
                <p className="text-sm text-slate-500">Aucun avis.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="rounded border p-3">
                    <p className="text-sm font-semibold">{r.author_name} - {r.rating}/5</p>
                    <p className="text-sm text-slate-600">{r.comment ?? ""}</p>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => void toggleReview(r.id, true)} className="rounded border px-3 py-1 text-xs">
                        Approuver
                      </button>
                      <button onClick={() => void toggleReview(r.id, false)} className="rounded border px-3 py-1 text-xs text-red-600">
                        Rejeter
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
      {feedback ? <p className="mt-3 text-sm text-slate-700">{feedback}</p> : null}
    </section>
  );
}
