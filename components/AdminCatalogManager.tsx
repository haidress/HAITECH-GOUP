"use client";

import { useEffect, useRef, useState } from "react";

type Product = {
  id: number;
  nom: string;
  description: string | null;
  categorie: "Business Center" | "Boutique IT";
  prix_base: number;
  prix_initial: number | null;
  image_url?: string | null;
  actif: 0 | 1 | boolean;
};

type Formation = {
  id: number;
  titre: string;
  description: string | null;
  prix: number;
  niveau: string | null;
  duree: string | null;
  image: string | null;
};

const initialProductForm = {
  nom: "",
  description: "",
  categorie: "Business Center" as "Business Center" | "Boutique IT",
  prixBase: 0,
  prixInitial: "" as number | "",
  imageUrl: "",
  actif: true
};

const initialFormationForm = {
  titre: "",
  description: "",
  prix: 0,
  niveau: "",
  duree: "",
  image: ""
};

export function AdminCatalogManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [productForm, setProductForm] = useState(initialProductForm);
  const [formationForm, setFormationForm] = useState(initialFormationForm);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingFormationId, setEditingFormationId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const productFormAnchorRef = useRef<HTMLDivElement | null>(null);
  const businessProducts = products.filter((p) => p.categorie === "Business Center");
  const boutiqueProducts = products.filter((p) => p.categorie === "Boutique IT");

  async function loadData() {
    const [productsRes, formationsRes] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/formations")
    ]);
    const [productsData, formationsData] = await Promise.all([productsRes.json(), formationsRes.json()]);
    setProducts(productsData.data ?? []);
    setFormations(formationsData.data ?? []);
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (editingProductId == null) return;
    const id = requestAnimationFrame(() => {
      productFormAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [editingProductId]);

  async function uploadProductCatalogImage(file: File) {
    setUploadingProductImage(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/boutique/upload-image", { method: "POST", body: formData });
    const json = await res.json();
    setUploadingProductImage(false);
    if (!res.ok || !json.success) {
      setFeedback(json.message ?? "Upload image impossible.");
      return;
    }
    setProductForm((prev) => ({ ...prev, imageUrl: json.data.url as string }));
    setFeedback("Image enregistrée dans le formulaire — cliquez sur « Modifier le produit » pour sauvegarder.");
  }

  async function submitProduct() {
    if (!productForm.nom || productForm.nom.trim().length < 2) {
      setFeedback("Le nom du produit doit contenir au moins 2 caractères.");
      return;
    }
    const isEdit = editingProductId !== null;
    const url = isEdit ? `/api/admin/products/${editingProductId}` : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";
    const payload = {
      ...productForm,
      prixInitial: productForm.prixInitial === "" ? null : productForm.prixInitial,
      imageUrl: productForm.imageUrl.trim() === "" ? null : productForm.imageUrl.trim()
    };
    const res = await fetch(url, {
      method,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      setFeedback(data.message ?? "Erreur produit.");
      return;
    }
    setFeedback(isEdit ? "Produit modifié." : "Produit ajouté.");
    setProductForm(initialProductForm);
    setEditingProductId(null);
    await loadData();
  }

  async function submitFormation() {
    if (!formationForm.titre || formationForm.titre.trim().length < 2) {
      setFeedback("Le titre de la formation doit contenir au moins 2 caractères.");
      return;
    }
    const isEdit = editingFormationId !== null;
    const url = isEdit ? `/api/admin/formations/${editingFormationId}` : "/api/admin/formations";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formationForm)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      setFeedback(data.message ?? "Erreur formation.");
      return;
    }
    setFeedback(isEdit ? "Formation modifiée." : "Formation ajoutée.");
    setFormationForm(initialFormationForm);
    setEditingFormationId(null);
    await loadData();
  }

  async function deleteProduct(id: number) {
    if (!confirm("Supprimer ce produit ?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE", credentials: "same-origin" });
    const data = await res.json();
    if (!res.ok || !data.success) {
      setFeedback(data.message ?? "Suppression impossible.");
      return;
    }
    setFeedback("Produit supprimé.");
    await loadData();
  }

  async function deleteFormation(id: number) {
    if (!confirm("Supprimer cette formation ?")) return;
    const res = await fetch(`/api/admin/formations/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.success) {
      setFeedback(data.message ?? "Suppression impossible.");
      return;
    }
    setFeedback("Formation supprimée.");
    await loadData();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 p-5">
        <div ref={productFormAnchorRef} className="scroll-mt-24" aria-hidden />
        <h2 className="font-heading text-xl font-bold text-haitechBlue">Produits (Business Center / Boutique IT)</h2>
        {editingProductId != null ? (
          <p className="mt-2 rounded-lg border border-haitechGold/40 bg-amber-50 px-3 py-2 text-sm text-slate-800">
            Édition du produit n°{editingProductId} — les champs ci-dessous sont préremplis ; faites défiler si besoin, modifiez puis enregistrez.
          </p>
        ) : null}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            value={productForm.nom}
            onChange={(e) => setProductForm((prev) => ({ ...prev, nom: e.target.value }))}
            className="rounded border p-3"
            placeholder="Nom"
          />
          <input
            type="number"
            min={0}
            value={productForm.prixBase}
            onChange={(e) => setProductForm((prev) => ({ ...prev, prixBase: Number(e.target.value) }))}
            className="rounded border p-3"
            placeholder="Prix de base"
          />
          <input
            type="number"
            min={0}
            value={productForm.prixInitial}
            onChange={(e) =>
              setProductForm((prev) => ({
                ...prev,
                prixInitial: e.target.value === "" ? "" : Number(e.target.value)
              }))
            }
            className="rounded border p-3"
            placeholder="Prix initial (optionnel)"
          />
          <select
            value={productForm.categorie}
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, categorie: e.target.value as "Business Center" | "Boutique IT" }))
            }
            className="rounded border p-3"
          >
            <option value="Business Center">Business Center</option>
            <option value="Boutique IT">Boutique IT</option>
          </select>
          <label className="flex items-center gap-2 rounded border p-3">
            <input
              type="checkbox"
              checked={productForm.actif}
              onChange={(e) => setProductForm((prev) => ({ ...prev, actif: e.target.checked }))}
            />
            Actif
          </label>
          <textarea
            value={productForm.description}
            onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
            className="rounded border p-3 md:col-span-2"
            placeholder="Description"
          />
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold text-slate-600">Image (URL ou fichier)</span>
            <input
              value={productForm.imageUrl}
              onChange={(e) => setProductForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
              className="mt-1 w-full rounded border p-3"
              placeholder="/uploads/boutique/… ou URL"
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploadingProductImage}
              className="mt-2 block text-sm"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadProductCatalogImage(f);
                e.target.value = "";
              }}
            />
            {uploadingProductImage ? <span className="mt-1 block text-xs text-slate-500">Envoi en cours…</span> : null}
            {productForm.imageUrl.trim() ? (
              <span className="mt-2 block text-xs text-slate-500">Aperçu : {productForm.imageUrl.trim()}</span>
            ) : null}
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={submitProduct} className="rounded-full bg-haitechBlue px-5 py-2 font-semibold text-white">
            {editingProductId ? "Modifier le produit" : "Ajouter le produit"}
          </button>
          {editingProductId ? (
            <button
              onClick={() => {
                setEditingProductId(null);
                setProductForm(initialProductForm);
              }}
              className="rounded-full border px-5 py-2 font-semibold"
            >
              Annuler
            </button>
          ) : null}
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left">
                <th className="px-3 py-2">Nom</th>
                <th className="px-3 py-2">Catégorie</th>
                <th className="px-3 py-2">Prix</th>
                <th className="px-3 py-2">Prix initial</th>
                <th className="px-3 py-2">Actif</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="px-3 py-2">{p.nom}</td>
                  <td className="px-3 py-2">{p.categorie}</td>
                  <td className="px-3 py-2">{Number(p.prix_base).toLocaleString("fr-FR")} FCFA</td>
                  <td className="px-3 py-2">
                    {p.prix_initial == null ? "-" : `${Number(p.prix_initial).toLocaleString("fr-FR")} FCFA`}
                  </td>
                  <td className="px-3 py-2">{p.actif ? "Oui" : "Non"}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded border px-3 py-1"
                        onClick={() => {
                          setFeedback("");
                          setEditingProductId(p.id);
                          setProductForm({
                            nom: p.nom,
                            description: p.description ?? "",
                            categorie: p.categorie,
                            prixBase: Number(p.prix_base),
                            prixInitial: p.prix_initial == null ? "" : Number(p.prix_initial),
                            imageUrl: p.image_url?.trim() ?? "",
                            actif: Boolean(p.actif)
                          });
                        }}
                      >
                        Modifier
                      </button>
                      <button className="rounded border px-3 py-1 text-red-600" onClick={() => deleteProduct(p.id)}>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-haitechBlue">Produits Business Center</p>
            <p className="mt-2 text-sm text-slate-600">{businessProducts.length} élément(s)</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-haitechBlue">Produits Boutique IT</p>
            <p className="mt-2 text-sm text-slate-600">{boutiqueProducts.length} élément(s)</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h2 className="font-heading text-xl font-bold text-haitechBlue">Formations</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            value={formationForm.titre}
            onChange={(e) => setFormationForm((prev) => ({ ...prev, titre: e.target.value }))}
            className="rounded border p-3"
            placeholder="Titre"
          />
          <input
            type="number"
            min={0}
            value={formationForm.prix}
            onChange={(e) => setFormationForm((prev) => ({ ...prev, prix: Number(e.target.value) }))}
            className="rounded border p-3"
            placeholder="Prix"
          />
          <input
            value={formationForm.niveau}
            onChange={(e) => setFormationForm((prev) => ({ ...prev, niveau: e.target.value }))}
            className="rounded border p-3"
            placeholder="Niveau"
          />
          <input
            value={formationForm.duree}
            onChange={(e) => setFormationForm((prev) => ({ ...prev, duree: e.target.value }))}
            className="rounded border p-3"
            placeholder="Durée"
          />
          <input
            value={formationForm.image}
            onChange={(e) => setFormationForm((prev) => ({ ...prev, image: e.target.value }))}
            className="rounded border p-3 md:col-span-2"
            placeholder="URL image (/mon-image.jpg)"
          />
          <textarea
            value={formationForm.description}
            onChange={(e) => setFormationForm((prev) => ({ ...prev, description: e.target.value }))}
            className="rounded border p-3 md:col-span-2"
            placeholder="Description"
          />
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={submitFormation} className="rounded-full bg-haitechBlue px-5 py-2 font-semibold text-white">
            {editingFormationId ? "Modifier la formation" : "Ajouter la formation"}
          </button>
          {editingFormationId ? (
            <button
              onClick={() => {
                setEditingFormationId(null);
                setFormationForm(initialFormationForm);
              }}
              className="rounded-full border px-5 py-2 font-semibold"
            >
              Annuler
            </button>
          ) : null}
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left">
                <th className="px-3 py-2">Titre</th>
                <th className="px-3 py-2">Prix</th>
                <th className="px-3 py-2">Niveau</th>
                <th className="px-3 py-2">Durée</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formations.map((f) => (
                <tr key={f.id} className="border-b">
                  <td className="px-3 py-2">{f.titre}</td>
                  <td className="px-3 py-2">{Number(f.prix).toLocaleString("fr-FR")} FCFA</td>
                  <td className="px-3 py-2">{f.niveau ?? "-"}</td>
                  <td className="px-3 py-2">{f.duree ?? "-"}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        className="rounded border px-3 py-1"
                        onClick={() => {
                          setEditingFormationId(f.id);
                          setFormationForm({
                            titre: f.titre,
                            description: f.description ?? "",
                            prix: Number(f.prix),
                            niveau: f.niveau ?? "",
                            duree: f.duree ?? "",
                            image: f.image ?? ""
                          });
                        }}
                      >
                        Modifier
                      </button>
                      <button className="rounded border px-3 py-1 text-red-600" onClick={() => deleteFormation(f.id)}>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {feedback ? <p className="text-sm text-slate-700">{feedback}</p> : null}
    </div>
  );
}
