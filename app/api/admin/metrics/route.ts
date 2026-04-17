import { isAdminAuthenticated } from "@/lib/admin-guard";
import { getMetricsSnapshot } from "@/lib/observability";
import { fail, ok } from "@/lib/api-response";

export async function GET() {
  if (!(await isAdminAuthenticated())) return fail("Non autorisé.", "UNAUTHORIZED", 401);
  return ok(getMetricsSnapshot());
}
