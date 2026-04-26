import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { getDbPool } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export default async function AdminDashboardPage() {
  const pool = getDbPool();
  const [ordersRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM customer_orders");
  const [ordersByStatusRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT status, COUNT(*) AS total
    FROM customer_orders
    GROUP BY status
    `
  );
  const [leadsRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM leads");
  const [devisRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM devis");
  const [formationsRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM formations");
  const [servicesRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM services");
  const [avgDelayRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT ROUND(AVG(TIMESTAMPDIFF(HOUR, created_at, handled_at)), 1) AS avg_hours
    FROM customer_orders
    WHERE status = 'traitee' AND handled_at IS NOT NULL
    `
  );
  const [topProductsRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT product_name, COUNT(*) AS total
    FROM customer_orders
    WHERE source_type IN ('business_center', 'boutique_it', 'services_it')
    GROUP BY product_name
    ORDER BY total DESC
    LIMIT 3
    `
  );
  const [topFormationsRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT product_name, COUNT(*) AS total
    FROM customer_orders
    WHERE source_type = 'formation'
    GROUP BY product_name
    ORDER BY total DESC
    LIMIT 3
    `
  );
  const [mttrRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT ROUND(AVG(TIMESTAMPDIFF(MINUTE, created_at, updated_at)), 1) AS mttr_minutes
    FROM incident_tickets
    WHERE status IN ('resolu', 'ferme')
    `
  );
  const [remoteRateRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT
      SUM(CASE WHEN resolution_mode IN ('remote', 'hybrid') THEN 1 ELSE 0 END) AS remote_count,
      COUNT(*) AS total_count
    FROM incident_tickets
    `
  );
  const [revisitRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT COUNT(*) AS revisit_count
    FROM incident_tickets
    WHERE escalation_level >= 2
    `
  );
  const [topPannesRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT asset_name, COUNT(*) AS total
    FROM incident_tickets
    WHERE asset_name IS NOT NULL AND asset_name <> ''
    GROUP BY asset_name
    ORDER BY total DESC
    LIMIT 5
    `
  );
  const [slaRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT
      SUM(
        CASE
          WHEN cc.sla_hours IS NOT NULL
               AND TIMESTAMPDIFF(HOUR, i.created_at, i.updated_at) <= cc.sla_hours THEN 1
          ELSE 0
        END
      ) AS in_sla,
      SUM(
        CASE
          WHEN cc.sla_hours IS NOT NULL
               AND TIMESTAMPDIFF(HOUR, i.created_at, i.updated_at) > cc.sla_hours THEN 1
          ELSE 0
        END
      ) AS out_sla
    FROM incident_tickets i
    LEFT JOIN clients c ON c.id = i.client_id
    LEFT JOIN client_contracts cc ON cc.client_id = c.id AND cc.status = 'actif'
    `
  );

  const ordersCount = Number(ordersRows[0]?.total ?? 0);
  const leadsCount = Number(leadsRows[0]?.total ?? 0);
  const devisCount = Number(devisRows[0]?.total ?? 0);
  const formationsCount = Number(formationsRows[0]?.total ?? 0);
  const servicesCount = Number(servicesRows[0]?.total ?? 0);
  const avgDelayHours = Number(avgDelayRows[0]?.avg_hours ?? 0);
  const ordersByStatus = new Map(ordersByStatusRows.map((row) => [row.status, Number(row.total)]));
  const newOrders = ordersByStatus.get("nouvelle") ?? 0;
  const inProgressOrders = ordersByStatus.get("en_cours") ?? 0;
  const treatedOrders = ordersByStatus.get("traitee") ?? 0;
  const leadToDevis = leadsCount > 0 ? ((devisCount / leadsCount) * 100).toFixed(1) : "0.0";
  const devisToOrder = devisCount > 0 ? ((ordersCount / devisCount) * 100).toFixed(1) : "0.0";
  const mttrMinutes = Number(mttrRows[0]?.mttr_minutes ?? 0);
  const remoteCount = Number(remoteRateRows[0]?.remote_count ?? 0);
  const totalIncidents = Number(remoteRateRows[0]?.total_count ?? 0);
  const remoteRate = totalIncidents > 0 ? ((remoteCount / totalIncidents) * 100).toFixed(1) : "0.0";
  const revisitCount = Number(revisitRows[0]?.revisit_count ?? 0);
  const inSla = Number(slaRows[0]?.in_sla ?? 0);
  const outSla = Number(slaRows[0]?.out_sla ?? 0);

  return (
    <AdminDashboardShell
      title="Dashboard Administrateur"
      description="Pilotage operationnel HAITECH GROUP"
      currentPath="/admin"
    >
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-haitechBlue p-5 text-white">
                <p className="text-xs uppercase tracking-wide">Commandes</p>
                <p className="mt-2 text-4xl font-extrabold">{ordersCount}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">Leads</p>
                <p className="mt-2 text-4xl font-extrabold text-haitechBlue">{leadsCount}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">Devis</p>
                <p className="mt-2 text-4xl font-extrabold text-haitechBlue">{devisCount}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">Catalogue</p>
                <p className="mt-2 text-4xl font-extrabold text-haitechBlue">{servicesCount + formationsCount}</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-heading text-lg font-bold text-haitechBlue">KPI & Conversions</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                    <p>Nouvelles: {newOrders}</p>
                    <p>En cours: {inProgressOrders}</p>
                    <p>Traitées: {treatedOrders}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                    <p>Lead → Devis: {leadToDevis}%</p>
                    <p>Devis → Commande: {devisToOrder}%</p>
                    <p>Délai moyen: {avgDelayHours || 0}h</p>
                    <p>MTTR incidents: {mttrMinutes || 0} min</p>
                    <p>Résolution remote: {remoteRate}%</p>
                    <p>Taux revisite: {totalIncidents > 0 ? ((revisitCount / totalIncidents) * 100).toFixed(1) : "0.0"}%</p>
                    <p>SLA: {inSla} dans SLA / {outSla} hors SLA</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <a href="/api/admin/exports/orders/xlsx" className="rounded-full border px-3 py-1.5 font-semibold text-haitechBlue">Commandes Excel</a>
                  <a href="/api/admin/exports/leads/xlsx" className="rounded-full border px-3 py-1.5 font-semibold text-haitechBlue">Leads Excel</a>
                  <a href="/api/admin/exports/devis/xlsx" className="rounded-full border px-3 py-1.5 font-semibold text-haitechBlue">Devis Excel</a>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-heading text-lg font-bold text-haitechBlue">Performance</h3>
                <div className="mt-4 flex justify-center">
                  <div
                    className="h-36 w-36 rounded-full"
                    style={{
                      background: `conic-gradient(#0A2A5E 0 ${(Number(devisToOrder) / 100) * 360}deg, #D4A017 ${(Number(devisToOrder) / 100) * 360}deg 360deg)`
                    }}
                  >
                    <div className="m-5 flex h-26 w-26 items-center justify-center rounded-full bg-white text-center text-sm font-semibold text-haitechBlue">
                      {devisToOrder}%<br />de conversion
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-heading text-lg font-bold text-haitechBlue">Top produits</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {topProductsRows.length ? (
                    topProductsRows.map((row) => (
                      <li key={row.product_name}>
                        {row.product_name} - <span className="font-semibold">{row.total}</span> commande(s)
                      </li>
                    ))
                  ) : (
                    <li>Aucune donnée.</li>
                  )}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-heading text-lg font-bold text-haitechBlue">Top formations</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {topFormationsRows.length ? (
                    topFormationsRows.map((row) => (
                      <li key={row.product_name}>
                        {row.product_name} - <span className="font-semibold">{row.total}</span> commande(s)
                      </li>
                    ))
                  ) : (
                    <li>Aucune donnée.</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-heading text-lg font-bold text-haitechBlue">Top pannes machine</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {topPannesRows.length ? (
                  topPannesRows.map((row) => (
                    <li key={String(row.asset_name)}>
                      {String(row.asset_name)} - <span className="font-semibold">{Number(row.total)}</span> incident(s)
                    </li>
                  ))
                ) : (
                  <li>Aucune donnée.</li>
                )}
              </ul>
            </div>
    </AdminDashboardShell>
  );
}
