import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminLeadTable } from "@/components/AdminLeadTable";
import { listLeads } from "@/lib/leads";

export default async function AdminLeadsPage() {
  const leads = await listLeads();

  return (
    <AdminDashboardShell
      title="Administration - Leads"
      description="Suivi et qualification des prospects entrants (pipeline commercial)."
    >
      <section className="space-y-5">
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
          Module admin initial. Ajout recommandé ensuite: authentification et rôles d&apos;accès.
        </p>
        <AdminLeadTable initialLeads={leads} />
      </section>
    </AdminDashboardShell>
  );
}
