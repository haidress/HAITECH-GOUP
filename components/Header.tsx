"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { publicNavLinks, roleNavLinks, whatsappLink } from "@/components/site-data";
import { AccountMenu } from "@/components/AccountMenu";
import { useAuthUser } from "@/components/AuthUserProvider";

export function Header() {
  const { user } = useAuthUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = useMemo(() => {
    if (!user) return publicNavLinks;
    return [...publicNavLinks, ...roleNavLinks[user.role]];
  }, [user]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3 font-heading text-xl font-extrabold text-haitechBlue">
          <Image src="/logo-haitech.jpg" alt="Logo HAITECH GROUP" width={44} height={44} className="rounded-full" />
          <span>HAITECH GROUP</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 lg:flex">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-haitechBlue">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-haitechGold px-4 py-2 text-sm font-semibold text-haitechBlue sm:inline-block"
          >
            WhatsApp
          </a>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 text-haitechBlue lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <span className="text-lg">☰</span>
          </button>
          <AccountMenu />
        </div>
      </div>
      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
