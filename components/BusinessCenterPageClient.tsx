"use client";

import Image from "next/image";

const whatsappBusinessLink =
  "https://wa.me/2250789174619?text=Bonjour%20HAITECH%20Business%20Center%2C%20je%20veux%20discuter%20d%27une%20opportunite.";

const callLink = "tel:+2250789174619";

const activities = [
  {
    title: "Immobilier",
    subtitle: "Investissez intelligemment",
    image: "/business-center/immobilier.jpg",
    points: [
      "Terrains selectionnes",
      "Maisons disponibles",
      "Accompagnement complet (de la recherche a l'acquisition)"
    ],
    cta: "Voir les opportunites"
  },
  {
    title: "Vehicules",
    subtitle: "Mobilite simple et fiable",
    image: "/business-center/vehicule.jpg",
    points: ["Location courte & longue duree", "Vente de vehicules controles", "Assistance et suivi"],
    cta: "Voir les vehicules"
  },
  {
    title: "Conciergerie",
    subtitle: "Gagnez du temps au quotidien",
    image: "/business-center/conciergerie.jpg",
    points: ["Assistance personnalisee", "Gestion de demandes specifiques", "Organisation complete"],
    cta: "Demander un service"
  },
  {
    title: "HAITH SIGNATURE",
    subtitle: "Une identite, un style",
    image: "/business-center/haith-signature.jpg",
    points: ["Produits lifestyle", "Qualite & branding", "Collection en evolution"],
    cta: "Decouvrir la collection"
  }
];

const momentOpportunities = [
  {
    id: "terrain-anyama",
    title: "Terrain securise - Anyama",
    desc: "Terrain disponible en zone accessible, ideal pour habitation ou investissement.",
    points: ["Documents verifies", "Zone en developpement", "Bon potentiel de valorisation"],
    priceLabel: "A partir de 1 500 000 FCFA",
    image: "/business-center/immobilier.jpg",
    primaryCta: "Voir details",
    primaryHref: "/contact#formulaire-contact",
    secondaryCta: "WhatsApp",
    secondaryHref: whatsappBusinessLink
  },
  {
    id: "vehicule-disponible",
    title: "Location / Vente vehicule - disponible immediatement",
    desc: "Vehicules recents, fiables et prets a l'usage (particuliers ou professionnels).",
    points: ["Location courte & longue duree", "Vehicules controles", "Assistance disponible"],
    priceLabel: "A partir de 25 000 FCFA / jour",
    image: "/business-center/vehicule.jpg",
    primaryCta: "Voir vehicules",
    primaryHref: "#poles-activite",
    secondaryCta: "Reserver sur WhatsApp",
    secondaryHref: whatsappBusinessLink
  },
  {
    id: "pack-automatisation-pme",
    title: "Automatisation commerciale PME",
    desc: "Mise en place complete d'un systeme pour generer et suivre vos clients automatiquement.",
    points: ["Tunnel de vente", "CRM", "Automatisation WhatsApp", "Suivi prospects"],
    priceLabel: "A partir de 500 000 FCFA",
    image: "/business-center/conciergerie.jpg",
    primaryCta: "En savoir plus",
    primaryHref: "#offre-phare",
    secondaryCta: "Demander un devis",
    secondaryHref: "/contact#formulaire-contact"
  },
  {
    id: "conciergerie-premium",
    title: "Service conciergerie premium",
    desc: "Nous gerons vos besoins pour vous faire gagner du temps et simplifier vos demarches.",
    points: ["Assistance personnalisee", "Organisation de missions", "Gestion de demandes specifiques"],
    priceLabel: "Sur devis",
    image: "/business-center/haith-signature.jpg",
    primaryCta: "Demander un service",
    primaryHref: "/contact#formulaire-contact",
    secondaryCta: "WhatsApp",
    secondaryHref: whatsappBusinessLink
  }
];

export function BusinessCenterPageClient() {
  return (
    <div className="bg-white">
      <section
        className="relative overflow-hidden py-16 text-white md:py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,42,94,0.78), rgba(10,42,94,0.78)), url('/business-center/hero-background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-4xl">
            <h1 className="font-heading text-3xl font-extrabold leading-tight md:text-5xl">
              Developpez votre business avec des opportunites concretes a Abidjan
            </h1>
            <p className="mt-4 text-sm text-slate-100 md:text-lg">
              Immobilier, vehicules, automatisation et services premium : nous vous connectons aux bonnes opportunites, au bon moment.
            </p>
            <p className="mt-5 text-sm font-semibold text-haitechGold md:text-base">
              +100 clients accompagnes - Solutions fiables - Reactivite garantie
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={whatsappBusinessLink} target="_blank" rel="noreferrer" className="btn-primary bg-haitechGold text-haitechBlue hover:bg-haitechGold/90">
                Discuter sur WhatsApp
              </a>
              <a href={callLink} className="btn-secondary border-white text-white hover:bg-white hover:text-haitechBlue">
                Etre rappele
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Pourquoi HAITECH Business Center ?</h2>
        <p className="mt-4 max-w-4xl text-sm text-slate-700 md:text-base">
          Nous ne proposons pas simplement des services. Nous identifions, structurons et securisons des opportunites concretes pour vous faire gagner du temps, reduire les risques et accelerer vos resultats.
        </p>
      </section>

      <section id="poles-activite" className="bg-slate-50 py-12 md:py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Nos poles d&apos;activites</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {activities.map((item) => (
              <article key={item.title} className="surface-card overflow-hidden">
                <div className="relative h-56">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 font-heading text-2xl font-bold text-white">{item.title}</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-haitechBlue">{item.subtitle}</p>
                  <ul className="mt-3 space-y-1 text-sm text-slate-700">
                    {item.points.map((p) => (
                      <li key={p}>- {p}</li>
                    ))}
                  </ul>
                  <a
                    href={whatsappBusinessLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block rounded-full bg-haitechBlue px-4 py-2 text-sm font-semibold text-white hover:bg-haitechBlue/90"
                  >
                    {item.cta}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="offre-phare" className="mx-auto max-w-7xl px-4 py-12 md:py-14">
        <div className="rounded-3xl border border-haitechBlue/20 bg-haitechBlue/5 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-haitechBlue">Offre phare</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-haitechBlue md:text-3xl">
            Transformez votre business en machine a generer des clients
          </h2>
          <p className="mt-3 text-sm text-slate-700">Automatisation commerciale</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Ce que nous mettons en place</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                <li>- Tunnel de vente structure</li>
                <li>- CRM adapte a votre activite</li>
                <li>- Automatisation WhatsApp & Email</li>
                <li>- Suivi des prospects en temps reel</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Resultats attendus</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                <li>✔ Plus de prospects qualifies</li>
                <li>✔ Plus de ventes</li>
                <li>✔ Moins d&apos;efforts manuels</li>
              </ul>
              <p className="mt-4 text-sm font-bold text-haitechBlue">A partir de 500 000 FCFA</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href="/contact#formulaire-contact" className="btn-primary">
                  Demander un devis
                </a>
                <a href={whatsappBusinessLink} target="_blank" rel="noreferrer" className="btn-secondary border-haitechBlue text-haitechBlue">
                  Discuter sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="opportunites-moment" className="bg-slate-50 py-12 md:py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Opportunites du moment</h2>
          <p className="mt-2 text-sm text-slate-600">Selection actuelle - Offres limitees et verifiees</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3 xl:grid-cols-4">
            {momentOpportunities.map((item) => (
              <article key={item.id} className="surface-card overflow-hidden">
                <div className="relative h-44">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-lg font-bold text-haitechBlue">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-700">{item.desc}</p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-600">
                    {item.points.map((point) => (
                      <li key={point}>- {point}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm font-semibold text-haitechBlue">{item.priceLabel}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={item.primaryHref}
                      target={item.primaryHref.startsWith("http") ? "_blank" : undefined}
                      rel={item.primaryHref.startsWith("http") ? "noreferrer" : undefined}
                      className="rounded-full bg-haitechBlue px-4 py-2 text-xs font-semibold text-white hover:bg-haitechBlue/90"
                    >
                      {item.primaryCta}
                    </a>
                    <a
                      href={item.secondaryHref}
                      target={item.secondaryHref.startsWith("http") ? "_blank" : undefined}
                      rel={item.secondaryHref.startsWith("http") ? "noreferrer" : undefined}
                      className="rounded-full border border-haitechBlue px-4 py-2 text-xs font-semibold text-haitechBlue hover:bg-haitechBlue hover:text-white"
                    >
                      {item.secondaryCta}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Une approche simple, fiable et efficace</h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            "Offres verifiees",
            "Accompagnement personnalise",
            "Reactivite immediate",
            "Transparence totale",
            "Solutions adaptees a votre realite"
          ].map((item) => (
            <div key={item} className="surface-card p-4 text-sm font-semibold text-slate-700">
              ✔ {item}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-12 md:py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Benefices clients</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Vous gagnez du temps",
              "Vous evitez les erreurs couteuses",
              "Vous accedez a des opportunites fiables",
              "Vous etes accompagne de A a Z"
            ].map((item) => (
              <div key={item} className="surface-card border border-haitechBlue/15 bg-white p-5 text-sm font-semibold text-slate-700">
                ✔ {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Comment ca marche</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-4">
          {[
            "Vous nous contactez",
            "Nous analysons votre besoin",
            "Nous vous proposons une solution adaptee",
            "Nous vous accompagnons jusqu'au resultat"
          ].map((step, idx) => (
            <div key={step} className="surface-card p-5 text-sm text-slate-700">
              <p className="text-xs font-semibold text-haitechBlue">Etape {idx + 1}</p>
              <p className="mt-2 font-semibold">{step}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm font-semibold text-slate-700">Simple, rapide, efficace.</p>
      </section>

      <section className="bg-slate-50 py-12 md:py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Temoignages</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <blockquote className="surface-card p-6">
              <p className="text-lg">⭐⭐⭐⭐⭐</p>
              <p className="mt-3 text-slate-700">
                J&apos;ai pu securiser mon terrain rapidement avec un accompagnement clair et transparent.
              </p>
              <footer className="mt-4 text-sm font-semibold text-haitechBlue">- K. Traore, Abidjan</footer>
            </blockquote>
            <blockquote className="surface-card p-6">
              <p className="text-lg">⭐⭐⭐⭐⭐</p>
              <p className="mt-3 text-slate-700">Service de location tres fluide, rapide et professionnel.</p>
              <footer className="mt-4 text-sm font-semibold text-haitechBlue">- Client mobilite</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="rounded-2xl bg-haitechBlue p-8 text-white">
          <h2 className="font-heading text-3xl font-bold">Passez a l&apos;action des maintenant</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-100 md:text-base">
            Une opportunite ne reste pas disponible longtemps. Contactez-nous des aujourd&apos;hui.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={whatsappBusinessLink} target="_blank" rel="noreferrer" className="btn-primary bg-haitechGold text-haitechBlue hover:bg-haitechGold/90">
              WhatsApp
            </a>
            <a href={callLink} className="btn-secondary border-white text-white hover:bg-white hover:text-haitechBlue">
              Appel direct
            </a>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-3 bottom-4 z-40 flex gap-2 md:hidden">
        <a href={whatsappBusinessLink} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-white shadow-xl">
          WhatsApp
        </a>
        <a href={callLink} className="flex-1 rounded-full bg-haitechBlue px-4 py-3 text-center text-sm font-bold text-white shadow-xl">
          Appel
        </a>
      </div>
    </div>
  );
}
