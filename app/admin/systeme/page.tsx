import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminRoleManager } from "@/components/AdminRoleManager";
import { checkDatabaseHealth, checkRedisHealth, getSmtpConfigSummary, listRecentMigrations } from "@/lib/system-health";
import { getDbPool } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

export default async function AdminSystemePage() {
  const pool = getDbPool();
  const [db, migrations, redis, smtp] = await Promise.all([
    checkDatabaseHealth(),
    listRecentMigrations(15),
    checkRedisHealth(),
    Promise.resolve(getSmtpConfigSummary())
  ]);
  const [followupRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT day_mark, channel, status, COUNT(*) AS total
    FROM order_followup_logs
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY day_mark, channel, status
    ORDER BY day_mark ASC, channel ASC
    `
  );

  return (
    <AdminDashboardShell
      title="État du système"
      description="Base de données, migrations, Redis (Upstash), e-mail sortant et indicateurs d’exploitation."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 p-5">
          <h2 className="font-heading text-lg font-bold text-haitechBlue">Base MySQL</h2>
          {db.ok ? (
            <p className="mt-2 text-sm text-slate-700">
              Connexion OK — latence environ <strong>{db.latencyMs} ms</strong>.
            </p>
          ) : (
            <p className="mt-2 text-sm text-red-600">{db.message}</p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 p-5">
          <h2 className="font-heading text-lg font-bold text-haitechBlue">Redis (Upstash)</h2>
          {!redis.configured ? (
            <p className="mt-2 text-sm text-amber-700">{redis.message}</p>
          ) : redis.ok ? (
            <p className="mt-2 text-sm text-slate-700">
              PING OK — latence environ <strong>{redis.latencyMs} ms</strong>.
            </p>
          ) : (
            <p className="mt-2 text-sm text-red-600">{redis.message}</p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 p-5 md:col-span-2">
          <h2 className="font-heading text-lg font-bold text-haitechBlue">SMTP (file sortante)</h2>
          <p className="mt-2 text-sm text-slate-700">
            Configuration : {smtp.configured ? "complète" : "incomplète"} — expéditeur par défaut{" "}
            <code className="rounded bg-slate-100 px-1">{smtp.from}</code>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Il n&apos;y a pas de file persistante dans l&apos;app : les envois sont immédiats via Nodemailer lorsque SMTP_HOST /
            SMTP_USER / SMTP_PASS sont définis.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 p-5 md:col-span-2">
          <h2 className="font-heading text-lg font-bold text-haitechBlue">Dernières migrations appliquées</h2>
          {migrations.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">Aucune entrée (table schema_migrations absente ou vide).</p>
          ) : (
            <ul className="mt-3 max-h-56 overflow-auto text-left text-sm text-slate-700">
              {migrations.map((m) => (
                <li key={m.filename} className="border-b border-slate-100 py-1">
                  <span className="font-mono text-xs">{m.filename}</span>
                  <span className="ml-2 text-xs text-slate-500">
                    {new Date(m.applied_at).toLocaleString("fr-FR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:col-span-2">
          <h2 className="font-heading text-lg font-bold text-haitechBlue">Crons & maintenance</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
            <li>
              <code className="rounded bg-white px-1">CRON_SECRET</code> : Bearer pour les routes{" "}
              <code className="rounded bg-white px-1">/api/cron/*</code>
            </li>
            <li>
              Relances leads : <code className="rounded bg-white px-1">POST ou GET /api/cron/lead-followups</code>
            </li>
            <li>
              Relances commandes J+1/J+3/J+7 : <code className="rounded bg-white px-1">POST /api/cron/orders-followups</code>
            </li>
            <li>
              Export CSV planifié : <code className="rounded bg-white px-1">GET /api/cron/leads-export</code>
            </li>
            <li>
              Purge rétention leads : <code className="rounded bg-white px-1">POST /api/cron/leads-retention-purge</code>{" "}
              (paramètre <code className="rounded bg-white px-1">leads_retention_days</code> dans settings)
            </li>
            <li>
              Mode maintenance : <code className="rounded bg-white px-1">MAINTENANCE_MODE=true</code> (admin et APIs
              internes restent joignables)
            </li>
          </ul>
        </section>
        <section className="rounded-2xl border border-slate-200 p-5 md:col-span-2">
          <h2 className="font-heading text-lg font-bold text-haitechBlue">Monitoring relances commandes (30 jours)</h2>
          {followupRows.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">Aucune relance enregistrée.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-3 py-2">Jour</th>
                    <th className="px-3 py-2">Canal</th>
                    <th className="px-3 py-2">Statut</th>
                    <th className="px-3 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(followupRows as Array<{ day_mark: number; channel: string; status: string; total: number }>).map((row) => (
                    <tr key={`${row.day_mark}-${row.channel}-${row.status}`} className="border-b">
                      <td className="px-3 py-2">J+{row.day_mark}</td>
                      <td className="px-3 py-2">{row.channel}</td>
                      <td className="px-3 py-2">{row.status}</td>
                      <td className="px-3 py-2">{Number(row.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <div className="md:col-span-2">
          <AdminRoleManager />
        </div>
      </div>
    </AdminDashboardShell>
  );
}
