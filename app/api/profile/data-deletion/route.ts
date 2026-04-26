import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { anonymizeUserAccount } from "@/lib/profile-data";
import { ensureSameOrigin } from "@/lib/request-security";
import { writeAuditLog } from "@/lib/audit-log";

const schema = z.object({
  confirmation: z.literal("SUPPRIMER_MES_DONNEES")
});

export async function POST(request: Request) {
  const originGuard = ensureSameOrigin(request);
  if (originGuard) return originGuard;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  if (user.role === "admin") {
    return NextResponse.json(
      {
        success: false,
        message: "Les comptes administrateur ne peuvent pas être anonymisés via ce flux automatique."
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Confirmation requise : corps JSON { "confirmation": "SUPPRIMER_MES_DONNEES" } pour anonymiser définitivement le compte.'
        },
        { status: 400 }
      );
    }

    await anonymizeUserAccount(user.id);
    await writeAuditLog({
      actorUserId: user.id,
      action: "PROFILE_DATA_DELETION_REQUESTED",
      resourceType: "user",
      resourceId: user.id
    });
    return NextResponse.json({
      success: true,
      message: "Compte anonymisé. Déconnectez-vous : la session ne sera plus valide après rafraîchissement."
    });
  } catch (error) {
    console.error("data-deletion:", error);
    return NextResponse.json({ success: false, message: "Opération impossible." }, { status: 500 });
  }
}
