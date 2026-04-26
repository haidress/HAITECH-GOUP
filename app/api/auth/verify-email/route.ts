import { NextResponse } from "next/server";
import { z } from "zod";
import { RowDataPacket } from "mysql2";
import { createSession, SESSION_COOKIE } from "@/lib/auth";
import { verifyEmailOtp } from "@/lib/otp";
import { checkRateLimitSmart } from "@/lib/rate-limit";
import { ensureSameOrigin } from "@/lib/request-security";
import { getDbPool } from "@/lib/db";

const schema = z.object({
  email: z.email("Email invalide."),
  code: z.string().trim().length(6, "Code OTP invalide.")
});

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;

  const rate = await checkRateLimitSmart(request, "auth-verify-otp", 10, 60_000);
  if (!rate.ok) {
    return NextResponse.json(
      { success: false, message: `Trop de tentatives. Réessayez dans ${rate.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    const payload = await request.json();
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });
    }

    const userId = await verifyEmailOtp(parsed.data.email, parsed.data.code);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Code OTP invalide ou expiré." }, { status: 400 });
    }

    const pool = getDbPool();
    const [roleRows] = await pool.query<RowDataPacket[]>(
      `
      SELECT r.nom AS role_name
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE u.id = ?
      LIMIT 1
      `,
      [userId]
    );
    const roleName = roleRows[0]?.role_name as string | undefined;
    const redirectTo =
      roleName === "etudiant" || roleName === "client" ? `/bienvenue?role=${encodeURIComponent(roleName)}` : "/";

    const token = await createSession(userId);
    const response = NextResponse.json({ success: true, redirectTo });
    response.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    return response;
  } catch (error) {
    console.error("Erreur verify-email:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
