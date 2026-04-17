import { z } from "zod";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";
import { fail, ok } from "@/lib/api-response";

const schema = z.object({
  visibleToClient: z.boolean().optional(),
  title: z.string().trim().min(2).max(200).optional()
});

export async function PATCH(
  request: Request,
  context: {
    params: { id: string };
  }
) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  if (!(await isAdminAuthenticated())) return fail("Non autorisé.", "UNAUTHORIZED", 401);
  const id = Number(context.params.id);
  if (!Number.isFinite(id) || id <= 0) return fail("Identifiant invalide.", "VALIDATION_ERROR", 400);
  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return fail("Données invalides.", "VALIDATION_ERROR", 400);

  const updates: string[] = [];
  const values: Array<string | number> = [];
  if (parsed.data.visibleToClient !== undefined) {
    updates.push("visible_to_client = ?");
    values.push(parsed.data.visibleToClient ? 1 : 0);
  }
  if (parsed.data.title !== undefined) {
    updates.push("title = ?");
    values.push(parsed.data.title);
  }
  if (!updates.length) return fail("Aucune modification reçue.", "VALIDATION_ERROR", 400);
  const pool = getDbPool();
  await pool.execute(
    `
    UPDATE client_documents
    SET ${updates.join(", ")}
    WHERE id = ?
    `,
    [...values, id]
  );
  return ok({ updated: true });
}
