import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminOrdersManager } from "@/components/AdminOrdersManager";

export default function AdminCommandesPage() {
  return (
    <AdminDashboardShell
      title="Administration - Commandes"
      description="Suivi et gestion des commandes clients."
      maxWidthClassName="max-w-[118rem]"
    >
      <section className="space-y-5">
        <AdminOrdersManager />
      </section>
    </AdminDashboardShell>
  );
}
