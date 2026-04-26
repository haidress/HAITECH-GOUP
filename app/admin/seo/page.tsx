import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminPageSeoManager } from "@/components/AdminPageSeoManager";

export default function AdminSeoPage() {
  return (
    <AdminDashboardShell
      title="SEO par page"
      description="Titres, descriptions et Open Graph stockés en base — pris en charge sur les pages qui exposent generateMetadata (ex. accueil, contact)."
    >
      <AdminPageSeoManager />
    </AdminDashboardShell>
  );
}
