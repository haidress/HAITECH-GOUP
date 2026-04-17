"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type SourceType = "business_center" | "boutique_it" | "formation" | "services_it";

export function OrderRequestButton({
  sourceType,
  productName,
  amount,
  compact,
  defaultNom,
  defaultEmail,
  defaultContact
}: {
  sourceType: SourceType;
  productName: string;
  amount: number;
  compact?: boolean;
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

  async function submitOrder() {
    setMessage("");
    setLoading(true);
    try {
      const submittedEmail = email;
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType,
          productName,
          amount,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-haitechBlue">Passer une commande</h3>
              <button onClick={() => setOpen(false)} className="rounded border px-2 py-1 text-xs">
                Fermer
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-600">{productName}</p>
            <p className="text-sm font-semibold text-haitechBlue">{amount.toLocaleString("fr-FR")} FCFA</p>
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-medium text-slate-600">Nom complet</label>
              <input
                className="w-full rounded border p-3"
                placeholder="Nom complet"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
              <label className="block text-xs font-medium text-slate-600">Contact (téléphone)</label>
              <input
                className="w-full rounded border p-3"
                placeholder="Contact (téléphone)"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <label className="block text-xs font-medium text-slate-600">Email</label>
              <input
                className="w-full rounded border p-3"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              onClick={submitOrder}
              disabled={loading || !nom || !contact || !email}
              className="mt-4 w-full rounded-full bg-haitechGold px-4 py-3 font-semibold text-haitechBlue disabled:opacity-70"
            >
              {loading ? "Envoi..." : "Envoyer la commande"}
            </button>
            {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
