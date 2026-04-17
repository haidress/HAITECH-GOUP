"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthUser } from "@/components/AuthUserProvider";

export function AccountMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, refreshUser } = useAuthUser();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!open) return;
      const el = rootRef.current;
      if (!el) return;
      const target = event.target as Node | null;
      if (target && el.contains(target)) return;
      setOpen(false);
    }

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const roleLinks = useMemo(() => {
    if (!user) return [];
    if (user.role === "admin") return [{ href: "/admin/leads", label: "Dashboard admin" }];
    if (user.role === "client") return [{ href: "/espace-client", label: "Mon espace client" }];
    if (user.role === "technicien") return [{ href: "/technicien", label: "Mon dashboard technicien" }];
    return [{ href: "/elearning", label: "Mon espace formation" }];
  }, [user]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setOpen(false);
    await refreshUser();
    window.dispatchEvent(new Event("haitech-auth-changed"));
    router.refresh();
    router.push("/");
  }

  const initials = (() => {
    if (!user) return "";
    const first = user.prenom?.trim()?.[0] ?? user.nom?.trim()?.[0] ?? "";
    const second = user.nom?.trim()?.[0] ?? "";
    return `${first}${second}`.toUpperCase();
  })();

  const roleBadge = (() => {
    if (!user) return null;
    if (user.role === "admin") return { label: "Admin", className: "bg-slate-100 text-slate-700" };
    if (user.role === "client") return { label: "Client", className: "bg-haitechGold/20 text-haitechBlue" };
    if (user.role === "technicien") return { label: "Technicien", className: "bg-emerald-100 text-emerald-700" };
    return { label: "Etudiant", className: "bg-haitechBlue/10 text-haitechBlue" };
  })();

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-haitechBlue transition hover:border-haitechBlue/50 hover:shadow-sm"
        aria-label="Compte utilisateur"
      >
        {user ? (
          <span className="text-sm font-bold text-haitechBlue">{initials}</span>
        ) : (
          <span aria-hidden className="text-lg">
            👤
          </span>
        )}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
            onMouseLeave={() => {
              // laisse le menu ouvert le temps d'interagir; pas de fermeture automatique au survol
            }}
          >
            <div className="bg-gradient-to-r from-haitechBlue to-haitechBlue/80 p-4">
              {user ? (
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sm font-bold text-white">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.prenom ? `${user.prenom} ${user.nom}` : user.nom}
                      </p>
                      {roleBadge ? (
                        <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${roleBadge.className}`}>
                          {roleBadge.label}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-white">Compte</p>
                  <p className="mt-1 text-xs text-white/80">Connectez-vous pour accéder à vos espaces.</p>
                </div>
              )}
            </div>

            <div className="p-2">
              {user ? (
                <>
                  {roleLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/mon-profil"
                    onClick={() => setOpen(false)}
                    className="mt-1 block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Mon profil
                  </Link>
                  <button
                    onClick={logout}
                    className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/inscription"
                    onClick={() => setOpen(false)}
                    className="mt-1 block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Créer un compte
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
