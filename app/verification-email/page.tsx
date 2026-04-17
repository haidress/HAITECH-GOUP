import { PageHero } from "@/components/PageHero";
import { EmailVerificationForm } from "@/components/EmailVerificationForm";

export default function VerificationEmailPage({
  searchParams
}: {
  searchParams: { email?: string; role?: string; otp?: string };
}) {
  const email = searchParams.email ?? "";
  const role = searchParams.role === "etudiant" ? "etudiant" : "client";
  const devOtpHint = searchParams.otp;

  return (
    <div>
      <PageHero title="Validation de votre email" description="Confirmez votre compte avec le code OTP reçu." />
      <section className="mx-auto max-w-xl px-4 py-12">
        <EmailVerificationForm email={email} role={role} devOtpHint={devOtpHint} />
      </section>
    </div>
  );
}
