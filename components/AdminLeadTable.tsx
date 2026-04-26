"use client";

import { useEffect, useMemo, useState } from "react";
import type { LeadRecord, LeadStatus } from "@/lib/leads";

type CommercialOption = { id: number; email: string; label: string };

type AdminLeadTableProps = {
  initialLeads: LeadRecord[];
};

const statuses: LeadStatus[] = ["nouveau", "qualifie", "converti", "perdu"];

const statusLabels: Record<LeadStatus, string> = {
  nouveau: "Nouveau",
  qualifie: "Qualifié",
  converti: "Converti",
  perdu: "Perdu"
};

export function AdminLeadTable({ initialLeads }: AdminLeadTableProps) {
  const [rows, setRows] = useState(initialLeads);
  const [commercials, setCommercials] = useState<CommercialOption[]>([]);
  const [filterStatut, setFilterStatut] = useState<LeadStatus | "tous">("tous");
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/admin/commercial-users");
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data)) {
          setCommercials(data.data as CommercialOption[]);
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (filterStatut === "tous") return rows;
    return rows.filter((r) => r.statut === filterStatut);
  }, [rows, filterStatut]);

  async function patchLead(id: number, body: Record<string, unknown>) {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        throw new Error("Échec de mise à jour");
      }
      const data = await response.json();
      if (!data.success) throw new Error();
    } finally {
      setLoadingId(null);
    }
  }

  async function changeStatus(id: number, statut: LeadStatus) {
    await patchLead(id, { statut });
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, statut } : row)));
  }

  async function changeAssignee(id: number, assigned_user_id: number | null) {
    await patchLead(id, { assigned_user_id });
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const c = commercials.find((x) => x.id === assigned_user_id);
        return {
          ...row,
          assigned_user_id,
          assigned_label: c?.label ?? null,
          assigned_email: c?.email ?? null
        };
      })
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <span className="self-center text-xs font-semibold uppercase text-slate-500">Pipeline</span>
        {(["tous", ...statuses] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilterStatut(s)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              filterStatut === s ? "border-haitechBlue bg-haitechBlue text-white" : "border-slate-200 text-slate-700"
            }`}
          >
            {s === "tous" ? "Tous" : statusLabels[s]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-700">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Commercial</th>
              <th className="px-4 py-3">Relance auto</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3">
                  <p className="font-semibold text-haitechBlue">{row.nom}</p>
                  <p className="text-slate-600">{row.email}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{row.besoin}</p>
                </td>
                <td className="px-4 py-3 uppercase text-slate-600">{row.source}</td>
                <td className="px-4 py-3 text-slate-600">{row.budget ? `${row.budget} FCFA` : "-"}</td>
                <td className="px-4 py-3 text-slate-600">
                  {new Date(row.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <select
                    className="max-w-[10rem] rounded border p-2 text-xs"
                    value={row.assigned_user_id ?? ""}
                    disabled={loadingId === row.id}
                    onChange={(e) => {
                      const v = e.target.value;
                      void changeAssignee(row.id, v === "" ? null : Number(v));
                    }}
                  >
                    <option value="">—</option>
                    {commercials.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {row.last_followup_email_at
                    ? new Date(row.last_followup_email_at).toLocaleDateString("fr-FR")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <select
                    className="rounded border p-2"
                    value={row.statut}
                    disabled={loadingId === row.id}
                    onChange={(e) => void changeStatus(row.id, e.target.value as LeadStatus)}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
