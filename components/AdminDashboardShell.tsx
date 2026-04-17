import Image from "next/image";
import { AdminSessionBar } from "@/components/AdminSessionBar";

export function AdminDashboardShell({
  title,
  description,
  children,
  maxWidthClassName
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  maxWidthClassName?: string;
}) {
  return (
    <div className="relative overflow-x-auto overflow-y-visible bg-slate-100 px-4 py-10">
      <Image
        src="/admin-bg.jpg"
        alt="Fond dashboard HAITECH"
        fill
        className="pointer-events-none object-cover opacity-10"
        priority
      />
      <div className="pointer-events-none absolute inset-0 bg-slate-100/80" />
      <section
        className={`relative z-10 mx-auto w-full max-w-full ${maxWidthClassName ?? "max-w-7xl"} overflow-x-auto overflow-y-visible rounded-3xl border border-slate-200 bg-white shadow-2xl`}
      >
        <div className="grid min-w-0 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="relative overflow-hidden bg-haitechBlue p-6 text-white">
            <Image src="/admin-bg.jpg" alt="Structure dashboard" fill className="object-cover opacity-20" />
            <div className="relative z-10">
              <div className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-slate-200">Profil admin</p>
                <p className="mt-2 font-heading text-xl font-bold">HAITECH GROUP</p>
                <p className="text-sm text-slate-100">Pilotage commercial</p>
              </div>
              <nav className="mt-6 space-y-2 text-sm">
                <a href="/admin" className="block rounded-xl border border-white/20 px-3 py-2">
                  Dashboard
                </a>
                <a href="/admin/accueil" className="block rounded-xl border border-white/20 px-3 py-2">
                  Contenu accueil
                </a>
                <a href="/admin/commandes" className="block rounded-xl border border-white/20 px-3 py-2">
                  Commandes
                </a>
                <a href="/admin/interventions" className="block rounded-xl border border-white/20 px-3 py-2">
                  Interventions
                </a>
                <a href="/admin/incidents" className="block rounded-xl border border-white/20 px-3 py-2">
                  Incidents
                </a>
                <a href="/admin/documents" className="block rounded-xl border border-white/20 px-3 py-2">
                  Documents
                </a>
                <a href="/admin/techniciens" className="block rounded-xl border border-white/20 px-3 py-2">
                  Techniciens
                </a>
                <a href="/admin/catalogue" className="block rounded-xl border border-white/20 px-3 py-2">
                  Catalogue
                </a>
                <a href="/admin/services-it" className="block rounded-xl border border-white/20 px-3 py-2">
                  Catalogue IT (site)
                </a>
                <a href="/admin/leads" className="block rounded-xl border border-white/20 px-3 py-2">
                  Leads
                </a>
                <a href="/admin/devis" className="block rounded-xl border border-white/20 px-3 py-2">
                  Devis
                </a>
              </nav>
            </div>
          </aside>

          <div className="min-w-0 space-y-5 p-5 md:p-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h1 className="font-heading text-2xl font-bold text-haitechBlue">{title}</h1>
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            </div>
            <AdminSessionBar />
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
