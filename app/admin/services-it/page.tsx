import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminItCatalogManager } from "@/components/AdminItCatalogManager";

export default function AdminServicesItPage() {
  return (
    <AdminDashboardShell
      title="Services informatique — catalogue public"
      description="Modifiez les textes, packs et paliers : ils s’affichent immédiatement sur la page « Services informatique » pour tous les visiteurs (après enregistrement)."
    >
      <AdminItCatalogManager />
    </AdminDashboardShell>
  );
}
