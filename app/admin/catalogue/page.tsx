import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminBoutiqueReferenceStockManager } from "@/components/AdminBoutiqueReferenceStockManager";
import { AdminCatalogManager } from "@/components/AdminCatalogManager";
import { AdminBoutiqueProManager } from "@/components/AdminBoutiqueProManager";

export default function AdminCataloguePage() {
  return (
    <AdminDashboardShell
      title="Administration - Catalogue"
      description="Ajoutez, modifiez ou supprimez des produits et formations sans toucher au code."
    >
      <section className="space-y-5">
        <AdminBoutiqueReferenceStockManager />
        <AdminBoutiqueProManager />
        <AdminCatalogManager />
      </section>
    </AdminDashboardShell>
  );
}
