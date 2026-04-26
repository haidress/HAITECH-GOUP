"use client";

import { useEffect, useState } from "react";

type Role = { id: number; nom: string };
type User = { id: number; nom: string; prenom: string | null; email: string; statut: string; role: string };

export function AdminRoleManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [feedback, setFeedback] = useState("");

  async function load() {
    const res = await fetch("/api/admin/roles");
    const json = await res.json();
    if (!res.ok || !json.success) return setFeedback(json.message ?? "Chargement impossible.");
    setRoles(json.data.roles ?? []);
    setUsers(json.data.users ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateRole(userId: number, roleName: string) {
    const res = await fetch("/api/admin/roles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, roleName })
    });
    const json = await res.json();
    if (!res.ok || !json.success) return setFeedback(json.message ?? "Mise à jour impossible.");
    setFeedback("Rôle mis à jour.");
    await load();
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-heading text-lg font-bold text-haitechBlue">Rôles & permissions (admin)</h2>
      <p className="mt-1 text-sm text-slate-600">Attribuez les rôles catalog_manager, sales_manager et super_admin.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="px-3 py-2">Utilisateur</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Statut</th>
              <th className="px-3 py-2">Rôle</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="px-3 py-2">{[u.prenom, u.nom].filter(Boolean).join(" ") || u.nom}</td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">{u.statut}</td>
                <td className="px-3 py-2">
                  <select
                    value={u.role}
                    onChange={(e) => void updateRole(u.id, e.target.value)}
                    className="rounded border px-2 py-1"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.nom}>
                        {r.nom}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {feedback ? <p className="mt-3 text-sm text-slate-700">{feedback}</p> : null}
    </section>
  );
}
