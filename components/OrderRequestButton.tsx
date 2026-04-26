"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type SourceType = "business_center" | "boutique_it" | "formation" | "services_it";
type UpsellSuggestion = { name: string; amount: number };
type OfferCoupon = { id: number; code: string; discount_type: "fixed" | "percent"; discount_value: number };
type OfferBundle = { id: number; name: string; discount_type: "fixed" | "percent"; discount_value: number };
type FormErrors = { nom?: string; contact?: string; email?: string };

export function OrderRequestButton({
  sourceType,
  productName,
  amount,
  compact,
  suggestions,
  defaultNom,
  defaultEmail,
  defaultContact
}: {
  sourceType: SourceType;
  productName: string;
  amount: number;
  compact?: boolean;
  suggestions?: UpsellSuggestion[];
  defaultNom?: string;
  defaultEmail?: string;
  defaultContact?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState(defaultNom ?? "");
  const [contact, setContact] = useState(defaultContact ?? "");
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedUpsells, setSelectedUpsells] = useState<number[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [bundleId, setBundleId] = useState<number | "">("");
  const [offerCoupons, setOfferCoupons] = useState<OfferCoupon[]>([]);
  const [offerBundles, setOfferBundles] = useState<OfferBundle[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const fieldIdBase = `${sourceType}-${productName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  function validateForm() {
    const nextErrors: FormErrors = {};
    if (!nom.trim()) nextErrors.nom = "Le nom complet est obligatoire.";
    if (!contact.trim()) nextErrors.contact = "Le numero de contact est obligatoire.";
    if (!email.trim()) {
      nextErrors.email = "L'email est obligatoire.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Merci de saisir une adresse email valide.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  useEffect(() => {
    const savedNom = localStorage.getItem("haitech_order_nom");
    const savedContact = localStorage.getItem("haitech_order_contact");
    const savedEmail = localStorage.getItem("haitech_order_email");
    if (!defaultNom && savedNom) setNom(savedNom);
    if (!defaultContact && savedContact) setContact(savedContact);
    if (!defaultEmail && savedEmail) setEmail(savedEmail);
  }, [defaultNom, defaultContact, defaultEmail]);

  useEffect(() => {
    if (nom) localStorage.setItem("haitech_order_nom", nom);
  }, [nom]);

  useEffect(() => {
    if (contact) localStorage.setItem("haitech_order_contact", contact);
  }, [contact]);

  useEffect(() => {
    if (email) localStorage.setItem("haitech_order_email", email);
  }, [email]);

  useEffect(() => {
    if (sourceType !== "boutique_it") return;
    fetch("/api/boutique/offers")
      .then((r) => r.json())
      .then((json) => {
        if (!json?.success) return;
        setOfferCoupons(json.data?.coupons ?? []);
        setOfferBundles(json.data?.bundles ?? []);
      })
      .catch(() => {
        setOfferCoupons([]);
        setOfferBundles([]);
      });
  }, [sourceType]);

  async function submitOrder() {
    if (!validateForm()) {
      setMessage("Merci de corriger les champs en erreur.");
      return;
    }

    setMessage("");
    setLoading(true);
    try {
      const submittedEmail = email;
      const selected = (suggestions ?? []).filter((_, idx) => selectedUpsells.includes(idx));
      const upsellAmount = selected.reduce((sum, s) => sum + s.amount, 0);
      const finalAmount = amount + upsellAmount;
      const finalProductName =
        selected.length > 0
          ? `${productName} + ${selected.map((s) => s.name).join(", ")}`
          : productName;
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType,
          productName: finalProductName,
          amount: finalAmount,
          couponCode: couponCode || undefined,
          bundleId: bundleId === "" ? undefined : bundleId,
          nom,
          contact,
          email
        })
      });
      const data = (await response.json()) as {
        success: boolean;
        message?: string;
        orderId?: number;
        referenceCode?: string;
      };
      if (!response.ok || !data.success) {
        setMessage(data.message ?? "Impossible d'enregistrer la commande.");
        return;
      }
      setMessage("Commande envoyée avec succès.");
      setNom("");
      setContact("");
      setEmail("");
      setErrors({});
      setTimeout(() => {
        setOpen(false);
        if (data.orderId && data.referenceCode) {
          router.push(
            `/commande/confirmation?order=${data.orderId}&reference=${encodeURIComponent(data.referenceCode)}&email=${encodeURIComponent(
              submittedEmail
            )}`
          );
        }
      }, 700);
    } finally {
      setLoading(false);
    }
  }

  const classes = compact
    ? "rounded-full px-3 py-1.5 text-xs font-semibold"
    : "rounded-full px-4 py-2 text-sm font-semibold";

  return (
    <>
      <button onClick={() => setOpen(true)} className={`${classes} bg-haitechBlue text-white`}>
        Commander
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 px-4 py-4 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
            className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h3 id="order-modal-title" className="font-heading text-lg font-bold text-haitechBlue">
                Passer une commande
              </h3>
              <button onClick={() => setOpen(false)} className="rounded border px-2 py-1 text-xs">
                Fermer
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-600">{productName}</p>
            <p className="text-sm font-semibold text-haitechBlue">{amount.toLocaleString("fr-FR")} FCFA</p>
            {suggestions && suggestions.length > 0 ? (
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ajoutez aussi</p>
                <div className="mt-2 space-y-2">
                  {suggestions.map((s, idx) => (
                    <label key={`${s.name}-${idx}`} className="flex items-center justify-between gap-2 text-sm">
                      <span className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedUpsells.includes(idx)}
                          onChange={(e) =>
                            setSelectedUpsells((prev) =>
                              e.target.checked ? [...prev, idx] : prev.filter((x) => x !== idx)
                            )
                          }
                        />
                        {s.name}
                      </span>
                      <span className="font-semibold text-haitechBlue">{s.amount.toLocaleString("fr-FR")} FCFA</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}
            {sourceType === "boutique_it" ? (
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Offres boutique</p>
                <input
                  className="form-input mt-2 text-sm"
                  placeholder="Code coupon (optionnel)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  list="boutique-coupons"
                />
                <datalist id="boutique-coupons">
                  {offerCoupons.map((c) => (
                    <option key={c.id} value={c.code}>{c.code}</option>
                  ))}
                </datalist>
                <select
                  className="form-input mt-2 text-sm"
                  value={bundleId}
                  onChange={(e) => setBundleId(e.target.value ? Number(e.target.value) : "")}
                >
                  <option value="">Bundle (optionnel)</option>
                  {offerBundles.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.discount_type === "percent" ? `${b.discount_value}%` : `${b.discount_value.toLocaleString("fr-FR")} FCFA`})
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="mt-4 space-y-2">
              <label htmlFor={`order-nom-${fieldIdBase}`} className="block text-xs font-medium text-slate-600">
                Nom complet
              </label>
              <input
                id={`order-nom-${fieldIdBase}`}
                className="form-input"
                placeholder="Nom complet"
                value={nom}
                aria-invalid={Boolean(errors.nom)}
                aria-describedby={errors.nom ? "order-nom-error" : undefined}
                onChange={(e) => {
                  setNom(e.target.value);
                  if (errors.nom) setErrors((prev) => ({ ...prev, nom: undefined }));
                }}
              />
              {errors.nom ? (
                <p id="order-nom-error" className="text-xs text-red-600">
                  {errors.nom}
                </p>
              ) : null}
              <label htmlFor={`order-contact-${fieldIdBase}`} className="block text-xs font-medium text-slate-600">
                Contact (telephone)
              </label>
              <input
                id={`order-contact-${fieldIdBase}`}
                className="form-input"
                placeholder="Contact (téléphone)"
                value={contact}
                aria-invalid={Boolean(errors.contact)}
                aria-describedby={errors.contact ? "order-contact-error" : undefined}
                onChange={(e) => {
                  setContact(e.target.value);
                  if (errors.contact) setErrors((prev) => ({ ...prev, contact: undefined }));
                }}
              />
              {errors.contact ? (
                <p id="order-contact-error" className="text-xs text-red-600">
                  {errors.contact}
                </p>
              ) : null}
              <label htmlFor={`order-email-${fieldIdBase}`} className="block text-xs font-medium text-slate-600">
                Email
              </label>
              <input
                id={`order-email-${fieldIdBase}`}
                className="form-input"
                placeholder="Email"
                type="email"
                value={email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "order-email-error" : undefined}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
              />
              {errors.email ? (
                <p id="order-email-error" className="text-xs text-red-600">
                  {errors.email}
                </p>
              ) : null}
            </div>
            <button
              onClick={submitOrder}
              disabled={loading || !nom || !contact || !email}
              className="mt-4 w-full rounded-full bg-haitechGold px-4 py-3 font-semibold text-haitechBlue transition hover:opacity-90 disabled:opacity-70"
              aria-busy={loading}
            >
              {loading ? "Envoi..." : "Envoyer la commande"}
            </button>
            {message ? (
              <p role="status" aria-live="polite" className="mt-3 text-sm text-slate-700">
                {message}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
