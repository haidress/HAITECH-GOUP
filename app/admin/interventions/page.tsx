import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminMaintenanceManager } from "@/components/AdminMaintenanceManager";

export default function AdminInterventionsPage() {
  return (
    <AdminDashboardShell
      title="Administration - Interventions entreprises"
      description="Planifiez les maintenances préventives et tous les services souscrits par les entreprises."
    >
      <section className="space-y-5">
        <AdminMaintenanceManager />
      </section>
    </AdminDashboardShell>
  );
}
