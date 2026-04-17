"use client";

import { useRouter } from "next/navigation";

export function AdminSessionBar() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="space-y-3 rounded-xl border bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">Session administrateur active</p>
        <button onClick={logout} className="rounded-full border px-4 py-2 text-sm font-semibold text-haitechBlue">
          Déconnexion
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <a href="/admin" className="rounded-full border px-3 py-1.5 text-sm font-semibold text-haitechBlue">
          Dashboard
        </a>
        <a href="/admin/catalogue" className="rounded-full border px-3 py-1.5 text-sm font-semibold text-haitechBlue">
          Catalogue
        </a>
        <a href="/admin/commandes" className="rounded-full border px-3 py-1.5 text-sm font-semibold text-haitechBlue">
          Commandes
        </a>
        <a href="/admin/interventions" className="rounded-full border px-3 py-1.5 text-sm font-semibold text-haitechBlue">
          Interventions
        </a>
        <a href="/admin/incidents" className="rounded-full border px-3 py-1.5 text-sm font-semibold text-haitechBlue">
          Incidents
        </a>
        <a href="/admin/documents" className="rounded-full border px-3 py-1.5 text-sm font-semibold text-haitechBlue">
          Documents
        </a>
        <a href="/admin/techniciens" className="rounded-full border px-3 py-1.5 text-sm font-semibold text-haitechBlue">
          Techniciens
        </a>
        <a href="/admin/leads" className="rounded-full border px-3 py-1.5 text-sm font-semibold text-haitechBlue">
          Leads
        </a>
        <a href="/admin/devis" className="rounded-full border px-3 py-1.5 text-sm font-semibold text-haitechBlue">
          Devis
        </a>
      </div>
    </div>
  );
}
