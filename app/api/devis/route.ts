import { NextResponse } from "next/server";
import { z } from "zod";
import { createDevis, listDevis } from "@/lib/devis";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";

const createSchema = z.object({
  leadId: z.number().int().positive().optional(),
  clientId: z.number().int().positive().optional(),
  remisePercent: z.number().min(0).max(100).optional(),
  tvaPercent: z.number().min(0).max(100).optional(),
  items: z
    .array(
      z.object({
        serviceId: z.number().int().positive(),
        quantite: z.number().int().positive(),
        prixUnitaire: z.number().positive()
      })
    )
    .min(1, "Ajoutez au moins une ligne.")
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  try {
    const data = await listDevis();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erreur GET devis:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;

  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = createSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });
    }

    const devisId = await createDevis(parsed.data);
    return NextResponse.json({ success: true, devisId });
  } catch (error) {
    console.error("Erreur POST devis:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
