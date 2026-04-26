import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  try {
    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT u.id, u.email, u.nom, u.prenom
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE r.nom = 'admin' AND u.statut = 'actif'
      ORDER BY u.email ASC
      `
    );
    const data = (rows as Array<{ id: number; email: string; nom: string; prenom: string | null }>).map((u) => ({
      id: u.id,
      email: u.email,
      label: `${[u.prenom, u.nom].filter(Boolean).join(" ").trim() || u.email}`
    }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET commercial-users:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
