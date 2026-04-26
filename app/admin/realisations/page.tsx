import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminRealisationsManager } from "@/components/AdminRealisationsManager";

export default function AdminRealisationsPage() {
  return (
    <AdminDashboardShell
      title="Réalisations"
      description="Ajoutez, modifiez et publiez vos projets (logo/visuel, contexte, résultats, liens) sans toucher au code."
    >
      <AdminRealisationsManager />
    </AdminDashboardShell>
  );
}
