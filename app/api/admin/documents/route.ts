import { z } from "zod";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";
import { fail, ok } from "@/lib/api-response";

const schema = z.object({
  clientId: z.number().int().positive(),
  title: z.string().trim().min(2).max(200),
  docType: z.enum(["bon_intervention", "rapport_pdf", "pv_recette", "devis", "facture", "autre"]),
  fileUrl: z.string().trim().min(5).max(255),
  visibleToClient: z.boolean().default(true)
});

export async function GET() {
  if (!(await isAdminAuthenticated())) return fail("Non autorisé.", "UNAUTHORIZED", 401);
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT d.id, d.client_id, d.title, d.doc_type, d.file_url, d.visible_to_client, d.created_at,
           c.entreprise, u.nom, u.prenom
    FROM client_documents d
    INNER JOIN clients c ON c.id = d.client_id
    INNER JOIN users u ON u.id = c.user_id
    ORDER BY d.created_at DESC
    `
  );
  const [clients] = await pool.query<RowDataPacket[]>(
    `
    SELECT c.id, c.entreprise, u.nom, u.prenom
    FROM clients c
    INNER JOIN users u ON u.id = c.user_id
    ORDER BY c.entreprise ASC, u.nom ASC
    `
  );
  return ok({ documents: rows, clients });
}

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  if (!(await isAdminAuthenticated())) return fail("Non autorisé.", "UNAUTHORIZED", 401);
  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return fail("Données invalides.", "VALIDATION_ERROR", 400);
  const data = parsed.data;
  const pool = getDbPool();
  await pool.execute(
    `
    INSERT INTO client_documents (client_id, title, doc_type, file_url, visible_to_client)
    VALUES (?, ?, ?, ?, ?)
    `,
    [data.clientId, data.title, data.docType, data.fileUrl, data.visibleToClient ? 1 : 0]
  );
  return ok({ created: true });
}
