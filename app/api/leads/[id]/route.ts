import { NextResponse } from "next/server";
import { z } from "zod";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { updateLeadAssignment, updateLeadStatus, type LeadStatus } from "@/lib/leads";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";

const patchSchema = z
  .object({
    statut: z.enum(["nouveau", "qualifie", "converti", "perdu"]).optional(),
    assigned_user_id: z.number().int().positive().nullable().optional()
  })
  .refine((b) => b.statut !== undefined || b.assigned_user_id !== undefined, {
    message: "Fournissez statut et/ou assigned_user_id."
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
    const parsed = patchSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });
    }

    if (parsed.data.assigned_user_id !== undefined && parsed.data.assigned_user_id !== null) {
      const pool = getDbPool();
      const [admins] = await pool.query<RowDataPacket[]>(
        `
        SELECT u.id
        FROM users u
        INNER JOIN roles r ON r.id = u.role_id
        WHERE u.id = ? AND r.nom = 'admin' AND u.statut = 'actif'
        LIMIT 1
        `,
        [parsed.data.assigned_user_id]
      );
      if (!Array.isArray(admins) || admins.length === 0) {
        return NextResponse.json({ success: false, message: "Commercial invalide." }, { status: 400 });
      }
    }

    if (parsed.data.statut !== undefined) {
      await updateLeadStatus(leadId, parsed.data.statut as LeadStatus);
    }
    if (parsed.data.assigned_user_id !== undefined) {
      await updateLeadAssignment(leadId, parsed.data.assigned_user_id ?? null);
    }

    return NextResponse.json({ success: true, message: "Lead mis à jour." });
  } catch (error) {
    console.error("Erreur PATCH lead:", error);
    return NextResponse.json(
      { success: false, message: "Impossible de mettre à jour le lead." },
      { status: 500 }
    );
  }
}
