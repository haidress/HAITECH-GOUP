import { PageHero } from "@/components/PageHero";
import { ProfileForm } from "@/components/ProfileForm";
import { requireRole } from "@/lib/auth";

export default async function MonProfilPage() {
  await requireRole(["admin", "client", "etudiant"]);
  return (
    <div>
      <PageHero title="Mon profil" description="Mettez à jour vos informations personnelles." />
      <section className="mx-auto max-w-xl px-4 py-12">
        <ProfileForm />
      </section>
    </div>
  );
}
