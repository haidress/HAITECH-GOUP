import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminBlogManager } from "@/components/AdminBlogManager";

export default function AdminBlogPage() {
  return (
    <AdminDashboardShell
      title="Blog SEO"
      description="Rédigez, planifiez et publiez vos articles hebdomadaires. Les pages /blog et /blog/[slug] sont mises à jour automatiquement."
    >
      <AdminBlogManager />
    </AdminDashboardShell>
  );
}
