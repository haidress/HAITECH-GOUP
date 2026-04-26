import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ensureSameOrigin } from "@/lib/request-security";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !["admin", "super_admin"].includes(user.role)) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  try {
    const pool = getDbPool();
    const [roles] = await pool.query<RowDataPacket[]>(
      "SELECT id, nom FROM roles WHERE nom IN ('admin','super_admin','catalog_manager','sales_manager','technicien','client','etudiant') ORDER BY nom ASC"
    );
    const [users] = await pool.query<RowDataPacket[]>(
      `
      SELECT u.id, u.nom, u.prenom, u.email, u.statut, r.nom AS role
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      ORDER BY u.id DESC
      LIMIT 200
      `
    );
    return NextResponse.json({ success: true, data: { roles, users } });
  } catch (error) {
    console.error("Erreur GET /api/admin/roles:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  const user = await getCurrentUser();
  if (!user || !["admin", "super_admin"].includes(user.role)) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  try {
    const payload = (await request.json()) as { userId?: number; roleName?: string };
    const userId = Number(payload.userId ?? 0);
    const roleName = String(payload.roleName ?? "");
    if (!Number.isFinite(userId) || userId <= 0 || !roleName) {
      return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });
    }
    const pool = getDbPool();
    const [roleRows] = await pool.query<RowDataPacket[]>("SELECT id FROM roles WHERE nom = ? LIMIT 1", [roleName]);
    if (!roleRows.length) {
      return NextResponse.json({ success: false, message: "Rôle introuvable." }, { status: 404 });
    }
    await pool.execute("UPDATE users SET role_id = ? WHERE id = ?", [Number(roleRows[0].id), userId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur PATCH /api/admin/roles:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
