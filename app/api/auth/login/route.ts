import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, SESSION_COOKIE, verifyCredentials } from "@/lib/auth";
import { getDbPool, isMysqlConnectionCapacityError } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { checkRateLimit } from "@/lib/rate-limit";
import { ensureSameOrigin } from "@/lib/request-security";

const schema = z.object({
  email: z.email("Email invalide."),
  password: z.string().min(6, "Mot de passe invalide.")
});

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;

  const rate = checkRateLimit(request, "auth-login", 10, 60_000);
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

    const user = await verifyCredentials(parsed.data.email, parsed.data.password);
    if (!user) {
      const pool = getDbPool();
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT email_verifie FROM users WHERE email = ? LIMIT 1",
        [parsed.data.email]
      );
      if (rows.length && !rows[0].email_verifie) {
        return NextResponse.json(
          { success: false, message: "Email non vérifié. Veuillez valider le code OTP." },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { success: false, message: "Email ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    const token = await createSession(user.id);
    const response = NextResponse.json({ success: true, role: user.role });
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
    console.error("Erreur login:", error);
    if (isMysqlConnectionCapacityError(error)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Base de données saturée (trop de connexions MySQL). Fermez les autres outils connectés à la base, redémarrez MySQL ou augmentez max_connections, puis réessayez."
        },
        { status: 503 }
      );
    }
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
