"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function EmailVerificationForm({
  email: initialEmail,
  role,
  devOtpHint
}: {
  email: string;
  role: "client" | "etudiant";
  devOtpHint?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [digits, setDigits] = useState<string[]>(() => {
    const initialDigits = (devOtpHint ?? "").replace(/\D/g, "").slice(0, 6).split("");
    return Array.from({ length: 6 }, (_, i) => initialDigits[i] ?? "");
  });
  const [feedback, setFeedback] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join("");

  function updateDigit(index: number, value: string) {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    setDigits((prev) => {
      const next = [...prev];
      let cursor = index;
      for (const char of clean.slice(0, 6 - index)) {
        next[cursor] = char;
        cursor += 1;
      }
      return next;
    });

    const nextIndex = Math.min(index + clean.length, 5);
    inputsRef.current[nextIndex]?.focus();
  }

  function onKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      if (digits[index]) {
        setDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
        return;
      }
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
    }
    if (event.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function onPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    setDigits(Array.from({ length: 6 }, (_, i) => pasted[i] ?? ""));
    inputsRef.current[Math.min(pasted.length, 6) - 1]?.focus();
  }

  async function verify() {
    setLoading(true);
    setFeedback("");
    setInfo("");
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: code.trim() })
      });
      const data = (await response.json()) as { success?: boolean; message?: string; redirectTo?: string };
      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Vérification impossible.");
      }
      window.dispatchEvent(new Event("haitech-auth-changed"));
      router.push(data.redirectTo ?? (role === "etudiant" ? "/academy" : "/business-center"));
      router.refresh();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setFeedback("");
    setInfo("");
    const response = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() })
    });
    const data = (await response.json()) as { success?: boolean; message?: string; devOtpCode?: string };
    if (!response.ok || !data.success) {
      setFeedback(data.message ?? "Impossible d'envoyer le code.");
      return;
    }
    if (data.devOtpCode) {
      const newCode = data.devOtpCode.replace(/\D/g, "").slice(0, 6);
      setDigits(Array.from({ length: 6 }, (_, i) => newCode[i] ?? ""));
      setInfo(`Mode test actif: votre code OTP est ${data.devOtpCode}`);
    } else {
      setInfo("Nouveau code envoyé par email.");
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 p-6">
      <h1 className="font-heading text-2xl font-bold text-haitechBlue">Vérification email</h1>
      <p className="text-sm text-slate-600">Entrez le code OTP envoyé par email.</p>
      <input
        className="w-full rounded-lg border p-3"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.com"
        required
      />
      <div className="flex items-center gap-2">
        {digits.map((digit, index) => (
          <input
            key={`otp-${index}`}
            ref={(element) => {
              inputsRef.current[index] = element;
            }}
            className="h-12 w-11 rounded-lg border text-center text-lg font-semibold"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            onChange={(e) => updateDigit(index, e.target.value)}
            onKeyDown={(e) => onKeyDown(index, e)}
            onPaste={onPaste}
            aria-label={`Chiffre OTP ${index + 1}`}
          />
        ))}
      </div>
      {devOtpHint ? <p className="text-xs text-amber-700">Code dev: {devOtpHint}</p> : null}
      {info ? <p className="text-sm text-emerald-700">{info}</p> : null}
      <div className="flex gap-3">
        <button
          onClick={verify}
          disabled={loading || code.length !== 6}
          className="rounded-full bg-haitechBlue px-5 py-2.5 font-semibold text-white disabled:opacity-70"
        >
          {loading ? "Vérification..." : "Valider"}
        </button>
        <button onClick={resend} className="rounded-full border px-5 py-2.5 font-semibold text-haitechBlue">
          Renvoyer le code
        </button>
      </div>
      {feedback ? <p className="text-sm text-red-600">{feedback}</p> : null}
    </div>
  );
}
