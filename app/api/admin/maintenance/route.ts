import { NextResponse } from "next/server";
import { z } from "zod";
import { RowDataPacket } from "mysql2";
import { getDbPool, isMysqlConnectionCapacityError } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";

const createSchema = z.object({
  clientId: z.number().int().positive(),
  titre: z.string().trim().min(3).max(180),
  details: z.string().trim().max(2000).optional(),
  interventionType: z.enum(["preventive", "corrective", "installation", "audit"]),
  statut: z.enum(["planifiee", "en_cours", "terminee", "reportee"]),
  scheduledAt: z.string().trim().min(10)
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  try {
    const pool = getDbPool();
    const [clients] = await pool.query<RowDataPacket[]>(
      `
      SELECT c.id, c.entreprise, c.type_client, u.nom, u.prenom, u.email
      FROM clients c
      INNER JOIN users u ON u.id = c.user_id
      WHERE c.type_client = 'entreprise'
      ORDER BY c.entreprise ASC, u.nom ASC
      `
    );
    const [items] = await pool.query<RowDataPacket[]>(
      `
      SELECT m.id, m.client_id, m.titre, m.details, m.intervention_type, m.statut, m.scheduled_at, m.created_at,
             m.assigned_technician_user_id, m.eta_at, m.checkin_at, m.checkout_at, m.labor_minutes, m.labor_cost,
             c.entreprise, u.nom, u.prenom,
             CONCAT(COALESCE(tu.nom, ''), ' ', COALESCE(tu.prenom, '')) AS technician_name
      FROM maintenance_interventions m
      INNER JOIN clients c ON c.id = m.client_id
      INNER JOIN users u ON u.id = c.user_id
      LEFT JOIN users tu ON tu.id = m.assigned_technician_user_id
      ORDER BY m.scheduled_at ASC
      `
    );
    const [technicians] = await pool.query<RowDataPacket[]>(
      `
      SELECT u.id, u.nom, u.prenom, tp.niveau, tp.specialites, tp.disponibilite
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      LEFT JOIN technician_profiles tp ON tp.user_id = u.id
      WHERE r.nom = 'technicien' AND u.statut = 'actif'
      ORDER BY u.nom ASC
      `
    );
    return NextResponse.json({ success: true, clients, technicians, data: items });
  } catch (error) {
    console.error("Erreur GET /api/admin/maintenance:", error);
    if (isMysqlConnectionCapacityError(error)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "MySQL refuse de nouvelles connexions (limite atteinte). Réduisez DB_CONNECTION_LIMIT / instances Next.js, fermez Workbench, ou augmentez max_connections sur le serveur MySQL."
        },
        { status: 503 }
      );
    }
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
    const parsed = createSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });
    }
    const data = parsed.data;
    const pool = getDbPool();
    await pool.execute(
      `
      INSERT INTO maintenance_interventions (client_id, titre, details, intervention_type, statut, scheduled_at)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [data.clientId, data.titre, data.details || null, data.interventionType, data.statut, data.scheduledAt]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur POST /api/admin/maintenance:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
