import { PageHero } from "@/components/PageHero";
import { TechnicianTodayBoard } from "@/components/TechnicianTodayBoard";
import { getCurrentUser } from "@/lib/auth";
import { getDbPool } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export default async function TechnicienDashboardPage() {
  const user = await getCurrentUser();
  const pool = getDbPool();
  const [incidentRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT id, title, priority, status, eta_at, onsite_scheduled_at, resolution_mode
    FROM incident_tickets
    WHERE assigned_technician_user_id = ?
    ORDER BY COALESCE(eta_at, onsite_scheduled_at, updated_at) ASC
    LIMIT 30
    `,
    [user?.id ?? 0]
  );
  const [interventionRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT id, titre, statut, scheduled_at, eta_at, checkin_at, checkout_at
    FROM maintenance_interventions
    WHERE assigned_technician_user_id = ?
    ORDER BY COALESCE(eta_at, scheduled_at) ASC
    LIMIT 30
    `,
    [user?.id ?? 0]
  );

  return (
    <div>
      <PageHero title="Dashboard technicien" description="Vue mobile interventions, check-in/check-out et priorités du jour." />
      <section className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Incidents assignés</p>
            <p className="mt-2 text-3xl font-extrabold text-haitechBlue">{incidentRows.length}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Interventions assignées</p>
            <p className="mt-2 text-3xl font-extrabold text-haitechBlue">{interventionRows.length}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">En cours</p>
            <p className="mt-2 text-3xl font-extrabold text-haitechBlue">
              {interventionRows.filter((item) => item.statut === "en_cours").length + incidentRows.filter((item) => item.status === "en_cours").length}
            </p>
          </article>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-heading text-lg font-bold text-haitechBlue">Interventions terrain</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {interventionRows.map((item) => (
              <li key={`int-${item.id}`} className="rounded-xl border border-slate-200 p-3">
                <p className="font-semibold text-haitechBlue">#{item.id} - {item.titre}</p>
                <p>Statut: {item.statut}</p>
                <p>Prévu: {new Date(item.scheduled_at).toLocaleString("fr-FR")}</p>
                {item.eta_at ? <p>ETA client: {new Date(item.eta_at).toLocaleString("fr-FR")}</p> : null}
              </li>
            ))}
            {!interventionRows.length ? <li>Aucune intervention assignée.</li> : null}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-heading text-lg font-bold text-haitechBlue">Incidents machines</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {incidentRows.map((item) => (
              <li key={`inc-${item.id}`} className="rounded-xl border border-slate-200 p-3">
                <p className="font-semibold text-haitechBlue">#{item.id} - {item.title}</p>
                <p>Priorité: {item.priority} | Statut: {item.status}</p>
                <p>Mode: {item.resolution_mode}</p>
                {item.eta_at ? <p>ETA: {new Date(item.eta_at).toLocaleString("fr-FR")}</p> : null}
              </li>
            ))}
            {!incidentRows.length ? <li>Aucun incident assigné.</li> : null}
          </ul>
        </div>
        <TechnicianTodayBoard />
      </section>
    </div>
  );
}
