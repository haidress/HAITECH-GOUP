"use client";

import { useCallback, useEffect, useState } from "react";
import type { SitePageSeo } from "@/lib/repositories/page-seo-repository";

function emptyRow(): Omit<SitePageSeo, "updated_at"> {
  return {
    path: "/",
    meta_title: "",
    meta_description: "",
    og_title: null,
    og_description: null,
    og_image_path: null
  };
}

export function AdminPageSeoManager() {
  const [rows, setRows] = useState<SitePageSeo[]>([]);
  const [form, setForm] = useState<Omit<SitePageSeo, "updated_at">>(emptyRow());
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/page-seo");
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage(data.message ?? "Chargement impossible.");
        setRows([]);
        return;
      }
      setRows(data.data as SitePageSeo[]);
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

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/page-seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: form.path.trim(),
          meta_title: form.meta_title.trim(),
          meta_description: form.meta_description.trim(),
          og_title: form.og_title?.trim() || null,
          og_description: form.og_description?.trim() || null,
          og_image_path: form.og_image_path?.trim() || null
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage(data.message ?? "Sauvegarde impossible.");
        return;
      }
      setMessage("Page SEO enregistrée.");
      await load();
    } catch {
      setMessage("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  }

  function editRow(row: SitePageSeo) {
    setForm({
      path: row.path,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      og_title: row.og_title,
      og_description: row.og_description,
      og_image_path: row.og_image_path
    });
  }

  if (loading) return <p className="text-sm text-slate-600">Chargement…</p>;

  return (
    <div className="space-y-8">
      {message ? <p className="text-sm text-slate-700">{message}</p> : null}

      <section className="rounded-2xl border border-slate-200 p-5">
        <h2 className="font-heading text-lg font-bold text-haitechBlue">Éditer une page</h2>
        <p className="mt-1 text-xs text-slate-500">
          Chemin exact (ex. <code>/</code>, <code>/contact</code>, <code>/technology</code>). Image OG : chemin
          public (ex. <code>/logo-haitech.jpg</code>).
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Chemin</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.path}
              onChange={(e) => setForm((f) => ({ ...f, path: e.target.value }))}
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Meta title</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.meta_title}
              onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Meta description</span>
            <textarea
              className="mt-1 min-h-[80px] w-full rounded-lg border px-3 py-2"
              value={form.meta_description}
              onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">OG title (optionnel)</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.og_title ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, og_title: e.target.value || null }))}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Image OG (chemin)</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.og_image_path ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, og_image_path: e.target.value || null }))}
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">OG description (optionnel)</span>
            <textarea
              className="mt-1 min-h-[60px] w-full rounded-lg border px-3 py-2"
              value={form.og_description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, og_description: e.target.value || null }))}
            />
          </label>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="mt-4 rounded-full bg-haitechGold px-6 py-2 text-sm font-semibold text-haitechBlue disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h2 className="font-heading text-lg font-bold text-haitechBlue">Pages configurées</h2>
        {rows.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Aucune entrée. Créez-en une ci-dessus.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {rows.map((r) => (
              <li key={r.path} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 py-2">
                <div>
                  <span className="font-mono font-semibold text-haitechBlue">{r.path}</span>
                  <p className="text-xs text-slate-500">{r.meta_title}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full border px-3 py-1 text-xs font-semibold text-haitechBlue"
                  onClick={() => editRow(r)}
                >
                  Charger
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
