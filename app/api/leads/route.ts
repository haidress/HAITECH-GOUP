import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";
import { createLeadWithDedup, listLeads, type LeadSource, type LeadStatus } from "@/lib/leads";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { checkRateLimitSmart } from "@/lib/rate-limit";
import { ensureSameOrigin } from "@/lib/request-security";
import { incrementMetric, logApiCompletion, nowMs } from "@/lib/observability";

function isLeadStatus(value: string): value is LeadStatus {
  return ["nouveau", "qualifie", "converti", "perdu"].includes(value);
}

function isLeadSource(value: string): value is LeadSource {
  return ["site", "whatsapp", "autre"].includes(value);
}

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statut = searchParams.get("statut");
    const source = searchParams.get("source");

    const rows = await listLeads({
      statut: statut && isLeadStatus(statut) ? statut : undefined,
      source: source && isLeadSource(source) ? source : undefined
    });

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Erreur GET leads:", error);
    return NextResponse.json(
      { success: false, message: "Impossible de charger les leads." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const startedAt = nowMs();
  incrementMetric("api_requests_total");
  const originGuard = ensureSameOrigin(request);
  if (originGuard) {
    logApiCompletion({ route: "/api/leads", method: "POST", status: originGuard.status, startedAt });
    return originGuard;
  }

  const rate = await checkRateLimitSmart(request, "public-leads", 8, 60_000);
  if (!rate.ok) {
    incrementMetric("api_errors_total");
    logApiCompletion({ route: "/api/leads", method: "POST", status: 429, startedAt });
    return NextResponse.json(
      { success: false, message: `Trop de soumissions. Réessayez dans ${rate.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    const payload = await request.json();
    const parsed = leadSchema.safeParse(payload);

    if (!parsed.success) {
      incrementMetric("api_errors_total");
      logApiCompletion({ route: "/api/leads", method: "POST", status: 400, startedAt });
      return NextResponse.json(
        {
          success: false,
          message: "Données invalides.",
          errors: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const { nom, email, telephone, source, besoin, budget } = parsed.data;

    await createLeadWithDedup({
      nom,
      email,
      telephone: telephone ?? null,
      source,
      besoin,
      budget: budget ?? null
    });

    logApiCompletion({ route: "/api/leads", method: "POST", status: 200, startedAt });
    return NextResponse.json({
      success: true,
      message: "Votre demande a bien été enregistrée."
    });
  } catch (error) {
    console.error("Erreur API leads:", error);
    incrementMetric("api_errors_total");
    logApiCompletion({ route: "/api/leads", method: "POST", status: 500, startedAt });
    return NextResponse.json(
      {
        success: false,
        message: "Impossible d'enregistrer la demande pour le moment."
      },
      { status: 500 }
    );
  }
}
