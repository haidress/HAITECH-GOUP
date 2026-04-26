import { AdminSessionBar } from "@/components/AdminSessionBar";
import Image from "next/image";
import { AdminSidebar } from "@/components/AdminSidebar";

export function AdminDashboardShell({
  title,
  description,
  children,
  maxWidthClassName,
  currentPath
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  maxWidthClassName?: string;
  currentPath?: string;
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
          <AdminSidebar currentPath={currentPath} />

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
