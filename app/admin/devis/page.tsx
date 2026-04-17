import { AdminDashboardShell } from "@/components/AdminDashboardShell";
import { AdminDevisManager } from "@/components/AdminDevisManager";
import { getDbPool } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export default async function AdminDevisPage() {
  const pool = getDbPool();
  const [leadRows] = await pool.query<RowDataPacket[]>(
    "SELECT id, nom, email FROM leads ORDER BY created_at DESC LIMIT 200"
  );

  return (
    <AdminDashboardShell title="Administration - Devis" description="Création de devis multi-services et export PDF.">
      <section className="space-y-5">
        <div>
          <a href="/api/admin/exports/devis" className="rounded-full border px-4 py-2 text-xs font-semibold text-haitechBlue">
            Export CSV devis
          </a>
          <a
            href="/api/admin/exports/devis/xlsx"
            className="ml-2 rounded-full border px-4 py-2 text-xs font-semibold text-haitechBlue"
          >
            Export Excel devis
          </a>
        </div>
        <AdminDevisManager initialLeads={leadRows as unknown as Array<{ id: number; nom: string; email: string }>} />
      </section>
    </AdminDashboardShell>
  );
}
