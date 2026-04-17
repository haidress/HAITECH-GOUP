import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-20 bg-haitechBlue text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo-haitech.jpg" alt="Logo HAITECH GROUP" width={44} height={44} className="rounded-full" />
            <h3 className="font-heading text-lg font-bold">HAITECH GROUP</h3>
          </div>
          <p className="mt-2 text-sm text-slate-200">Un seul groupe, mille solutions.</p>
          <p className="mt-3 text-sm text-slate-200">📍 Abidjan, Côte d&apos;Ivoire</p>
          <p className="text-sm text-slate-200">📍 Cocody, Plateau Dokoui</p>
          <p className="mt-3 text-sm text-slate-200">📧 haitechgroupe@gmail.com</p>
          <p className="text-sm text-slate-200">📞 07 89 17 46 19</p>
          <a
            href="https://wa.me/2250789174619"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block rounded-full bg-haitechGold px-4 py-2 text-xs font-semibold text-haitechBlue transition hover:opacity-90"
          >
            WhatsApp
          </a>
        </div>
        <div>
          <h4 className="font-heading text-base font-semibold">Liens importants</h4>
          <div className="mt-2 flex flex-col gap-2 text-sm">
            <Link href="/" className="transition hover:text-haitechGold">Accueil</Link>
            <Link href="/technology" className="transition hover:text-haitechGold">Services informatique</Link>
            <Link href="/academy" className="transition hover:text-haitechGold">Formations</Link>
            <Link href="/boutique-it" className="transition hover:text-haitechGold">Boutique IT</Link>
            <Link href="/business-center" className="transition hover:text-haitechGold">Business Center</Link>
            <Link href="/realisations" className="transition hover:text-haitechGold">Réalisations</Link>
            <Link href="/a-propos" className="transition hover:text-haitechGold">A propos</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-base font-semibold">Pôle Technologie</h4>
          <div className="mt-2 flex flex-col gap-2 text-sm text-slate-200">
            <p>Développement web &amp; applications</p>
            <p>Maintenance &amp; support IT</p>
            <p>Cybersécurité et réseaux</p>
            <p>Création de visuels</p>
            <p>Community management</p>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-base font-semibold">HAITECH Academy</h4>
          <div className="mt-2 flex flex-col gap-2 text-sm text-slate-200">
            <p>Informatique (Pack Office, outils digitaux)</p>
            <p>Infographie et communication</p>
            <p>Entrepreneuriat</p>
            <p>Développement web</p>
            <p>Intelligence artificielle</p>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-base font-semibold">Suivez-nous</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            {[
              { icon: "ⓕ", label: "Facebook", href: "https://facebook.com" },
              { icon: "◎", label: "Instagram", href: "https://instagram.com" },
              { icon: "in", label: "LinkedIn", href: "https://linkedin.com" },
              { icon: "▶", label: "YouTube", href: "https://youtube.com" },
              { icon: "✆", label: "WhatsApp", href: "https://wa.me/2250789174619" }
            ].map((item) => (
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
      <div className="border-t border-white/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-slate-200 md:flex-row md:items-center md:justify-between">
          <p>© 2026 HAITECH GROUP – Tous droits réservés</p>
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
