import { NextResponse } from "next/server";
import { z } from "zod";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";

const createProductSchema = z.object({
  nom: z.string().min(2).max(140),
  description: z.string().max(4000).optional().nullable(),
  categorie: z.enum(["Business Center", "Boutique IT"]),
  prixBase: z.coerce.number().min(0),
  actif: z.boolean().optional()
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  try {
    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, nom, description, categorie, prix_base, actif FROM services ORDER BY id DESC"
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Erreur GET admin/products:", error);
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
    const parsed = createProductSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Données invalides.", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const pool = getDbPool();
    const data = parsed.data;
    const [result] = await pool.execute(
      "INSERT INTO services (nom, description, categorie, prix_base, actif) VALUES (?, ?, ?, ?, ?)",
      [data.nom, data.description ?? null, data.categorie, data.prixBase, data.actif ?? true]
    );

    return NextResponse.json({ success: true, id: (result as { insertId: number }).insertId });
  } catch (error) {
    console.error("Erreur POST admin/products:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
