import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { appendLeadBesoinBlock, normalizeLeadEmail, normalizeLeadPhoneDigits } from "@/lib/lead-normalize";

export type LeadStatus = "nouveau" | "qualifie" | "converti" | "perdu";
export type LeadSource = "site" | "whatsapp" | "autre";

export type LeadRecord = {
  id: number;
  nom: string;
  email: string;
  telephone: string | null;
  source: LeadSource;
  besoin: string;
  budget: number | null;
  statut: LeadStatus;
  created_at: string;
  updated_at?: string;
  assigned_user_id: number | null;
  assigned_label: string | null;
  assigned_email: string | null;
  last_followup_email_at: string | null;
};

function isUnknownLeadColumnError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const err = error as NodeJS.ErrnoException;
  return err.code === "ER_BAD_FIELD_ERROR" || /Unknown column/i.test(err.message);
}

export async function listLeads(filters?: { statut?: LeadStatus; source?: LeadSource }) {
  const pool = getDbPool();
  const clauses: string[] = [];
  const values: Array<string> = [];

  if (filters?.statut) {
    clauses.push("l.statut = ?");
    values.push(filters.statut);
  }
  if (filters?.source) {
    clauses.push("l.source = ?");
    values.push(filters.source);
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const fullSql = `
    SELECT
      l.id,
      l.nom,
      l.email,
      l.telephone,
      l.source,
      l.besoin,
      l.budget,
      l.statut,
      l.created_at,
      l.updated_at,
      l.assigned_user_id,
      l.last_followup_email_at,
      TRIM(CONCAT(COALESCE(u.prenom, ''), ' ', COALESCE(u.nom, ''))) AS assigned_label,
      u.email AS assigned_email
    FROM leads l
    LEFT JOIN users u ON u.id = l.assigned_user_id
    ${where}
    ORDER BY l.created_at DESC
    LIMIT 200
    `;

  try {
    const [rows] = await pool.query<RowDataPacket[]>(fullSql, values);
    return rows as unknown as LeadRecord[];
  } catch (error) {
    if (!isUnknownLeadColumnError(error)) throw error;
    const legacySql = `
    SELECT
      l.id,
      l.nom,
      l.email,
      l.telephone,
      l.source,
      l.besoin,
      l.budget,
      l.statut,
      l.created_at,
      NULL AS updated_at,
      NULL AS assigned_user_id,
      NULL AS last_followup_email_at,
      NULL AS assigned_label,
      NULL AS assigned_email
    FROM leads l
    ${where}
    ORDER BY l.created_at DESC
    LIMIT 200
    `;
    const [rows] = await pool.query<RowDataPacket[]>(legacySql, values);
    return rows as unknown as LeadRecord[];
  }
}

export async function updateLeadStatus(id: number, status: LeadStatus) {
  const pool = getDbPool();
  await pool.execute("UPDATE leads SET statut = ? WHERE id = ?", [status, id]);
}

export async function updateLeadAssignment(id: number, assignedUserId: number | null) {
  const pool = getDbPool();
  await pool.execute("UPDATE leads SET assigned_user_id = ? WHERE id = ?", [assignedUserId, id]);
}

export async function findDuplicateLeadId(email: string, telephone: string | null | undefined) {
  const pool = getDbPool();
  const emailNorm = normalizeLeadEmail(email);
  const phoneNorm = normalizeLeadPhoneDigits(telephone);

  const tryPhoneSql = `
    SELECT id
    FROM leads
    WHERE LOWER(TRIM(email)) = ?
       OR (
         ? IS NOT NULL
         AND CHAR_LENGTH(?) >= 8
         AND REGEXP_REPLACE(IFNULL(telephone, ''), '[^0-9]', '') = ?
       )
    ORDER BY created_at DESC
    LIMIT 1
  `;

  try {
    const [rows] = await pool.query<RowDataPacket[]>(tryPhoneSql, [
      emailNorm,
      phoneNorm,
      phoneNorm ?? "",
      phoneNorm ?? ""
    ]);
    if (!Array.isArray(rows) || rows.length === 0) return null;
    return Number((rows[0] as { id: number }).id);
  } catch {
    const [rowsEmail] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM leads WHERE LOWER(TRIM(email)) = ? ORDER BY created_at DESC LIMIT 1`,
      [emailNorm]
    );
    if (Array.isArray(rowsEmail) && rowsEmail.length > 0) {
      return Number((rowsEmail[0] as { id: number }).id);
    }
    if (!phoneNorm) return null;
    const [candidates] = await pool.query<RowDataPacket[]>(
      `
      SELECT id, telephone
      FROM leads
      WHERE telephone IS NOT NULL AND telephone != ''
      ORDER BY created_at DESC
      LIMIT 400
      `
    );
    for (const c of candidates as Array<{ id: number; telephone: string | null }>) {
      if (normalizeLeadPhoneDigits(c.telephone) === phoneNorm) return c.id;
    }
    return null;
  }
}

export async function mergeLeadDuplicate({
  leadId,
  besoin,
  budget
}: {
  leadId: number;
  besoin: string;
  budget: number | null;
}) {
  const pool = getDbPool();
  const [cur] = await pool.query<RowDataPacket[]>("SELECT besoin, budget FROM leads WHERE id = ? LIMIT 1", [leadId]);
  const row = cur[0] as { besoin: string; budget: number | null } | undefined;
  if (!row) return;
  const mergedBesoin = appendLeadBesoinBlock(row.besoin, besoin);
  await pool.execute(
    "UPDATE leads SET besoin = ?, budget = COALESCE(?, budget), statut = IF(statut = 'perdu', 'nouveau', statut) WHERE id = ?",
    [mergedBesoin, budget, leadId]
  );
}

export async function insertLeadRow(input: {
  nom: string;
  email: string;
  telephone: string | null;
  source: LeadSource;
  besoin: string;
  budget: number | null;
}) {
  const pool = getDbPool();
  await pool.execute(
    `
    INSERT INTO leads (nom, email, telephone, source, besoin, budget, statut)
    VALUES (?, ?, ?, ?, ?, ?, 'nouveau')
    `,
    [input.nom, input.email, input.telephone, input.source, input.besoin, input.budget]
  );
}

export async function countLeadsByStatus(): Promise<Record<LeadStatus, number>> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT statut, COUNT(*) AS n
    FROM leads
    GROUP BY statut
    `
  );
  const out: Record<LeadStatus, number> = {
    nouveau: 0,
    qualifie: 0,
    converti: 0,
    perdu: 0
  };
  for (const r of rows as Array<{ statut: LeadStatus; n: number }>) {
    if (r.statut in out) out[r.statut] = Number(r.n);
  }
  return out;
}

export async function createLeadWithDedup(input: {
  nom: string;
  email: string;
  telephone: string | null;
  source: LeadSource;
  besoin: string;
  budget: number | null;
}): Promise<{ merged: boolean; leadId?: number }> {
  const dupId = await findDuplicateLeadId(input.email, input.telephone);
  if (dupId) {
    await mergeLeadDuplicate({ leadId: dupId, besoin: input.besoin, budget: input.budget });
    return { merged: true, leadId: dupId };
  }
  await insertLeadRow(input);
  return { merged: false };
}
