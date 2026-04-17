"use client";

import { useCallback, useEffect, useState } from "react";

type OrderRow = {
  id: number;
  reference_code: string;
  source_type: "business_center" | "boutique_it" | "formation" | "services_it";
  product_name: string;
  amount: number;
  nom: string;
  contact: string;
  email: string;
  status: "nouvelle" | "en_cours" | "en_attente_client" | "validee_client" | "livree" | "traitee" | "cloturee" | "annulee";
  assigned_user_id: number | null;
  assigned_user_name: string | null;
  is_closed: number;
  closed_at: string | null;
  created_at: string;
  last_status_at: string | null;
  latest_note: string | null;
};

type AdminUser = {
  id: number;
  nom: string;
  prenom: string | null;
  email: string;
};

type OrderNote = {
  id: number;
  note: string;
  action_type: string;
  created_at: string;
  actor_name: string | null;
};

export function AdminOrdersManager() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [message, setMessage] = useState("");
  const [noteDraft, setNoteDraft] = useState<Record<number, string>>({});
  const [historyOrderId, setHistoryOrderId] = useState<number | null>(null);
  const [history, setHistory] = useState<OrderNote[]>([]);
  const [statusFilter, setStatusFilter] = useState<"" | OrderRow["status"]>("");
  const [assignedFilter, setAssignedFilter] = useState<string>("");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const [closedFilter, setClosedFilter] = useState<"" | "0" | "1">("");
  const [closureDraft, setClosureDraft] = useState<
    Record<number, { clientValidationOk: boolean; reportSentOk: boolean; proofAttachedOk: boolean; proofUrl: string }>
  >({});

  const loadOrders = useCallback(async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (assignedFilter) params.set("assignedUserId", assignedFilter);
    if (fromFilter) params.set("from", fromFilter);
    if (toFilter) params.set("to", toFilter);
    if (closedFilter) params.set("closed", closedFilter);
    const query = params.toString();
    const response = await fetch(`/api/admin/orders${query ? `?${query}` : ""}`);
    const data = await response.json();
    setOrders(data.data ?? []);
    setAdmins(data.admins ?? []);
  }, [statusFilter, assignedFilter, fromFilter, toFilter, closedFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function updateStatus(id: number, status: OrderRow["status"]) {
    const response = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Mise à jour impossible.");
      return;
    }
    setMessage("Statut de commande mis à jour.");
    await loadOrders();
  }

  async function updateAssignment(id: number, assignedUserId: number | null) {
    const response = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedUserId })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Assignation impossible.");
      return;
    }
    setMessage("Assignation mise à jour.");
    await loadOrders();
  }

  async function addComment(orderId: number) {
    const note = (noteDraft[orderId] ?? "").trim();
    if (!note) {
      setMessage("Ajoutez un commentaire avant envoi.");
      return;
    }
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Commentaire impossible.");
      return;
    }
    setNoteDraft((prev) => ({ ...prev, [orderId]: "" }));
    setMessage("Commentaire ajouté.");
    await loadOrders();
  }

  async function showHistory(orderId: number) {
    setHistoryOrderId(orderId);
    const response = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Historique indisponible.");
      setHistory([]);
      return;
    }
    setHistory(data.data ?? []);
  }

  async function closeOrder(id: number, mode: "standard" | "post_livraison" = "standard") {
    const confirmation = window.confirm(
      mode === "post_livraison"
        ? "Clôturer cette commande déjà livrée ou traitée ? La checklist sera enregistrée comme conforme (prestation / livraison validée)."
        : "Confirmer la clôture de cette commande après validation client ?"
    );
    if (!confirmation) return;
    const checklist =
      mode === "post_livraison"
        ? {
            clientValidationOk: true,
            reportSentOk: true,
            proofAttachedOk: true,
            proofUrl: closureDraft[id]?.proofUrl ?? ""
          }
        : (closureDraft[id] ?? {
            clientValidationOk: false,
            reportSentOk: false,
            proofAttachedOk: false,
            proofUrl: ""
          });
    const response = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        closeOrder: true,
        status: "cloturee",
        closeNote:
          mode === "post_livraison"
            ? "Clôturée après livraison ou fin de prestation (checklist administrative)."
            : "Clôturée après accord client.",
        closureChecklist: checklist
      })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message ?? "Clôture impossible.");
      return;
    }
    setMessage("Commande clôturée avec succès.");
    await loadOrders();
  }

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 p-5">
      <h2 className="font-heading text-xl font-bold text-haitechBlue">Commandes clients</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-5">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "" | OrderRow["status"])}
          className="rounded border p-2 text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="nouvelle">Nouvelle</option>
          <option value="en_cours">En cours</option>
          <option value="en_attente_client">En attente client</option>
          <option value="validee_client">Validée client</option>
          <option value="livree">Livrée</option>
          <option value="traitee">Traitée</option>
          <option value="cloturee">Clôturée</option>
          <option value="annulee">Annulée</option>
        </select>
        <select value={assignedFilter} onChange={(e) => setAssignedFilter(e.target.value)} className="rounded border p-2 text-sm">
          <option value="">Tous les assignés</option>
          {admins.map((admin) => (
            <option key={admin.id} value={String(admin.id)}>
              {`${admin.nom} ${admin.prenom ?? ""}`.trim()}
            </option>
          ))}
        </select>
        <input type="date" value={fromFilter} onChange={(e) => setFromFilter(e.target.value)} className="rounded border p-2 text-sm" />
        <input type="date" value={toFilter} onChange={(e) => setToFilter(e.target.value)} className="rounded border p-2 text-sm" />
        <select value={closedFilter} onChange={(e) => setClosedFilter(e.target.value as "" | "0" | "1")} className="rounded border p-2 text-sm">
          <option value="">Ouvertes + clôturées</option>
          <option value="0">Ouvertes uniquement</option>
          <option value="1">Clôturées uniquement</option>
        </select>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href="/api/admin/exports/orders" className="rounded-full border px-3 py-1.5 text-xs font-semibold text-haitechBlue">
          Export CSV commandes
        </a>
        <a href="/api/admin/exports/orders/xlsx" className="rounded-full border px-3 py-1.5 text-xs font-semibold text-haitechBlue">
          Export Excel commandes
        </a>
      </div>
      <div className="mt-4 max-w-full touch-pan-x overflow-x-auto overflow-y-visible rounded-xl border border-slate-200 [-webkit-overflow-scrolling:touch]">
        <table className="min-w-[1850px] table-auto text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="px-3 py-2 whitespace-nowrap">Référence</th>
              <th className="px-3 py-2 whitespace-nowrap">Date</th>
              <th className="px-3 py-2 whitespace-nowrap">Catégorie</th>
              <th className="px-3 py-2 min-w-40">Produit</th>
              <th className="px-3 py-2 whitespace-nowrap">Montant</th>
              <th className="px-3 py-2 whitespace-nowrap">Client</th>
              <th className="px-3 py-2 whitespace-nowrap">Contact</th>
              <th className="px-3 py-2 min-w-44">Email</th>
              <th className="px-3 py-2">Assigné à</th>
              <th className="px-3 py-2">Clôture</th>
              <th className="px-3 py-2">Statut</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((row) => (
              <tr key={row.id} className="border-b align-top">
                <td className="px-3 py-2 font-semibold text-haitechBlue">{row.reference_code}</td>
                <td className="px-3 py-2">{new Date(row.created_at).toLocaleString("fr-FR")}</td>
                <td className="px-3 py-2">{row.source_type}</td>
                <td className="px-3 py-2 min-w-40">{row.product_name}</td>
                <td className="px-3 py-2">{Number(row.amount).toLocaleString("fr-FR")} FCFA</td>
                <td className="px-3 py-2">{row.nom}</td>
                <td className="px-3 py-2">{row.contact}</td>
                <td className="px-3 py-2 min-w-44 break-all">{row.email}</td>
                <td className="px-3 py-2">
                  <select
                    value={row.assigned_user_id ?? ""}
                    onChange={(e) => updateAssignment(row.id, e.target.value ? Number(e.target.value) : null)}
                    className="rounded border p-2"
                  >
                    <option value="">Non assignée</option>
                    {admins.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {`${admin.nom} ${admin.prenom ?? ""}`.trim()} ({admin.email})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  {row.is_closed ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                      Clôturée {row.closed_at ? `(${new Date(row.closed_at).toLocaleDateString("fr-FR")})` : ""}
                    </span>
                  ) : (
                    <div className="space-y-1">
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={closureDraft[row.id]?.clientValidationOk ?? false}
                          onChange={(e) =>
                            setClosureDraft((prev) => ({
                              ...prev,
                              [row.id]: {
                                clientValidationOk: e.target.checked,
                                reportSentOk: prev[row.id]?.reportSentOk ?? false,
                                proofAttachedOk: prev[row.id]?.proofAttachedOk ?? false,
                                proofUrl: prev[row.id]?.proofUrl ?? ""
                              }
                            }))
                          }
                        />
                        Validation client
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={closureDraft[row.id]?.reportSentOk ?? false}
                          onChange={(e) =>
                            setClosureDraft((prev) => ({
                              ...prev,
                              [row.id]: {
                                clientValidationOk: prev[row.id]?.clientValidationOk ?? false,
                                reportSentOk: e.target.checked,
                                proofAttachedOk: prev[row.id]?.proofAttachedOk ?? false,
                                proofUrl: prev[row.id]?.proofUrl ?? ""
                              }
                            }))
                          }
                        />
                        Rapport envoyé
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={closureDraft[row.id]?.proofAttachedOk ?? false}
                          onChange={(e) =>
                            setClosureDraft((prev) => ({
                              ...prev,
                              [row.id]: {
                                clientValidationOk: prev[row.id]?.clientValidationOk ?? false,
                                reportSentOk: prev[row.id]?.reportSentOk ?? false,
                                proofAttachedOk: e.target.checked,
                                proofUrl: prev[row.id]?.proofUrl ?? ""
                              }
                            }))
                          }
                        />
                        Preuve jointe
                      </label>
                      <input
                        className="w-44 rounded border p-1 text-xs"
                        placeholder="URL preuve"
                        value={closureDraft[row.id]?.proofUrl ?? ""}
                        onChange={(e) =>
                          setClosureDraft((prev) => ({
                            ...prev,
                            [row.id]: {
                              clientValidationOk: prev[row.id]?.clientValidationOk ?? false,
                              reportSentOk: prev[row.id]?.reportSentOk ?? false,
                              proofAttachedOk: prev[row.id]?.proofAttachedOk ?? false,
                              proofUrl: e.target.value
                            }
                          }))
                        }
                      />
                      <button onClick={() => closeOrder(row.id, "standard")} className="rounded border px-2 py-1 text-xs font-semibold text-haitechBlue">
                        Clôturer
                      </button>
                      {row.status === "livree" || row.status === "traitee" ? (
                        <button
                          type="button"
                          onClick={() => closeOrder(row.id, "post_livraison")}
                          className="mt-1 block w-full rounded border border-emerald-600 px-2 py-1 text-xs font-semibold text-emerald-800"
                        >
                          Clôturer (livraison / prestation OK)
                        </button>
                      ) : null}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2">
                  <select
                    value={row.status}
                    onChange={(e) => updateStatus(row.id, e.target.value as OrderRow["status"])}
                    className="rounded border p-2"
                  >
                    <option value="nouvelle">Nouvelle</option>
                    <option value="en_cours">En cours</option>
                    <option value="en_attente_client">En attente client</option>
                    <option value="validee_client">Validée client</option>
                    <option value="livree">Livrée</option>
                    <option value="traitee">Traitée</option>
                    <option value="cloturee">Clôturée</option>
                    <option value="annulee">Annulée</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <div className="space-y-2">
                    <textarea
                      value={noteDraft[row.id] ?? ""}
                      onChange={(e) => setNoteDraft((prev) => ({ ...prev, [row.id]: e.target.value }))}
                      className="w-52 rounded border p-2 text-xs"
                      placeholder="Commentaire interne"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => addComment(row.id)} className="rounded border px-2 py-1 text-xs font-semibold">
                        Ajouter
                      </button>
                      <button onClick={() => showHistory(row.id)} className="rounded border px-2 py-1 text-xs font-semibold">
                        Historique
                      </button>
                    </div>
                    {row.latest_note ? <p className="max-w-52 text-xs text-slate-600">Dernier: {row.latest_note}</p> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {historyOrderId ? (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-haitechBlue">Historique commande #{historyOrderId}</p>
            <button onClick={() => setHistoryOrderId(null)} className="rounded border px-2 py-1 text-xs">
              Fermer
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {history.length ? (
              history.map((item) => (
                <li key={item.id} className="rounded border border-slate-200 bg-white p-3 text-sm">
                  <p>{item.note}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.actor_name || "Système"} - {new Date(item.created_at).toLocaleString("fr-FR")}
                  </p>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-600">Aucun événement.</li>
            )}
          </ul>
        </div>
      ) : null}
      {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
    </section>
  );
}
