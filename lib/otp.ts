import { randomInt } from "crypto";
import { getDbPool } from "@/lib/db";

export function generateOtpCode() {
  return String(randomInt(100000, 999999));
}

export async function createEmailOtp(userId: number, email: string, code: string) {
  const pool = getDbPool();
  await pool.execute("DELETE FROM email_verifications WHERE email = ?", [email]);
  await pool.execute(
    `
    INSERT INTO email_verifications (user_id, email, otp_code, expires_at)
    VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))
    `,
    [userId, email, code]
  );
}

export async function verifyEmailOtp(email: string, code: string) {
  const pool = getDbPool();
  const [rows] = await pool.query(
    `
    SELECT id, user_id
    FROM email_verifications
    WHERE email = ? AND otp_code = ? AND used = 0 AND expires_at > NOW()
    LIMIT 1
    `,
    [email, code]
  );
  const result = rows as Array<{ id: number; user_id: number }>;
  if (!result.length) return null;

  const record = result[0];
  await pool.execute("UPDATE users SET email_verifie = 1 WHERE id = ?", [record.user_id]);
  await pool.execute("UPDATE email_verifications SET used = 1 WHERE id = ?", [record.id]);
  return record.user_id;
}
