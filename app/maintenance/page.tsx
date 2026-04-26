export const metadata = {
  title: "Maintenance — HAITECH GROUP",
  robots: { index: false, follow: false }
};

export default function MaintenancePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-haitechGold">HAITECH GROUP</p>
      <h1 className="mt-3 font-heading text-3xl font-bold text-haitechBlue">Site en maintenance</h1>
      <p className="mt-4 text-slate-600">
        Nous effectuons une opération planifiée. Merci de revenir dans quelques instants. L&apos;espace
        d&apos;administration et les API internes restent disponibles pour les équipes autorisées.
      </p>
    </div>
  );
}
