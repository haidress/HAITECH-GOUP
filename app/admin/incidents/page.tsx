import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminIncidentManager } from "@/components/AdminIncidentManager";

export default function AdminIncidentsPage() {
  return (
    <AdminDashboardShell title="Administration - Incidents" description="Gestion du support, priorités et escalades.">
      <section className="space-y-5">
        <AdminIncidentManager />
      </section>
    </AdminDashboardShell>
  );
}
