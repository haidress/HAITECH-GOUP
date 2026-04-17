import { NextResponse } from "next/server";
import { z } from "zod";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";

const createFormationSchema = z.object({
  titre: z.string().min(2).max(180),
  description: z.string().max(6000).optional().nullable(),
  prix: z.coerce.number().min(0),
  niveau: z.string().max(80).optional().nullable(),
  duree: z.string().max(80).optional().nullable(),
  image: z.string().max(255).optional().nullable()
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  try {
    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, titre, description, prix, niveau, duree, image FROM formations ORDER BY id DESC"
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Erreur GET admin/formations:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;

  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = createFormationSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Données invalides.", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const pool = getDbPool();
    const [result] = await pool.execute(
      "INSERT INTO formations (titre, description, prix, niveau, duree, image) VALUES (?, ?, ?, ?, ?, ?)",
      [data.titre, data.description ?? null, data.prix, data.niveau ?? null, data.duree ?? null, data.image ?? null]
    );

    return NextResponse.json({ success: true, id: (result as { insertId: number }).insertId });
  } catch (error) {
    console.error("Erreur POST admin/formations:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
