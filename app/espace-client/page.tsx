import { PageHero } from "@/components/PageHero";
import { ClientSupportCenter } from "@/components/ClientSupportCenter";
import { NpsFeedbackWidget } from "@/components/NpsFeedbackWidget";
import { getCurrentUser } from "@/lib/auth";
import { getDbPool } from "@/lib/db";
import { RowDataPacket } from "mysql2";

type ClientProfileRow = RowDataPacket & {
  client_id: number | null;
  type_client: "particulier" | "entreprise" | null;
  entreprise: string | null;
};

type OrderRow = RowDataPacket & {
  id: number;
  reference_code: string | null;
  source_type: "business_center" | "boutique_it" | "formation" | "services_it";
  product_name: string;
  amount: number;
  status: "nouvelle" | "en_cours" | "en_attente_client" | "validee_client" | "livree" | "traitee" | "cloturee" | "annulee";
  created_at: string;
  last_status_at: string | null;
  is_closed: number;
};

type InterventionRow = RowDataPacket & {
  id: number;
  titre: string;
  details: string | null;
  intervention_type: "preventive" | "corrective" | "installation" | "audit";
  statut: "planifiee" | "en_cours" | "terminee" | "reportee";
  scheduled_at: string;
};

type ContractRow = RowDataPacket & {
  id: number;
  contract_name: string;
  sla_hours: number;
  start_date: string;
  end_date: string;
  auto_renew: number;
  status: "actif" | "expire" | "resilie";
};

type DocumentRow = RowDataPacket & {
  id: number;
  title: string;
  doc_type: string;
  file_url: string;
  created_at: string;
};

type TicketRow = RowDataPacket & {
  id: number;
  title: string;
  priority: "basse" | "moyenne" | "haute" | "critique";
  status: "ouvert" | "en_cours" | "en_attente_client" | "resolu" | "ferme";
  escalation_level: number;
  updated_at: string;
  remote_possible: number;
  remote_session_link: string | null;
  onsite_required: number;
  onsite_scheduled_at: string | null;
  resolution_mode: "pending" | "remote" | "onsite" | "hybrid";
  asset_name: string | null;
};

type NpsRow = RowDataPacket & {
  score: number;
};

function formatStatusLabel(status: OrderRow["status"]) {
  if (status === "nouvelle") return "Nouvelle";
  if (status === "en_cours") return "En cours";
  if (status === "en_attente_client") return "En attente client";
  if (status === "validee_client") return "Validée client";
  if (status === "livree") return "Livrée";
  if (status === "traitee") return "Traitée";
  if (status === "cloturee") return "Clôturée";
  return "Annulée";
}

function formatInterventionType(type: InterventionRow["intervention_type"]) {
  if (type === "preventive") return "Maintenance préventive";
  if (type === "corrective") return "Maintenance corrective";
  if (type === "installation") return "Installation";
  return "Audit";
}

function formatInterventionStatus(status: InterventionRow["statut"]) {
  if (status === "planifiee") return "Planifiée";
  if (status === "en_cours") return "En cours";
  if (status === "terminee") return "Terminée";
  return "Reportée";
}

export default async function EspaceClientPage() {
  const user = await getCurrentUser();
  const pool = getDbPool();

  const [clientRows] = await pool.query<ClientProfileRow[]>(
    `
    SELECT c.id AS client_id, c.type_client, c.entreprise
    FROM clients c
    WHERE c.user_id = ?
    LIMIT 1
    `,
    [user?.id ?? 0]
  );

  const clientProfile = clientRows[0] ?? null;
  const [orderRows] = await pool.query<OrderRow[]>(
    `
    SELECT id, reference_code, source_type, product_name, amount, status, created_at, last_status_at, is_closed
    FROM customer_orders
    WHERE email = ?
    ORDER BY created_at DESC
    LIMIT 20
    `,
    [user?.email ?? ""]
  );

  let interventionRows: InterventionRow[] = [];
  let contractRows: ContractRow[] = [];
  let documentRows: DocumentRow[] = [];
  let ticketRows: TicketRow[] = [];
  let healthScore = 100;
  let npsAverage = 0;
  let machineHistoryRows: Array<{ asset_name: string; incidents: number; last_incident_at: string }> = [];
  let partsRows: Array<{ part_name: string; quantity: number }> = [];
  if (clientProfile?.client_id) {
    const [rows] = await pool.query<InterventionRow[]>(
      `
      SELECT id, titre, details, intervention_type, statut, scheduled_at
      FROM maintenance_interventions
      WHERE client_id = ?
      ORDER BY scheduled_at ASC
      LIMIT 20
      `,
      [clientProfile.client_id]
    );
    interventionRows = rows;

    const [contracts] = await pool.query<ContractRow[]>(
      `
      SELECT id, contract_name, sla_hours, start_date, end_date, auto_renew, status
      FROM client_contracts
      WHERE client_id = ?
      ORDER BY start_date DESC
      `,
      [clientProfile.client_id]
    );
    contractRows = contracts;

    const [documents] = await pool.query<DocumentRow[]>(
      `
      SELECT id, title, doc_type, file_url, created_at
      FROM client_documents
      WHERE client_id = ? AND visible_to_client = 1
      ORDER BY created_at DESC
      LIMIT 30
      `,
      [clientProfile.client_id]
    );
    documentRows = documents;

    const [tickets] = await pool.query<TicketRow[]>(
      `
      SELECT id, title, priority, status, escalation_level, updated_at,
             remote_possible, remote_session_link, onsite_required, onsite_scheduled_at, resolution_mode, asset_name
      FROM incident_tickets
      WHERE client_id = ?
      ORDER BY updated_at DESC
      LIMIT 20
      `,
      [clientProfile.client_id]
    );
    ticketRows = tickets;
    const [machineHistory] = await pool.query<RowDataPacket[]>(
      `
      SELECT asset_name, COUNT(*) AS incidents, MAX(updated_at) AS last_incident_at
      FROM incident_tickets
      WHERE client_id = ? AND asset_name IS NOT NULL AND asset_name <> ''
      GROUP BY asset_name
      ORDER BY incidents DESC
      `,
      [clientProfile.client_id]
    );
    machineHistoryRows = machineHistory.map((row) => ({
      asset_name: String(row.asset_name),
      incidents: Number(row.incidents),
      last_incident_at: String(row.last_incident_at)
    }));
    const [parts] = await pool.query<RowDataPacket[]>(
      `
      SELECT ip.part_name, SUM(ip.quantity) AS quantity
      FROM intervention_parts ip
      INNER JOIN maintenance_interventions mi ON mi.id = ip.intervention_id
      WHERE mi.client_id = ?
      GROUP BY ip.part_name
      ORDER BY quantity DESC
      LIMIT 10
      `,
      [clientProfile.client_id]
    );
    partsRows = parts.map((row) => ({ part_name: String(row.part_name), quantity: Number(row.quantity) }));

    const [npsRows] = await pool.query<NpsRow[]>(
      `
      SELECT AVG(score) AS score
      FROM nps_feedback
      WHERE client_id = ?
      `,
      [clientProfile.client_id]
    );
    npsAverage = Number(npsRows[0]?.score ?? 0);
  }

  const enterpriseView = clientProfile?.type_client === "entreprise";
  const activeOrders = orderRows.filter((order) => order.status === "nouvelle" || order.status === "en_cours").length;
  const openIncidents = ticketRows.filter((ticket) => ticket.status !== "resolu" && ticket.status !== "ferme").length;
  const remoteReadyIncidents = ticketRows.filter((ticket) => ticket.remote_possible).length;
  const onsiteIncidents = ticketRows.filter((ticket) => ticket.onsite_required).length;
  const delayedInterventions = interventionRows.filter((item) => item.statut === "reportee").length;
  healthScore = Math.max(0, 100 - openIncidents * 10 - delayedInterventions * 15);

  const timelineItems = [
    ...orderRows.map((item) => ({
      id: `order-${item.id}`,
      date: new Date(item.last_status_at ?? item.created_at).getTime(),
      label: `Commande ${item.reference_code ?? item.id}: ${formatStatusLabel(item.status)}`
    })),
    ...interventionRows.map((item) => ({
      id: `intervention-${item.id}`,
      date: new Date(item.scheduled_at).getTime(),
      label: `Intervention ${item.titre}: ${formatInterventionStatus(item.statut)}`
    })),
    ...ticketRows.map((item) => ({
      id: `ticket-${item.id}`,
      date: new Date(item.updated_at).getTime(),
      label: `Incident #${item.id} ${item.title}: ${item.status}`
    }))
  ].sort((a, b) => b.date - a.date);

  return (
    <div>
      <PageHero
        title="Espace client sécurisé"
        description="Suivez vos commandes, votre historique et vos interventions en temps réel."
      />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Commandes en cours</p>
            <p className="mt-2 text-3xl font-extrabold text-haitechBlue">{activeOrders}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total commandes</p>
            <p className="mt-2 text-3xl font-extrabold text-haitechBlue">{orderRows.length}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Profil</p>
            <p className="mt-2 text-lg font-bold text-haitechBlue">
              {enterpriseView ? clientProfile?.entreprise || "Entreprise" : "Particulier"}
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Incidents ouverts</p>
            <p className="mt-2 text-3xl font-extrabold text-haitechBlue">{openIncidents}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Incidents traitables à distance</p>
            <p className="mt-2 text-3xl font-extrabold text-haitechBlue">{remoteReadyIncidents}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Déplacements techniques</p>
            <p className="mt-2 text-3xl font-extrabold text-haitechBlue">{onsiteIncidents}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Score santé compte</p>
            <p className="mt-2 text-3xl font-extrabold text-haitechBlue">{healthScore}/100</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">NPS moyen</p>
            <p className="mt-2 text-3xl font-extrabold text-haitechBlue">{npsAverage ? npsAverage.toFixed(1) : "-"}</p>
          </article>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-heading text-xl font-bold text-haitechBlue">Mes commandes</h3>
          {orderRows.length ? (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 pr-4">Référence</th>
                    <th className="py-2 pr-4">Produit</th>
                    <th className="py-2 pr-4">Canal</th>
                    <th className="py-2 pr-4">Montant</th>
                    <th className="py-2 pr-4">Statut</th>
                    <th className="py-2">Dernière mise à jour</th>
                  </tr>
                </thead>
                <tbody>
                  {orderRows.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-semibold text-haitechBlue">{order.reference_code ?? "-"}</td>
                      <td className="py-2 pr-4">{order.product_name}</td>
                      <td className="py-2 pr-4">{order.source_type.replace("_", " ")}</td>
                      <td className="py-2 pr-4">{Number(order.amount).toLocaleString("fr-FR")} XOF</td>
                      <td className="py-2 pr-4">{formatStatusLabel(order.status)}</td>
                      <td className="py-2">{new Date(order.last_status_at ?? order.created_at).toLocaleDateString("fr-FR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">Aucune commande trouvée pour le moment.</p>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-heading text-xl font-bold text-haitechBlue">Historique machine</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">Incidents récurrents par machine</p>
              <ul className="mt-2 space-y-2 text-sm">
                {machineHistoryRows.map((row) => (
                  <li key={row.asset_name} className="rounded-xl border border-slate-200 p-3">
                    <p className="font-semibold text-haitechBlue">{row.asset_name}</p>
                    <p>{row.incidents} incident(s) | dernier: {new Date(row.last_incident_at).toLocaleDateString("fr-FR")}</p>
                  </li>
                ))}
                {!machineHistoryRows.length ? <li className="text-slate-600">Aucune machine historisée pour l&apos;instant.</li> : null}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Pièces changées (historique)</p>
              <ul className="mt-2 space-y-2 text-sm">
                {partsRows.map((row) => (
                  <li key={row.part_name} className="rounded-xl border border-slate-200 p-3">
                    <p className="font-semibold text-haitechBlue">{row.part_name}</p>
                    <p>Quantité totale: {row.quantity}</p>
                  </li>
                ))}
                {!partsRows.length ? <li className="text-slate-600">Aucune pièce remplacée enregistrée.</li> : null}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-heading text-xl font-bold text-haitechBlue">Contrats & SLA</h3>
          {contractRows.length ? (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 pr-4">Contrat</th>
                    <th className="py-2 pr-4">SLA</th>
                    <th className="py-2 pr-4">Période</th>
                    <th className="py-2 pr-4">Renouvellement</th>
                    <th className="py-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {contractRows.map((contract) => (
                    <tr key={contract.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-semibold text-haitechBlue">{contract.contract_name}</td>
                      <td className="py-2 pr-4">{contract.sla_hours}h</td>
                      <td className="py-2 pr-4">
                        {new Date(contract.start_date).toLocaleDateString("fr-FR")} - {new Date(contract.end_date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-2 pr-4">{contract.auto_renew ? "Automatique" : "Manuel"}</td>
                      <td className="py-2">{contract.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">Aucun contrat actif pour l&apos;instant.</p>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-heading text-xl font-bold text-haitechBlue">
            {enterpriseView ? "Planning interventions & maintenance" : "Suivi interventions"}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {enterpriseView
              ? "Visibilité sur les dates d'intervention planifiées, préventives ou correctives."
              : "Suivi des prestations techniques prévues sur votre compte client."}
          </p>
          {interventionRows.length ? (
            <div className="mt-4 space-y-3">
              {interventionRows.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-haitechBlue">{item.titre}</p>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {formatInterventionStatus(item.statut)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{formatInterventionType(item.intervention_type)}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Date prévue: {new Date(item.scheduled_at).toLocaleString("fr-FR")}
                  </p>
                  {item.details ? <p className="mt-2 text-sm text-slate-600">{item.details}</p> : null}
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              Aucun créneau planifié pour le moment. Votre chargé de compte HAITECH vous notifiera ici.
            </p>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-heading text-xl font-bold text-haitechBlue">Vue calendrier (mensuel/hebdo)</h3>
          <p className="mt-1 text-sm text-slate-600">Prochains créneaux planifiés (triés par date).</p>
          <div className="mt-4 space-y-2">
            {interventionRows.slice(0, 10).map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-3 text-sm">
                <p className="font-semibold text-haitechBlue">{item.titre}</p>
                <p>{new Date(item.scheduled_at).toLocaleString("fr-FR")} - {formatInterventionStatus(item.statut)}</p>
              </div>
            ))}
            {!interventionRows.length ? <p className="text-sm text-slate-600">Aucune intervention planifiée.</p> : null}
          </div>
        </div>

        <ClientSupportCenter />

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-heading text-xl font-bold text-haitechBlue">Suivi incidents machine (remote / déplacement)</h3>
          <div className="mt-4 space-y-2">
            {ticketRows.map((ticket) => (
              <article key={ticket.id} className="rounded-xl border border-slate-200 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-haitechBlue">
                    Incident #{ticket.id} - {ticket.title}
                  </p>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{ticket.resolution_mode}</span>
                </div>
                <p className="mt-1 text-slate-600">
                  {ticket.remote_possible ? "Diagnostic à distance possible" : "Intervention à distance non possible"} | statut {ticket.status}
                </p>
                {ticket.remote_session_link ? (
                  <a href={ticket.remote_session_link} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-semibold text-haitechBlue underline">
                    Ouvrir la session distante
                  </a>
                ) : null}
                {ticket.onsite_required && ticket.onsite_scheduled_at ? (
                  <p className="mt-1 text-xs text-amber-700">
                    Déplacement planifié le {new Date(ticket.onsite_scheduled_at).toLocaleString("fr-FR")}
                  </p>
                ) : null}
              </article>
            ))}
            {!ticketRows.length ? <p className="text-sm text-slate-600">Aucun incident signalé.</p> : null}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-heading text-xl font-bold text-haitechBlue">Espace documents</h3>
          <p className="mt-1 text-sm text-slate-600">Bons d&apos;intervention, rapports PDF, PV de recette, devis, factures.</p>
          <div className="mt-4 space-y-2">
            {documentRows.map((doc) => (
              <a
                key={doc.id}
                href={doc.file_url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-slate-200 p-3 text-sm transition hover:bg-slate-50"
              >
                <span className="font-semibold text-haitechBlue">{doc.title}</span> - {doc.doc_type} - {new Date(doc.created_at).toLocaleDateString("fr-FR")}
              </a>
            ))}
            {!documentRows.length ? <p className="text-sm text-slate-600">Aucun document disponible.</p> : null}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-heading text-xl font-bold text-haitechBlue">Timeline unique</h3>
          <p className="mt-1 text-sm text-slate-600">Historique unifié commandes, interventions et incidents.</p>
          <ul className="mt-4 space-y-2">
            {timelineItems.slice(0, 25).map((item) => (
              <li key={item.id} className="rounded-xl border border-slate-200 p-3 text-sm">
                <p>{item.label}</p>
                <p className="mt-1 text-xs text-slate-500">{new Date(item.date).toLocaleString("fr-FR")}</p>
              </li>
            ))}
            {!timelineItems.length ? <li className="text-sm text-slate-600">Aucun événement.</li> : null}
          </ul>
        </div>

        <NpsFeedbackWidget />
      </section>
    </div>
  );
}
