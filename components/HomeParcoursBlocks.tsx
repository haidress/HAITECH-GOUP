export function HomeParcoursBlocks() {
  return (
    <>
      <section id="parcours-entreprise" className="scroll-mt-24 bg-haitechBlue py-12 text-white md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">Parcours entreprise</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-100 md:text-base">
            Audit rapide, infogérance progressive, cybersécurité et formations : nous sécurisons votre SI et formons vos
            équipes, avec des packs adaptés TPE / PME.
          </p>
          <ul className="mt-6 grid gap-3 text-sm md:grid-cols-2 md:text-base">
            <li className="surface-card border-white/20 bg-white/5 px-4 py-3">• Services IT & paliers infogérance</li>
            <li className="surface-card border-white/20 bg-white/5 px-4 py-3">• Interventions terrain & incidents</li>
            <li className="surface-card border-white/20 bg-white/5 px-4 py-3">• Formations intra & Academy</li>
            <li className="surface-card border-white/20 bg-white/5 px-4 py-3">• Business Center pour croissance externe</li>
          </ul>
        </div>
      </section>
      <section id="parcours-particulier" className="scroll-mt-24 bg-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Parcours particulier</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
            Formations digitales, achat matériel fiable, sites vitrines et assistance à la demande : un accompagnement clair,
            sans jargon inutile.
          </p>
          <ul className="mt-6 grid gap-3 text-sm md:grid-cols-2 md:text-base">
            <li className="surface-card px-4 py-3 text-slate-700">• HAITECH Academy & e-learning</li>
            <li className="surface-card px-4 py-3 text-slate-700">• Boutique IT & bundles</li>
            <li className="surface-card px-4 py-3 text-slate-700">• Support & projets ponctuels</li>
            <li className="surface-card px-4 py-3 text-slate-700">• Accompagnement téléphonique personnalisé</li>
          </ul>
        </div>
      </section>
    </>
  );
}
