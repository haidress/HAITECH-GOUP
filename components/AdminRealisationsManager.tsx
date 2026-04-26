"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { RealisationProjectRecord } from "@/lib/repositories/realisations-repository";

type RealisationForm = {
  id?: number;
  slug: string;
  title: string;
  tag: "Web" | "IT" | "Formation" | "Business";
  client_name: string;
  sector: string;
  context_text: string;
  challenge_text: string;
  solution_text: string;
  outcome_text: string;
  excerpt: string;
  year_label: string;
  duration_label: string;
  stack_json: string;
  highlights_json: string;
  detail_notes_json: string;
  links_json: string;
  image_url: string;
  image_fit: "cover" | "contain";
  is_published: boolean;
  sort_order: number;
};

function emptyForm(): RealisationForm {
  return {
    slug: "",
    title: "",
    tag: "Business",
    client_name: "",
    sector: "",
    context_text: "",
    challenge_text: "",
    solution_text: "",
    outcome_text: "",
    excerpt: "",
    year_label: String(new Date().getFullYear()),
    duration_label: "Accompagnement continu",
    stack_json: "[]",
    highlights_json: "[]",
    detail_notes_json: "[]",
    links_json: "[]",
    image_url: "",
    image_fit: "cover",
    is_published: true,
    sort_order: 100
  };
}

function mapRowToForm(row: RealisationProjectRecord): RealisationForm {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tag: row.tag,
    client_name: row.client_name,
    sector: row.sector,
    context_text: row.context_text,
    challenge_text: row.challenge_text,
    solution_text: row.solution_text,
    outcome_text: row.outcome_text,
    excerpt: row.excerpt,
    year_label: row.year_label,
    duration_label: row.duration_label,
    stack_json: row.stack_json ?? "[]",
    highlights_json: row.highlights_json ?? "[]",
    detail_notes_json: row.detail_notes_json ?? "[]",
    links_json: row.links_json ?? "[]",
    image_url: row.image_url,
    image_fit: row.image_fit,
    is_published: row.is_published === 1,
    sort_order: row.sort_order
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AdminRealisationsManager() {
  const [rows, setRows] = useState<RealisationProjectRecord[]>([]);
  const [form, setForm] = useState<RealisationForm>(emptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const isEditing = useMemo(() => Number.isFinite(form.id), [form.id]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/realisations");
      const data = (await res.json()) as { success?: boolean; message?: string; data?: RealisationProjectRecord[] };
      if (!res.ok || !data.success) {
        setRows([]);
        setMessage(data.message ?? "Chargement impossible.");
        return;
      }
      setRows(data.data ?? []);
      setMessage("");
    } catch {
      setMessage("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function autoFill() {
    setForm((prev) => ({
      ...prev,
      slug: prev.slug || slugify(prev.client_name || prev.title),
      excerpt: prev.excerpt || prev.outcome_text.slice(0, 220)
    }));
  }

  async function uploadLogo(file: File) {
    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/realisations/upload-logo", {
        method: "POST",
        body: formData
      });
      const data = (await res.json()) as { success?: boolean; message?: string; data?: { url?: string } };
      if (!res.ok || !data.success || !data.data?.url) {
        setMessage(data.message ?? "Upload impossible.");
        return;
      }
      setForm((prev) => ({ ...prev, image_url: data.data!.url! }));
      setMessage("Logo/image téléversé.");
    } catch {
      setMessage("Erreur réseau upload.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        ...(form.id ? { id: form.id } : {}),
        slug: form.slug.trim(),
        title: form.title.trim(),
        tag: form.tag,
        client_name: form.client_name.trim(),
        sector: form.sector.trim(),
        context_text: form.context_text.trim(),
        challenge_text: form.challenge_text.trim(),
        solution_text: form.solution_text.trim(),
        outcome_text: form.outcome_text.trim(),
        excerpt: form.excerpt.trim(),
        year_label: form.year_label.trim(),
        duration_label: form.duration_label.trim(),
        stack_json: form.stack_json.trim() || "[]",
        highlights_json: form.highlights_json.trim() || "[]",
        detail_notes_json: form.detail_notes_json.trim() || "[]",
        links_json: form.links_json.trim() || "[]",
        image_url: form.image_url.trim(),
        image_fit: form.image_fit,
        is_published: form.is_published,
        sort_order: Number(form.sort_order || 0)
      };
      const res = await fetch("/api/admin/realisations", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) {
        setMessage(data.message ?? "Sauvegarde impossible.");
        return;
      }
      setMessage(form.id ? "Projet mis à jour." : "Projet créé.");
      setForm(emptyForm());
      await load();
    } catch {
      setMessage("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Supprimer ce projet ?")) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/realisations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) {
        setMessage(data.message ?? "Suppression impossible.");
        return;
      }
      setMessage("Projet supprimé.");
      if (form.id === id) setForm(emptyForm());
      await load();
    } catch {
      setMessage("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-600">Chargement…</p>;

  return (
    <div className="space-y-8">
      {message ? <p className="text-sm text-slate-700">{message}</p> : null}

      <section className="rounded-2xl border border-slate-200 p-5">
        <h2 className="font-heading text-lg font-bold text-haitechBlue">{isEditing ? "Modifier le projet" : "Nouveau projet"}</h2>
        <p className="mt-1 text-xs text-slate-500">
          Les champs <code>stack_json</code>, <code>highlights_json</code>, <code>detail_notes_json</code> attendent un tableau JSON (ex: [&quot;item 1&quot;,&quot;item 2&quot;]).
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Titre</span>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Client</span>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.client_name} onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Secteur</span>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.sector} onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Slug</span>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          </label>
          <div className="flex items-end">
            <button type="button" onClick={autoFill} className="w-full rounded-lg border border-haitechBlue px-3 py-2 text-xs font-semibold text-haitechBlue">
              Auto-remplir slug + résumé
            </button>
          </div>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Pôle</span>
            <select className="mt-1 w-full rounded-lg border px-3 py-2" value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value as RealisationForm["tag"] }))}>
              <option value="Business">Business</option>
              <option value="Web">Web</option>
              <option value="IT">IT</option>
              <option value="Formation">Formation</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Image fit</span>
            <select className="mt-1 w-full rounded-lg border px-3 py-2" value={form.image_fit} onChange={(e) => setForm((f) => ({ ...f, image_fit: e.target.value as "cover" | "contain" }))}>
              <option value="cover">cover</option>
              <option value="contain">contain</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Année affichée</span>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.year_label} onChange={(e) => setForm((f) => ({ ...f, year_label: e.target.value }))} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Durée affichée</span>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.duration_label} onChange={(e) => setForm((f) => ({ ...f, duration_label: e.target.value }))} />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Résumé court</span>
            <textarea className="mt-1 min-h-[70px] w-full rounded-lg border px-3 py-2" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Contexte</span>
            <textarea className="mt-1 min-h-[90px] w-full rounded-lg border px-3 py-2" value={form.context_text} onChange={(e) => setForm((f) => ({ ...f, context_text: e.target.value }))} />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Enjeu</span>
            <textarea className="mt-1 min-h-[90px] w-full rounded-lg border px-3 py-2" value={form.challenge_text} onChange={(e) => setForm((f) => ({ ...f, challenge_text: e.target.value }))} />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Solution</span>
            <textarea className="mt-1 min-h-[90px] w-full rounded-lg border px-3 py-2" value={form.solution_text} onChange={(e) => setForm((f) => ({ ...f, solution_text: e.target.value }))} />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Résultat</span>
            <textarea className="mt-1 min-h-[90px] w-full rounded-lg border px-3 py-2" value={form.outcome_text} onChange={(e) => setForm((f) => ({ ...f, outcome_text: e.target.value }))} />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Image / logo URL (chemin public)</span>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} placeholder="/uploads/realisations/..." />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Téléverser un logo/image</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadLogo(file);
              }}
            />
            {uploading ? <p className="mt-1 text-xs text-slate-500">Upload en cours…</p> : null}
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Stack JSON</span>
            <textarea className="mt-1 min-h-[90px] w-full rounded-lg border px-3 py-2 font-mono text-xs" value={form.stack_json} onChange={(e) => setForm((f) => ({ ...f, stack_json: e.target.value }))} />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Highlights JSON</span>
            <textarea className="mt-1 min-h-[90px] w-full rounded-lg border px-3 py-2 font-mono text-xs" value={form.highlights_json} onChange={(e) => setForm((f) => ({ ...f, highlights_json: e.target.value }))} />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Notes JSON</span>
            <textarea className="mt-1 min-h-[90px] w-full rounded-lg border px-3 py-2 font-mono text-xs" value={form.detail_notes_json} onChange={(e) => setForm((f) => ({ ...f, detail_notes_json: e.target.value }))} />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Liens JSON (optionnel)</span>
            <textarea className="mt-1 min-h-[90px] w-full rounded-lg border px-3 py-2 font-mono text-xs" value={form.links_json} onChange={(e) => setForm((f) => ({ ...f, links_json: e.target.value }))} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} />
            <span className="font-medium text-slate-700">Publié</span>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Ordre d&apos;affichage</span>
            <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value || 0) }))} />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" disabled={saving || uploading} onClick={() => void save()} className="rounded-full bg-haitechGold px-6 py-2 text-sm font-semibold text-haitechBlue disabled:opacity-50">
            {saving ? "Enregistrement…" : isEditing ? "Mettre à jour" : "Créer"}
          </button>
          {isEditing ? (
            <button type="button" disabled={saving} onClick={() => setForm(emptyForm())} className="rounded-full border px-4 py-2 text-xs font-semibold text-slate-600">
              Annuler
            </button>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h2 className="font-heading text-lg font-bold text-haitechBlue">Projets existants</h2>
        {rows.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Aucun projet.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {rows.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 py-2">
                <div>
                  <p className="font-semibold text-haitechBlue">{row.client_name} — {row.title}</p>
                  <p className="text-xs text-slate-500">
                    /realisations/{row.slug} • {row.tag} • {row.is_published ? "Publié" : "Brouillon"} • ordre {row.sort_order}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="rounded-full border px-3 py-1 text-xs font-semibold text-haitechBlue" onClick={() => setForm(mapRowToForm(row))}>
                    Éditer
                  </button>
                  <button type="button" className="rounded-full border px-3 py-1 text-xs font-semibold text-red-600" onClick={() => void remove(row.id)}>
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
