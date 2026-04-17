import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminHomeContentManager } from "@/components/AdminHomeContentManager";

export default function AdminAccueilPage() {
  return (
    <AdminDashboardShell
      title="Contenu page d’accueil"
      description="Bandeau d’actualité, variantes de CTA et date de mise à jour : visibles par tous sur l’accueil après publication."
    >
      <AdminHomeContentManager />
    </AdminDashboardShell>
  );
}
