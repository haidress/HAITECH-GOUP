import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getDbPool } from "@/lib/db";
import { ensureSameOrigin } from "@/lib/request-security";

const schema = z.object({
  nom: z.string().trim().min(2).optional(),
  prenom: z.string().trim().min(2).optional(),
  telephone: z.string().trim().min(8).max(30).optional()
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  const pool = getDbPool();
  const [rows] = await pool.query("SELECT nom, prenom, email, telephone FROM users WHERE id = ? LIMIT 1", [user.id]);
  return NextResponse.json({ success: true, data: (rows as Array<unknown>)[0] ?? null });
}

export async function PATCH(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });
  }

  const pool = getDbPool();
  await pool.execute(
    "UPDATE users SET nom = COALESCE(?, nom), prenom = COALESCE(?, prenom), telephone = COALESCE(?, telephone) WHERE id = ?",
    [parsed.data.nom ?? null, parsed.data.prenom ?? null, parsed.data.telephone ?? null, user.id]
  );

  return NextResponse.json({ success: true, message: "Profil mis à jour." });
}
