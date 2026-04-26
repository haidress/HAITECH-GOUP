import Link from "next/link";
import Image from "next/image";
import { adminNavItems } from "@/lib/admin-navigation";

export function AdminSidebar({ currentPath = "/admin" }: { currentPath?: string }) {
  return (
    <aside className="relative overflow-hidden bg-haitechBlue p-6 text-white">
      <Image src="/admin-bg.jpg" alt="Structure dashboard" fill className="object-cover opacity-20" />
      <div className="relative z-10">
        <div className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur">
          <p className="text-xs uppercase tracking-wide text-slate-200">Profil admin</p>
          <p className="mt-2 font-heading text-xl font-bold">HAITECH GROUP</p>
          <p className="text-sm text-slate-100">Pilotage commercial</p>
        </div>
        <nav className="mt-6 space-y-2 text-sm" aria-label="Navigation administration">
          {adminNavItems.map((item) => {
            const isCurrent = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                className={`block rounded-xl border px-3 py-2 transition ${
                  isCurrent
                    ? "border-white/60 bg-white/15 font-semibold text-white"
                    : "border-white/20 text-white/95 hover:border-white/40 hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
