import Link from "next/link";
import Image from "next/image";
import { whatsappLink } from "@/components/site-data";

export function Footer() {
  const essentialLinks = [
    { href: "/", label: "Accueil" },
    { href: "/technology", label: "Services informatiques" },
    { href: "/business-center", label: "Business Center" },
    { href: "/academy", label: "Formations" },
    { href: "/boutique-it", label: "Boutique IT" },
    { href: "/realisations", label: "Réalisations" },
    { href: "/contact", label: "Contact" }
  ];
  const socialLinks = [
    {
      icon: "FB",
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61575570407341"
    },
    {
      icon: "IG",
      label: "Instagram",
      href: "https://www.instagram.com/haitechgroup?igsh=MWdhZnZ5Z3Q1bGFoMg=="
    },
    {
      icon: "TT",
      label: "TikTok",
      href: "https://www.tiktok.com/@haitech.group?_r=1&_t=ZN-95koua6KHpu"
    },
    {
      icon: "IN",
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/haitech-group/"
    },
    { icon: "WA", label: "WhatsApp", href: whatsappLink }
  ];

  return (
    <footer className="mt-20 bg-haitechBlue text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <div className="flex items-center gap-3">
            <Image src="/logo-haitech.jpg" alt="Logo HAITECH GROUP" width={44} height={44} className="rounded-full" />
            <h3 className="font-heading text-lg font-bold">HAITECH GROUP</h3>
          </div>
          <p className="mt-2 text-sm text-slate-200">Un seul groupe, mille solutions.</p>

          <p className="mt-3 text-sm text-slate-200">📍 Abidjan, Côte d&apos;Ivoire - Cocody, Dokoui</p>
          <p className="mt-3 text-sm text-slate-200">📧 haitechgroupe@gmail.com</p>
          <p className="text-sm text-slate-200">📞 07 89 17 46 19</p>

          <div className="mt-4 grid gap-2 text-xs text-slate-100 sm:grid-cols-2">
            <p>📈 +155 000 abonnés générés (page I VOI RIEN)</p>
            <p>📈 +80 000 abonnés développés (cas clients)</p>
            <p>🤝 Entreprises accompagnées</p>
            <p>⚡ Support rapide &amp; solutions concrètes</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-haitechGold px-4 py-2 text-xs font-semibold text-haitechBlue transition hover:opacity-90"
            >
              Discuter sur WhatsApp maintenant
            </a>
            <Link
              href="/contact"
              className="rounded-full border border-white/40 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white hover:text-haitechBlue"
            >
              Demander un devis rapide
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-base font-semibold">Liens essentiels</h4>
          <div className="mt-2 flex flex-col gap-2 text-sm">
            {essentialLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-haitechGold">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading text-base font-semibold">Suivez-nous</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition hover:text-haitechGold"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/30 text-xs">
                  {item.icon}
                </span>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/15 bg-white/5">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 text-sm text-slate-100 md:grid-cols-3">
          <div>
            <h4 className="font-heading text-base font-semibold text-white">Technologie</h4>
            <ul className="mt-2 space-y-1">
              <li>Développement web &amp; applications</li>
              <li>Maintenance informatique</li>
              <li>Réseaux &amp; cybersécurité</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold text-white">Business &amp; Communication</h4>
            <ul className="mt-2 space-y-1">
              <li>Création de visuels</li>
              <li>Community management</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold text-white">Formation (HAITECH Academy)</h4>
            <ul className="mt-2 space-y-1">
              <li>Bureautique &amp; outils digitaux</li>
              <li>Développement web</li>
              <li>Intelligence artificielle</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 text-xs text-slate-200 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex flex-wrap gap-2">
            <span>✔️ Basé à Abidjan</span>
            <span>✔️ Solutions adaptées aux entreprises locales</span>
            <span>✔️ Accompagnement personnalisé</span>
            <span>✔️ Support réactif</span>
          </div>
          <div className="flex items-center gap-3">
            <p>© 2026 HAITECH GROUP - Tous droits réservés</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-slate-200 md:flex-row md:items-center md:justify-between">
          <p>Mentions légales et politique de confidentialité</p>
          <div className="flex items-center gap-3">
            <Link href="/mentions-legales" className="transition hover:text-haitechGold">
              Mentions légales
            </Link>
            <span>|</span>
            <Link href="/politique-confidentialite" className="transition hover:text-haitechGold">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
