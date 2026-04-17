import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";
import { fail, ok } from "@/lib/api-response";
import { buildMailtoUrl, sendWhatsAppNotification } from "@/lib/notifications";

const schema = z.object({
  to: z.string().trim().min(8).max(40),
  message: z.string().trim().min(2).max(1000)
});

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;
  if (!(await isAdminAuthenticated())) return fail("Non autorisé.", "UNAUTHORIZED", 401);

  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return fail("Données invalides.", "VALIDATION_ERROR", 400);

  const result = await sendWhatsAppNotification({
    to: parsed.data.to,
    message: parsed.data.message,
    eventType: "admin_whatsapp_test"
  });

  if (!result.sent) {
    const mailtoUrl = buildMailtoUrl(
      "contact@haitech-group.ci",
      "Demande de contact client",
      `Bonjour,\nMerci de contacter ce client: ${parsed.data.to}\nMessage: ${parsed.data.message}`
    );
    return ok({
      sent: false,
      fallback: true,
      provider: result.provider,
      whatsappRedirectUrl: result.redirect?.whatsappUrl,
      mailtoUrl
    });
  }

  return ok({ sent: true, provider: result.provider, status: result.status ?? 200 });
}
