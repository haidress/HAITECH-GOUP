import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";

const updateFormationSchema = z.object({
  titre: z.string().min(2).max(180),
  description: z.string().max(6000).optional().nullable(),
  prix: z.coerce.number().min(0),
  niveau: z.string().max(80).optional().nullable(),
  duree: z.string().max(80).optional().nullable(),
  image: z.string().max(255).optional().nullable()
});

function parseId(idParam: string) {
  const id = Number(idParam);
  return Number.isFinite(id) && id > 0 ? id : null;
}

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

  const id = parseId(context.params.id);
  if (!id) {
    return NextResponse.json({ success: false, message: "Identifiant invalide." }, { status: 400 });
  }

  try {
    const payload = await request.json();
    const parsed = updateFormationSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Données invalides.", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const pool = getDbPool();
    await pool.execute(
      "UPDATE formations SET titre = ?, description = ?, prix = ?, niveau = ?, duree = ?, image = ? WHERE id = ?",
      [data.titre, data.description ?? null, data.prix, data.niveau ?? null, data.duree ?? null, data.image ?? null, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur PATCH admin/formations/[id]:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(
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

  const id = parseId(context.params.id);
  if (!id) {
    return NextResponse.json({ success: false, message: "Identifiant invalide." }, { status: 400 });
  }

  try {
    const pool = getDbPool();
    await pool.execute("DELETE FROM formations WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE admin/formations/[id]:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
