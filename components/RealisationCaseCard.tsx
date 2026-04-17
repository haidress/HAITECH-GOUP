import Image from "next/image";
import Link from "next/link";
import type { RealisationCase, RealisationTag } from "@/lib/realisations-data";

function tagClass(tag: RealisationTag): string {
  const map: Record<RealisationTag, string> = {
    Web: "bg-haitechBlue/10 text-haitechBlue",
    IT: "bg-emerald-100 text-emerald-800",
    Formation: "bg-amber-100 text-amber-900",
    Business: "bg-violet-100 text-violet-900"
  };
  return map[tag];
}

export function RealisationCaseCard({ c }: { c: RealisationCase }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div
        className={`relative aspect-[16/10] w-full shrink-0 ${c.imageFit === "contain" ? "bg-white" : "bg-slate-100"}`}
      >
        <Image
          src={c.image}
          alt={`Réalisation ${c.clientName} — ${c.title}`}
          fill
          className={c.imageFit === "contain" ? "object-contain p-4" : "object-cover"}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${tagClass(c.tag)}`}>{c.tag}</span>
          <span className="text-xs text-slate-500">{c.year}</span>
          <span className="text-xs text-slate-400">· {c.duration}</span>
        </div>
        <h3 className="mt-3 font-heading text-xl font-bold text-haitechBlue">{c.title}</h3>
        <p className="mt-1 text-sm font-medium text-slate-700">{c.clientName}</p>
        <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-500">{c.sector}</p>
        <p className="mt-3 text-sm text-slate-600">{c.excerpt}</p>
        <dl className="mt-4 flex-1 space-y-3 border-t border-slate-100 pt-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-800">Enjeu</dt>
            <dd className="mt-0.5 text-slate-600">{c.challenge}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-800">Réponse</dt>
            <dd className="mt-0.5 text-slate-600">{c.solution}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-800">Résultat</dt>
            <dd className="mt-0.5 text-slate-600">{c.outcome}</dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {c.stack.slice(0, 5).map((s) => (
            <span key={s} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
              {s}
            </span>
          ))}
          {c.stack.length > 5 ? (
            <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] text-slate-400">+{c.stack.length - 5}</span>
          ) : null}
        </div>
        {c.links && c.links.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {c.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-haitechBlue underline underline-offset-2 hover:text-haitechGold"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        ) : null}
        <Link
          href={`/realisations/${c.id}`}
          className="mt-5 inline-flex text-sm font-semibold text-haitechBlue underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-haitechBlue"
        >
          Lire la fiche complète →
        </Link>
      </div>
    </article>
  );
}
