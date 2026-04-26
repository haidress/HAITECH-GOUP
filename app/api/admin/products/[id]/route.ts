import { NextResponse } from "next/server";
import { z } from "zod";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";

const updateProductSchema = z.object({
  nom: z.string().min(2).max(140),
  description: z.string().max(4000).optional().nullable(),
  categorie: z.enum(["Business Center", "Boutique IT"]),
  prixBase: z.coerce.number().min(0),
  prixInitial: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.coerce.number().min(0).optional()
  ),
  imageUrl: z.preprocess(
    (value) => {
      if (value === undefined) return undefined;
      if (value === "" || value == null) return null;
      return value;
    },
    z.union([z.string().max(512), z.null()]).optional()
  ),
  actif: z.boolean()
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
    const parsed = updateProductSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Données invalides.", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const pool = getDbPool();
    if (data.imageUrl !== undefined) {
      await pool.execute(
        "UPDATE services SET nom = ?, description = ?, categorie = ?, prix_base = ?, prix_initial = ?, image_url = ?, actif = ? WHERE id = ?",
        [
          data.nom,
          data.description ?? null,
          data.categorie,
          data.prixBase,
          data.prixInitial ?? null,
          data.imageUrl,
          data.actif,
          id
        ]
      );
    } else {
      await pool.execute(
        "UPDATE services SET nom = ?, description = ?, categorie = ?, prix_base = ?, prix_initial = ?, actif = ? WHERE id = ?",
        [data.nom, data.description ?? null, data.categorie, data.prixBase, data.prixInitial ?? null, data.actif, id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur PATCH admin/products/[id]:", error);
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
    await pool.execute("DELETE FROM services WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE admin/products/[id]:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
