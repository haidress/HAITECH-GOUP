"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerifyLink, setShowVerifyLink] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setShowVerifyLink(false);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = (await response.json()) as { success: boolean; message?: string; role?: string };

      if (!response.ok || !data.success) {
        if (response.status === 403) setShowVerifyLink(true);
        throw new Error(data.message ?? "Connexion impossible.");
      }

      if (data.role === "admin") router.push("/admin/leads");
      else if (data.role === "technicien") router.push("/technicien");
      else if (data.role === "etudiant") router.push("/elearning");
      else router.push("/espace-client");
      window.dispatchEvent(new Event("haitech-auth-changed"));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="font-heading text-2xl font-bold text-haitechBlue">Connexion</h1>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600">Email</label>
        <input
          type="email"
          className="w-full rounded-lg border p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600">Mot de passe</label>
        <input
          type="password"
          className="w-full rounded-lg border p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-haitechBlue px-6 py-3 font-semibold text-white disabled:opacity-70"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
      <p className="text-sm text-slate-600">
        Nouveau sur HAITECH ?{" "}
        <a href="/inscription" className="font-semibold text-haitechBlue underline">
          Créer un compte
        </a>
      </p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {showVerifyLink ? (
        <a href={`/verification-email?email=${encodeURIComponent(email)}`} className="text-sm font-semibold text-haitechBlue underline">
          Vérifier mon email (OTP)
        </a>
      ) : null}
    </form>
  );
}
