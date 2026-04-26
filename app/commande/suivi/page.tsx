import { Suspense } from "react";
import { CommandeSuiviClient } from "@/app/commande/suivi/commande-suivi-client";

export default function CommandeSuiviPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-16 text-sm text-slate-600">Chargement du suivi...</div>}>
      <CommandeSuiviClient />
    </Suspense>
  );
}
