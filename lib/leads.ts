import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";

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
};

export async function listLeads(filters?: { statut?: LeadStatus; source?: LeadSource }) {
  const pool = getDbPool();
  const clauses: string[] = [];
  const values: Array<string> = [];

  if (filters?.statut) {
    clauses.push("statut = ?");
    values.push(filters.statut);
  }
  if (filters?.source) {
    clauses.push("source = ?");
    values.push(filters.source);
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT id, nom, email, telephone, source, besoin, budget, statut, created_at
    FROM leads
    ${where}
    ORDER BY created_at DESC
    LIMIT 200
    `,
    values
  );

  return rows as unknown as LeadRecord[];
}

export async function updateLeadStatus(id: number, status: LeadStatus) {
  const pool = getDbPool();
  await pool.execute("UPDATE leads SET statut = ? WHERE id = ?", [status, id]);
}
