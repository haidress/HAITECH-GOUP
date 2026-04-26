"use client";

import { useState } from "react";

type FormState = {
  nom: string;
  email: string;
  telephone: string;
  serviceType:
    | "Site web"
    | "Gestion reseaux sociaux"
    | "Branding et image"
    | "Services IT et maintenance"
    | "Formation professionnelle"
    | "Autre";
  objectif:
    | "Avoir plus de clients"
    | "Ameliorer mon image"
    | "Creer un site web"
    | "Gerer mes reseaux sociaux"
    | "Autre";
  besoin: string;
  budgetRange: "<100000" | "100000-250000" | "250000-500000" | "500000+";
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  nom: "",
  email: "",
  telephone: "",
  serviceType: "Site web",
  objectif: "Avoir plus de clients",
  besoin: "",
  budgetRange: "100000-250000"
};

export function ContactLeadForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(current: FormState): FormErrors {
    const nextErrors: FormErrors = {};
    if (!current.nom.trim()) nextErrors.nom = "Le nom complet est obligatoire.";
    if (!current.email.trim()) {
      nextErrors.email = "L'adresse email est obligatoire.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(current.email)) {
      nextErrors.email = "Merci de saisir une adresse email valide.";
    }
    if (!current.besoin.trim()) nextErrors.besoin = "Merci de decrire votre besoin.";
    return nextErrors;
  }

  function budgetRangeToNumericValue(range: FormState["budgetRange"]) {
    if (range === "<100000") return 80000;
    if (range === "100000-250000") return 175000;
    if (range === "250000-500000") return 375000;
    return 500000;
  }

  function budgetLabel(range: FormState["budgetRange"]) {
    if (range === "<100000") return "Moins de 100 000 FCFA";
    if (range === "100000-250000") return "100 000 - 250 000 FCFA";
    if (range === "250000-500000") return "250 000 - 500 000 FCFA";
    return "500 000 FCFA et +";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setFeedback("Merci de corriger les champs en erreur.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const payload = {
        nom: form.nom,
        email: form.email,
        telephone: form.telephone,
        source: "site" as const,
        besoin: [
          `Type de service: ${form.serviceType}`,
          `Objectif principal: ${form.objectif}`,
          `Budget estimatif: ${budgetLabel(form.budgetRange)}`,
          "",
          form.besoin
        ].join("\n"),
        budget: budgetRangeToNumericValue(form.budgetRange)
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as { success: boolean; message: string };

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Échec d'envoi.");
      }

      setStatus("success");
      setFeedback(data.message);
      setForm(initialState);
      setErrors({});
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Une erreur est survenue.");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="surface-card space-y-4 p-6">
      <h2 className="font-heading text-2xl font-bold text-haitechBlue">Formulaire de qualification</h2>
      <p className="text-sm text-slate-600">
        Remplissez ces informations pour recevoir une proposition claire adaptee a votre budget et vos objectifs.
      </p>
      <div className="space-y-1">
        <label htmlFor="lead-nom" className="text-sm font-semibold text-slate-700">
          Nom complet <span className="text-red-600">*</span>
        </label>
      <input
        id="lead-nom"
        className="form-input"
        aria-invalid={Boolean(errors.nom)}
        aria-describedby={errors.nom ? "lead-nom-error" : undefined}
        value={form.nom}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, nom: e.target.value }));
          if (errors.nom) setErrors((prev) => ({ ...prev, nom: undefined }));
        }}
        required
      />
      {errors.nom ? (
        <p id="lead-nom-error" className="text-sm text-red-600">
          {errors.nom}
        </p>
      ) : null}
      </div>
      <div className="space-y-1">
        <label htmlFor="lead-email" className="text-sm font-semibold text-slate-700">
          Email <span className="text-red-600">*</span>
        </label>
      <input
        id="lead-email"
        className="form-input"
        type="email"
        aria-invalid={Boolean(errors.email)}
        aria-describedby={errors.email ? "lead-email-error" : undefined}
        value={form.email}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, email: e.target.value }));
          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
        }}
        required
      />
      {errors.email ? (
        <p id="lead-email-error" className="text-sm text-red-600">
          {errors.email}
        </p>
      ) : null}
      </div>
      <div className="space-y-1">
        <label htmlFor="lead-phone" className="text-sm font-semibold text-slate-700">
          Telephone (WhatsApp recommande)
        </label>
      <input
        id="lead-phone"
        className="form-input"
        placeholder="Ex: 07 89 17 46 19"
        value={form.telephone}
        onChange={(e) => setForm((prev) => ({ ...prev, telephone: e.target.value }))}
      />
      </div>
      <div className="space-y-1">
        <label htmlFor="lead-service" className="text-sm font-semibold text-slate-700">
          Type de service
        </label>
      <select
        id="lead-service"
        className="form-input"
        value={form.serviceType}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            serviceType: e.target.value as FormState["serviceType"]
          }))
        }
      >
        <option>Site web</option>
        <option>Gestion reseaux sociaux</option>
        <option>Branding et image</option>
        <option>Services IT et maintenance</option>
        <option>Formation professionnelle</option>
        <option>Autre</option>
      </select>
      </div>
      <div className="space-y-1">
        <label htmlFor="lead-objectif" className="text-sm font-semibold text-slate-700">
          Objectif principal
        </label>
        <select
          id="lead-objectif"
          className="form-input"
          value={form.objectif}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              objectif: e.target.value as FormState["objectif"]
            }))
          }
        >
          <option>Avoir plus de clients</option>
          <option>Ameliorer mon image</option>
          <option>Creer un site web</option>
          <option>Gerer mes reseaux sociaux</option>
          <option>Autre</option>
        </select>
      </div>
      <div className="space-y-1">
        <label htmlFor="lead-besoin" className="text-sm font-semibold text-slate-700">
          Decrivez votre besoin <span className="text-red-600">*</span>
        </label>
      <textarea
        id="lead-besoin"
        className="form-input h-28"
        placeholder="Precisez votre contexte, vos attentes et le delai ideal."
        aria-invalid={Boolean(errors.besoin)}
        aria-describedby={errors.besoin ? "lead-besoin-error" : undefined}
        value={form.besoin}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, besoin: e.target.value }));
          if (errors.besoin) setErrors((prev) => ({ ...prev, besoin: undefined }));
        }}
        required
      />
      {errors.besoin ? (
        <p id="lead-besoin-error" className="text-sm text-red-600">
          {errors.besoin}
        </p>
      ) : null}
      </div>
      <div className="space-y-1">
        <label htmlFor="lead-budget" className="text-sm font-semibold text-slate-700">
          Budget estimatif
        </label>
      <select
        id="lead-budget"
        className="form-input"
        value={form.budgetRange}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, budgetRange: e.target.value as FormState["budgetRange"] }));
        }}
      >
        <option value="<100000">Moins de 100 000 FCFA</option>
        <option value="100000-250000">100 000 - 250 000 FCFA</option>
        <option value="250000-500000">250 000 - 500 000 FCFA</option>
        <option value="500000+">500 000 FCFA et +</option>
      </select>
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary"
        aria-busy={status === "loading"}
      >
        {status === "loading" ? "Envoi en cours..." : "Envoyer la demande"}
      </button>
      {feedback ? (
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${status === "success" ? "text-emerald-600" : "text-red-600"}`}
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
