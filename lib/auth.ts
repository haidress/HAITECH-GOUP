import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";

export const SESSION_COOKIE = "haitech_session";

export type AuthUser = {
  id: number;
  nom: string;
  prenom: string | null;
  email: string;
  role: string;
  statut: "actif" | "suspendu";
  emailVerifie: boolean;
};

export type UserRole = "admin" | "client" | "etudiant" | "technicien";

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function verifyCredentials(email: string, password: string): Promise<AuthUser | null> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT u.id, u.nom, u.prenom, u.email, u.password_hash, u.statut, r.nom as role
         , u.email_verifie
    FROM users u
    INNER JOIN roles r ON r.id = u.role_id
    WHERE u.email = ?
    LIMIT 1
    `,
    [email]
  );

  if (!rows.length) return null;
  const row = rows[0];
  if (row.statut !== "actif") return null;
  if (!row.email_verifie) return null;

  const validPassword = await compare(password, row.password_hash);
  if (!validPassword) return null;

  return {
    id: Number(row.id),
    nom: row.nom,
    prenom: row.prenom,
    email: row.email,
    role: row.role,
    statut: row.statut,
    emailVerifie: Boolean(row.email_verifie)
  };
}

export async function createSession(userId: number): Promise<string> {
  const pool = getDbPool();
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(token);
  await pool.execute(
    `
    INSERT INTO sessions (user_id, token, date_expiration)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
    `,
    [userId, tokenHash]
  );
  return token;
}

export async function deleteSession(token: string) {
  const pool = getDbPool();
  const tokenHash = hashSessionToken(token);
  await pool.execute("DELETE FROM sessions WHERE token = ? OR token = ?", [tokenHash, token]);
}

export async function getUserFromSessionToken(token: string): Promise<AuthUser | null> {
  const pool = getDbPool();
  const tokenHash = hashSessionToken(token);
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT u.id, u.nom, u.prenom, u.email, u.statut, r.nom as role
         , u.email_verifie
    FROM sessions s
    INNER JOIN users u ON u.id = s.user_id
    INNER JOIN roles r ON r.id = u.role_id
    WHERE (s.token = ? OR s.token = ?) AND s.date_expiration > NOW()
    LIMIT 1
    `,
    [tokenHash, token]
  );

  if (!rows.length) return null;
  const row = rows[0];
  if (row.statut !== "actif") return null;
  if (!row.email_verifie) return null;

  return {
    id: Number(row.id),
    nom: row.nom,
    prenom: row.prenom,
    email: row.email,
    role: row.role,
    statut: row.statut,
    emailVerifie: Boolean(row.email_verifie)
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getUserFromSessionToken(token);
}

export async function requireRole(roles: UserRole[]) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (!roles.includes(user.role as UserRole)) {
    redirect("/acces-interdit");
  }
  return user;
}

export async function requireAdminUser() {
  return requireRole(["admin"]);
}
