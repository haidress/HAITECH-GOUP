import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminDocumentsManager } from "@/components/AdminDocumentsManager";

export default function AdminDocumentsPage() {
  return (
    <AdminDashboardShell title="Administration - Documents" description="Centralisez les livrables clients et gérez leur visibilité.">
      <section className="space-y-5">
        <AdminDocumentsManager />
      </section>
    </AdminDashboardShell>
  );
}
