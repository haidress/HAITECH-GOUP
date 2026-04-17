import { NextResponse } from "next/server";
import { z } from "zod";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { createEmailOtp, generateOtpCode } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { ensureSameOrigin } from "@/lib/request-security";

const schema = z.object({
  email: z.email("Email invalide.")
});

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;

  const rate = checkRateLimit(request, "auth-send-otp", 5, 60_000);
  if (!rate.ok) {
    return NextResponse.json(
      { success: false, message: `Trop de requêtes OTP. Réessayez dans ${rate.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    const payload = await request.json();
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });
    }

    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, email_verifie FROM users WHERE email = ? LIMIT 1",
      [parsed.data.email]
    );
    if (!rows.length) {
      return NextResponse.json({ success: false, message: "Utilisateur introuvable." }, { status: 404 });
    }
    if (rows[0].email_verifie) {
      return NextResponse.json({ success: false, message: "Email déjà vérifié." }, { status: 400 });
    }

    const code = generateOtpCode();
    await createEmailOtp(Number(rows[0].id), parsed.data.email, code);
    const emailResult = await sendOtpEmail(parsed.data.email, code);
    const allowDevOtpFallback = process.env.NODE_ENV === "development" && process.env.ALLOW_DEV_OTP_FALLBACK !== "false";
    if (!emailResult.delivered && !allowDevOtpFallback) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Le service email OTP n'est pas configuré. Configurez SMTP_HOST, SMTP_USER, SMTP_PASS et SMTP_FROM."
        },
        { status: 503 }
      );
    }
    return NextResponse.json({
      success: true,
      devOtpCode: !emailResult.delivered && allowDevOtpFallback ? code : undefined,
      otpFallbackMode: !emailResult.delivered && allowDevOtpFallback ? "dev-visible-code" : undefined
    });
  } catch (error) {
    console.error("Erreur send-otp:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
