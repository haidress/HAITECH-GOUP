import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getDbPool } from "@/lib/db";
import { ensureSameOrigin } from "@/lib/request-security";
import { fail, ok } from "@/lib/api-response";

const schema = z.object({
  statut: z.enum(["planifiee", "en_cours", "terminee", "reportee"]).optional(),
  checkinAt: z.string().trim().min(10).optional(),
  checkoutAt: z.string().trim().min(10).optional(),
  laborMinutes: z.number().int().min(0).optional(),
  laborCost: z.number().min(0).optional(),
  interventionSummary: z.string().trim().max(4000).optional()
});

export async function PATCH(
  request: Request,
  context: {
    params: { id: string };
  }
) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  const user = await getCurrentUser();
  if (!user || (user.role !== "technicien" && user.role !== "admin")) return fail("Non autorisé.", "UNAUTHORIZED", 401);
  const id = Number(context.params.id);
  if (!Number.isFinite(id) || id <= 0) return fail("Identifiant invalide.", "VALIDATION_ERROR", 400);
  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return fail("Données invalides.", "VALIDATION_ERROR", 400);

  const changes: string[] = [];
  const values: Array<string | number | null> = [];
  if (parsed.data.statut !== undefined) {
    changes.push("statut = ?");
    values.push(parsed.data.statut);
  }
  if (parsed.data.checkinAt !== undefined) {
    changes.push("checkin_at = ?");
    values.push(parsed.data.checkinAt);
  }
  if (parsed.data.checkoutAt !== undefined) {
    changes.push("checkout_at = ?");
    values.push(parsed.data.checkoutAt);
  }
  if (parsed.data.laborMinutes !== undefined) {
    changes.push("labor_minutes = ?");
    values.push(parsed.data.laborMinutes);
  }
  if (parsed.data.laborCost !== undefined) {
    changes.push("labor_cost = ?");
    values.push(parsed.data.laborCost);
  }
  if (parsed.data.interventionSummary !== undefined) {
    changes.push("intervention_summary = ?");
    values.push(parsed.data.interventionSummary || null);
  }
  if (!changes.length) return fail("Aucune modification reçue.", "VALIDATION_ERROR", 400);

  const pool = getDbPool();
  await pool.execute(
    `
    UPDATE maintenance_interventions
    SET ${changes.join(", ")}
    WHERE id = ? AND assigned_technician_user_id = ?
    `,
    [...values, id, user.id]
  );
  return ok({ updated: true });
}
