import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminTechniciansManager } from "@/components/AdminTechniciansManager";

export default function AdminTechniciensPage() {
  return (
    <AdminDashboardShell title="Administration - Techniciens" description="Ajoutez et pilotez les techniciens N1/N2/terrain.">
      <section className="space-y-5">
        <AdminTechniciansManager />
      </section>
    </AdminDashboardShell>
  );
}
