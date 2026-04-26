import { RowDataPacket } from "mysql2";
import { randomBytes } from "crypto";
import { hash } from "bcryptjs";
import { getDbPool } from "@/lib/db";

export async function exportUserPersonalData(userId: number) {
  const pool = getDbPool();
  const [users] = await pool.query<RowDataPacket[]>(
    `
    SELECT u.id, u.nom, u.prenom, u.email, u.telephone, u.email_verifie, u.statut, u.created_at, r.nom AS role
    FROM users u
    INNER JOIN roles r ON r.id = u.role_id
    WHERE u.id = ?
    LIMIT 1
    `,
    [userId]
  );
  const userRow = users[0] as { email?: string } | undefined;
  const email = userRow?.email ?? "";

  const [clients] = await pool.query<RowDataPacket[]>(
    "SELECT id, entreprise, adresse, type_client, created_at FROM clients WHERE user_id = ? LIMIT 1",
    [userId]
  );
  const [orders] = await pool.query<RowDataPacket[]>(
    `
    SELECT id, reference_code, product_name, status, created_at, email, nom, contact
    FROM customer_orders
    WHERE email = ?
    ORDER BY created_at DESC
    LIMIT 200
    `,
    [email]
  );

  return {
    exportedAt: new Date().toISOString(),
    user: users[0] ?? null,
    client: clients[0] ?? null,
    orders
  };
}

export async function anonymizeUserAccount(userId: number) {
  const pool = getDbPool();
  const [cur] = await pool.query<RowDataPacket[]>("SELECT email FROM users WHERE id = ? LIMIT 1", [userId]);
  const previousEmail = (cur[0] as { email?: string } | undefined)?.email ?? "";

  const placeholderEmail = `deleted_${userId}_${Date.now()}@anonymized.invalid`;
  const randomPass = randomBytes(24).toString("hex");
  const password_hash = await hash(randomPass, 10);

  if (previousEmail) {
    const orderAnonEmail = `orders_anon_${userId}@invalid.local`;
    await pool.execute(
      "UPDATE customer_orders SET email = ?, nom = 'Anonyme', contact = '0' WHERE email = ?",
      [orderAnonEmail, previousEmail]
    );
  }

  await pool.execute("DELETE FROM sessions WHERE user_id = ?", [userId]);
  await pool.execute(
    `
    UPDATE users
    SET email = ?,
        nom = 'Compte',
        prenom = NULL,
        telephone = NULL,
        password_hash = ?,
        email_verifie = FALSE,
        statut = 'suspendu'
    WHERE id = ?
    `,
    [placeholderEmail, password_hash, userId]
  );

  await pool.execute(
    `
    UPDATE clients
    SET entreprise = NULL, adresse = NULL
    WHERE user_id = ?
    `,
    [userId]
  );
}
