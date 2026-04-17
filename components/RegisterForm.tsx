"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "client" | "etudiant";

export function RegisterForm() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("client");
  const [typeClient, setTypeClient] = useState<"particulier" | "entreprise">("particulier");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          telephone,
          password,
          role,
          typeClient: role === "client" ? typeClient : undefined
        })
      });
      const data = (await response.json()) as {
        success: boolean;
        message?: string;
        role?: Role;
        devOtpCode?: string;
        otpFallbackMode?: string;
      };
      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Inscription impossible.");
      }

      const devOtp = data.devOtpCode;
      const query = new URLSearchParams({ email, role: data.role ?? role });
      if (devOtp) query.set("otp", devOtp);
      router.push(`/verification-email?${query.toString()}`);
      router.refresh();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 p-6">
      <h1 className="font-heading text-2xl font-bold text-haitechBlue">Créer un compte</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <input className="w-full rounded-lg border p-3" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom" required />
        <input
          className="w-full rounded-lg border p-3"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          placeholder="Prénom"
          required
        />
      </div>
      <input className="w-full rounded-lg border p-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input className="w-full rounded-lg border p-3" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Téléphone (optionnel)" />
      <input
        className="w-full rounded-lg border p-3"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe (8 caractères min)"
        required
      />
      <select className="w-full rounded-lg border p-3" value={role} onChange={(e) => setRole(e.target.value as Role)}>
        <option value="client">Je suis client</option>
        <option value="etudiant">Je suis étudiant</option>
      </select>
      {role === "client" ? (
        <select
          className="w-full rounded-lg border p-3"
          value={typeClient}
          onChange={(e) => setTypeClient(e.target.value as "particulier" | "entreprise")}
        >
          <option value="particulier">Type client: Particulier</option>
          <option value="entreprise">Type client: Entreprise</option>
        </select>
      ) : null}
      <button type="submit" disabled={loading} className="rounded-full bg-haitechBlue px-6 py-3 font-semibold text-white disabled:opacity-70">
        {loading ? "Création..." : "S'inscrire"}
      </button>
      {feedback ? <p className="text-sm text-red-600">{feedback}</p> : null}
    </form>
  );
}
