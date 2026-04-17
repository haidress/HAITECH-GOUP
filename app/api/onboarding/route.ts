import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getDbPool } from "@/lib/db";
import { ensureSameOrigin } from "@/lib/request-security";
import { fail, ok } from "@/lib/api-response";

const schema = z.object({
  roleTarget: z.enum(["client", "etudiant"]),
  primaryGoal: z.string().trim().max(180).optional(),
  companySize: z.string().trim().max(80).optional()
});

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  const user = await getCurrentUser();
  if (!user) return fail("Non autorisé.", "UNAUTHORIZED", 401);
  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return fail("Données invalides.", "VALIDATION_ERROR", 400);
  const pool = getDbPool();
  await pool.execute(
    `
    INSERT INTO onboarding_profiles (user_id, role_target, primary_goal, company_size, onboarding_done)
    VALUES (?, ?, ?, ?, 1)
    ON DUPLICATE KEY UPDATE
      role_target = VALUES(role_target),
      primary_goal = VALUES(primary_goal),
      company_size = VALUES(company_size),
      onboarding_done = 1
    `,
    [user.id, parsed.data.roleTarget, parsed.data.primaryGoal ?? null, parsed.data.companySize ?? null]
  );
  return ok({ saved: true });
}
