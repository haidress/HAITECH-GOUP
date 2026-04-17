import { z } from "zod";
import { hash } from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";
import { fail, ok } from "@/lib/api-response";

const createSchema = z.object({
  nom: z.string().trim().min(2).max(120),
  prenom: z.string().trim().min(2).max(120),
  email: z.email(),
  telephone: z.string().trim().min(8).max(30),
  password: z.string().min(8),
  niveau: z.enum(["N1", "N2", "terrain"]),
  specialites: z.string().trim().max(255).optional()
});

export async function GET() {
  if (!(await isAdminAuthenticated())) return fail("Non autorisé.", "UNAUTHORIZED", 401);
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT u.id, u.nom, u.prenom, u.email, u.telephone, u.statut, tp.niveau, tp.specialites, tp.disponibilite
    FROM users u
    INNER JOIN roles r ON r.id = u.role_id
    LEFT JOIN technician_profiles tp ON tp.user_id = u.id
    WHERE r.nom = 'technicien'
    ORDER BY u.nom ASC
    `
  );
  return ok(rows);
}

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  if (!(await isAdminAuthenticated())) return fail("Non autorisé.", "UNAUTHORIZED", 401);
  const payload = await request.json();
  const parsed = createSchema.safeParse(payload);
  if (!parsed.success) return fail("Données invalides.", "VALIDATION_ERROR", 400);

  const pool = getDbPool();
  const [exists] = await pool.query<RowDataPacket[]>("SELECT id FROM users WHERE email = ? LIMIT 1", [parsed.data.email]);
  if (exists.length) return fail("Email déjà utilisé.", "VALIDATION_ERROR", 409);

  const [roleRows] = await pool.query<RowDataPacket[]>("SELECT id FROM roles WHERE nom = 'technicien' LIMIT 1");
  if (!roleRows.length) return fail("Rôle technicien introuvable.", "NOT_FOUND", 404);
  const passwordHash = await hash(parsed.data.password, 10);
  const [insert] = await pool.execute(
    `
    INSERT INTO users (nom, prenom, email, telephone, password_hash, email_verifie, role_id, statut)
    VALUES (?, ?, ?, ?, ?, 1, ?, 'actif')
    `,
    [parsed.data.nom, parsed.data.prenom, parsed.data.email, parsed.data.telephone, passwordHash, Number(roleRows[0].id)]
  );
  const userId = (insert as { insertId: number }).insertId;
  await pool.execute(
    `
    INSERT INTO technician_profiles (user_id, niveau, specialites, disponibilite)
    VALUES (?, ?, ?, 'disponible')
    `,
    [userId, parsed.data.niveau, parsed.data.specialites ?? null]
  );
  return ok({ userId });
}
