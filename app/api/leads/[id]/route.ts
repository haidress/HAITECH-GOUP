import { NextResponse } from "next/server";
import { z } from "zod";
import { updateLeadStatus, type LeadStatus } from "@/lib/leads";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";

const statusSchema = z.object({
  statut: z.enum(["nouveau", "qualifie", "converti", "perdu"])
});

export async function PATCH(
  request: Request,
  context: {
    params: { id: string };
  }
) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;

  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  try {
    const leadId = Number(context.params.id);
    if (!Number.isFinite(leadId) || leadId <= 0) {
      return NextResponse.json({ success: false, message: "Identifiant invalide." }, { status: 400 });
    }

    const payload = await request.json();
    const parsed = statusSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Statut invalide." }, { status: 400 });
    }

    await updateLeadStatus(leadId, parsed.data.statut as LeadStatus);
    return NextResponse.json({ success: true, message: "Statut mis à jour." });
  } catch (error) {
    console.error("Erreur PATCH lead:", error);
    return NextResponse.json(
      { success: false, message: "Impossible de mettre à jour le lead." },
      { status: 500 }
    );
  }
}
