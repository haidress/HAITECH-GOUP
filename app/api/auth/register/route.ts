import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { createEmailOtp, generateOtpCode } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import { checkRateLimitSmart } from "@/lib/rate-limit";
import { ensureSameOrigin } from "@/lib/request-security";

const schema = z.object({
  nom: z.string().trim().min(2, "Nom requis."),
  prenom: z.string().trim().min(2, "Prénom requis."),
  email: z.email("Email invalide."),
  telephone: z.string().trim().min(8, "Téléphone invalide.").max(30, "Téléphone invalide.").optional(),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  role: z.enum(["client", "etudiant"]),
  typeClient: z.enum(["particulier", "entreprise"]).optional()
});

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;

  const rate = await checkRateLimitSmart(request, "auth-register", 5, 60_000);
  if (!rate.ok) {
    return NextResponse.json(
      { success: false, message: `Trop de requêtes. Réessayez dans ${rate.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    const payload = await request.json();
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });
    }

    const { nom, prenom, email, telephone, password, role, typeClient } = parsed.data;
    const pool = getDbPool();

    const [existing] = await pool.query<RowDataPacket[]>("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Cet email est déjà utilisé." }, { status: 409 });
    }

    const [roleRows] = await pool.query<RowDataPacket[]>("SELECT id FROM roles WHERE nom = ? LIMIT 1", [role]);
    if (!roleRows.length) {
      return NextResponse.json({ success: false, message: "Rôle invalide." }, { status: 400 });
    }

    const passwordHash = await hash(password, 10);
    const [userInsert] = await pool.execute(
      `
      INSERT INTO users (nom, prenom, email, telephone, password_hash, role_id, statut, email_verifie)
      VALUES (?, ?, ?, ?, ?, ?, 'actif', 0)
      `,
      [nom, prenom, email, telephone ?? null, passwordHash, Number(roleRows[0].id)]
    );
    const userId = (userInsert as { insertId: number }).insertId;

    if (role === "client") {
      await pool.execute(
        `
        INSERT INTO clients (user_id, entreprise, adresse, type_client)
        VALUES (?, NULL, NULL, ?)
        `,
        [userId, typeClient ?? "particulier"]
      );
    }

    const otpCode = generateOtpCode();
    await createEmailOtp(userId, email, otpCode);
    const emailResult = await sendOtpEmail(email, otpCode);
    const allowDevOtpFallback = process.env.NODE_ENV === "development" && process.env.ALLOW_DEV_OTP_FALLBACK !== "false";
    if (!emailResult.delivered && !allowDevOtpFallback) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Le service email OTP n'est pas configuré. Configurez SMTP_HOST, SMTP_USER, SMTP_PASS et SMTP_FROM pour envoyer le code."
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      role,
      requiresEmailVerification: true,
      devOtpCode: !emailResult.delivered && allowDevOtpFallback ? otpCode : undefined,
      otpFallbackMode: !emailResult.delivered && allowDevOtpFallback ? "dev-visible-code" : undefined
    });
  } catch (error) {
    console.error("Erreur register:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
