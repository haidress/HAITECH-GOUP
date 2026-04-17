export function HomeJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "HAITECH GROUP",
        url: "https://haitech-group.ci",
        description: "Solutions IT, formations, boutique matériel et business center — Abidjan et région.",
        areaServed: "CI",
        sameAs: []
      },
      {
        "@type": "WebSite",
        name: "HAITECH GROUP",
        url: "https://haitech-group.ci"
      },
      {
        "@type": "ProfessionalService",
        name: "Services informatique HAITECH",
        serviceType: "Infogérance, cybersécurité, développement web, support IT",
        provider: { "@type": "Organization", name: "HAITECH GROUP" },
        areaServed: "CI"
      }
    ]
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
