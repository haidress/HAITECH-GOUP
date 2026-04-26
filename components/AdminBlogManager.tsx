"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { BlogPostRecord } from "@/lib/repositories/blog-repository";

type BlogForm = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_path: string;
  category: string;
  status: "draft" | "published";
  published_at: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image_path: string;
  author_name: string;
  faq_json: string;
};

function emptyForm(): BlogForm {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image_path: "",
    category: "seo",
    status: "draft",
    published_at: "",
    meta_title: "",
    meta_description: "",
    og_title: "",
    og_description: "",
    og_image_path: "",
    author_name: "HAITECH GROUP",
    faq_json: ""
  };
}

function mapRecordToForm(post: BlogPostRecord): BlogForm {
  const faqRaw = post.faq_json;
  const faqString =
    faqRaw == null
      ? ""
      : typeof faqRaw === "string"
        ? faqRaw
        : JSON.stringify(faqRaw, null, 2);
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    cover_image_path: post.cover_image_path ?? "",
    category: post.category,
    status: post.status,
    published_at: post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : "",
    meta_title: post.meta_title,
    meta_description: post.meta_description,
    og_title: post.og_title ?? "",
    og_description: post.og_description ?? "",
    og_image_path: post.og_image_path ?? "",
    author_name: post.author_name ?? "HAITECH GROUP",
    faq_json: faqString
  };
}

export function AdminBlogManager() {
  const [rows, setRows] = useState<BlogPostRecord[]>([]);
  const [form, setForm] = useState<BlogForm>(emptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog-posts");
      const data = await res.json();
      if (!res.ok || !data.success) {
        setRows([]);
        setMessage(data.message ?? "Chargement impossible.");
        return;
      }
      setRows(data.data as BlogPostRecord[]);
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

  const isEditing = useMemo(() => Number.isFinite(form.id), [form.id]);

  function autoFillSeo() {
    setForm((prev) => ({
      ...prev,
      slug: prev.slug || prev.title.toLowerCase().normalize("NFD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-"),
      excerpt: prev.excerpt || prev.content.slice(0, 220),
      meta_title: prev.meta_title || prev.title,
      meta_description: prev.meta_description || (prev.excerpt || prev.content).slice(0, 300),
      og_title: prev.og_title || prev.title,
      og_description: prev.og_description || (prev.excerpt || prev.content).slice(0, 240),
      og_image_path: prev.og_image_path || prev.cover_image_path
    }));
  }

  function insertCtaBlock() {
    setForm((prev) => {
      const first = prev.category.split(",")[0]?.trim().toLowerCase() ?? "";
      let angle =
        "un diagnostic rapide et une feuille de route priorisee pour avancer sans perdre de temps.";
      if (first.includes("seo")) {
        angle =
          "un audit SEO technique et un plan de contenus aligne sur vos objectifs business et votre zone geographique.";
      } else if (first.includes("cyber")) {
        angle = "un audit de securite pragmatique et des mesures prioritaires adaptees a votre organisation.";
      } else if (first.includes("business")) {
        angle = "une clarification des objectifs, des processus et des outils pour structurer votre croissance.";
      } else if (first.includes("cloud") || first.includes("it")) {
        angle = "une revue de votre stack, de vos sauvegardes et de vos acces pour reduire les risques et les interruptions.";
      }
      const block = `\n\n## Et apres cet article ?\n\nHAITECH GROUP peut vous accompagner sur ${angle} Rendez-vous sur /contact pour en discuter.\n`;
      return { ...prev, content: `${prev.content.trim()}${block}` };
    });
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const payload = {
      ...(form.id ? { id: form.id } : {}),
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      cover_image_path: form.cover_image_path.trim() || null,
      category: form.category.trim(),
      status: form.status,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
      meta_title: form.meta_title.trim(),
      meta_description: form.meta_description.trim(),
      og_title: form.og_title.trim() || null,
      og_description: form.og_description.trim() || null,
      og_image_path: form.og_image_path.trim() || null,
      author_name: form.author_name.trim() || "HAITECH GROUP",
      faq_json: form.faq_json.trim() || null
    };
    try {
      const res = await fetch("/api/admin/blog-posts", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage(data.message ?? "Sauvegarde impossible.");
        return;
      }
      setMessage(form.id ? "Article mis à jour." : "Article créé.");
      setForm(emptyForm());
      await load();
    } catch {
      setMessage("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Supprimer cet article ?")) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/blog-posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage(data.message ?? "Suppression impossible.");
        return;
      }
      setMessage("Article supprimé.");
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
        <h2 className="font-heading text-lg font-bold text-haitechBlue">{isEditing ? "Modifier l’article" : "Nouvel article"}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Titre</span>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Slug (URL)</span>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Catégories / tags (séparés par virgule)</span>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="seo, cybersécurité, pme" />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Résumé</span>
            <textarea className="mt-1 min-h-[80px] w-full rounded-lg border px-3 py-2" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Contenu</span>
            <textarea className="mt-1 min-h-[220px] w-full rounded-lg border px-3 py-2" value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Auteur (affichage public)</span>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.author_name} onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))} />
          </label>
          <div className="flex items-end">
            <button type="button" onClick={insertCtaBlock} className="w-full rounded-lg border border-haitechBlue px-3 py-2 text-xs font-semibold text-haitechBlue">
              Inserer bloc CTA (selon categorie)
            </button>
          </div>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">FAQ JSON (optionnel, JSON-LD FAQPage)</span>
            <textarea
              className="mt-1 min-h-[120px] w-full rounded-lg border px-3 py-2 font-mono text-xs"
              value={form.faq_json}
              onChange={(e) => setForm((f) => ({ ...f, faq_json: e.target.value }))}
              placeholder='[{"question":"...","answer":"..."}]'
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Image couverture (chemin public)</span>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.cover_image_path} onChange={(e) => setForm((f) => ({ ...f, cover_image_path: e.target.value }))} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Statut</span>
            <select className="mt-1 w-full rounded-lg border px-3 py-2" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "draft" | "published" }))}>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Date de publication</span>
            <input type="datetime-local" className="mt-1 w-full rounded-lg border px-3 py-2" value={form.published_at} onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))} />
          </label>
          <div className="hidden md:block" />
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Meta title</span>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.meta_title} onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))} />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Meta description</span>
            <textarea className="mt-1 min-h-[70px] w-full rounded-lg border px-3 py-2" value={form.meta_description} onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">OG title</span>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.og_title} onChange={(e) => setForm((f) => ({ ...f, og_title: e.target.value }))} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">OG image (chemin)</span>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.og_image_path} onChange={(e) => setForm((f) => ({ ...f, og_image_path: e.target.value }))} />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="font-medium text-slate-700">OG description</span>
            <textarea className="mt-1 min-h-[60px] w-full rounded-lg border px-3 py-2" value={form.og_description} onChange={(e) => setForm((f) => ({ ...f, og_description: e.target.value }))} />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={autoFillSeo} className="rounded-full border px-4 py-2 text-xs font-semibold text-haitechBlue">
            Auto-remplir SEO
          </button>
          <button type="button" disabled={saving} onClick={() => void save()} className="rounded-full bg-haitechGold px-6 py-2 text-sm font-semibold text-haitechBlue disabled:opacity-50">
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
        <h2 className="font-heading text-lg font-bold text-haitechBlue">Articles existants</h2>
        {rows.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Aucun article.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {rows.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 py-2">
                <div>
                  <p className="font-semibold text-haitechBlue">{row.title}</p>
                  <p className="text-xs text-slate-500">
                    /blog/{row.slug} • {row.status === "published" ? "Publié" : "Brouillon"} • {row.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="rounded-full border px-3 py-1 text-xs font-semibold text-haitechBlue" onClick={() => setForm(mapRecordToForm(row))}>
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
