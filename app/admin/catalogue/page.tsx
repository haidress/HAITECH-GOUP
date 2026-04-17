import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminCatalogManager } from "@/components/AdminCatalogManager";

export default function AdminCataloguePage() {
  return (
    <AdminDashboardShell
      title="Administration - Catalogue"
      description="Ajoutez, modifiez ou supprimez des produits et formations sans toucher au code."
    >
      <section className="space-y-5">
        <AdminCatalogManager />
      </section>
    </AdminDashboardShell>
  );
}
