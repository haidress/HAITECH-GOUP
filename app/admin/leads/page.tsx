import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminLeadTable } from "@/components/AdminLeadTable";
import { countLeadsByStatus, listLeads } from "@/lib/leads";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const [leads, counts] = await Promise.all([listLeads(), countLeadsByStatus()]);

  return (
    <AdminDashboardShell
      title="Administration - Leads"
      description="Pipeline, affectation commerciale, anti-doublon e-mail/téléphone sur le formulaire public, relances automatiques (cron)."
    >
      <section className="space-y-5">
        <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
          <span className="font-semibold text-haitechBlue">Volumes par statut</span>
          <span>Nouveau : {counts.nouveau}</span>
          <span>Qualifié : {counts.qualifie}</span>
          <span>Converti : {counts.converti}</span>
          <span>Perdu : {counts.perdu}</span>
        </div>
        <div>
          <a href="/api/admin/exports/leads" className="rounded-full border px-4 py-2 text-xs font-semibold text-haitechBlue">
            Export CSV leads
          </a>
          <a
            href="/api/admin/exports/leads/xlsx"
            className="ml-2 rounded-full border px-4 py-2 text-xs font-semibold text-haitechBlue"
          >
            Export Excel leads
          </a>
        </div>
        <p className="text-sm text-slate-600">
          Export planifié : planifier un appel HTTP <code className="rounded bg-slate-100 px-1">GET /api/cron/leads-export</code>{" "}
          avec en-tête <code className="rounded bg-slate-100 px-1">Authorization: Bearer CRON_SECRET</code>.
        </p>
        <AdminLeadTable initialLeads={leads} />
      </section>
    </AdminDashboardShell>
  );
}
