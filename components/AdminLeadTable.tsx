"use client";

import { useState } from "react";
import type { LeadRecord, LeadStatus } from "@/lib/leads";

type AdminLeadTableProps = {
  initialLeads: LeadRecord[];
};

const statuses: LeadStatus[] = ["nouveau", "qualifie", "converti", "perdu"];

export function AdminLeadTable({ initialLeads }: AdminLeadTableProps) {
  const [rows, setRows] = useState(initialLeads);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function changeStatus(id: number, statut: LeadStatus) {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut })
      });
      if (!response.ok) {
        throw new Error("Échec de mise à jour");
      }
      setRows((prev) => prev.map((row) => (row.id === id ? { ...row, statut } : row)));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-700">
          <tr>
            <th className="px-4 py-3">Lead</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Budget</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Statut</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
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
                  className="rounded border p-2"
                  value={row.statut}
                  disabled={loadingId === row.id}
                  onChange={(e) => changeStatus(row.id, e.target.value as LeadStatus)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
