import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { ensureSameOrigin } from "@/lib/request-security";
import { getDbPool } from "@/lib/db";

function parseId(idRaw: string) {
  const id = Number(idRaw);
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
  if (!id) return NextResponse.json({ success: false, message: "Identifiant invalide." }, { status: 400 });
  try {
    const payload = (await request.json()) as { is_approved?: boolean };
    const approved = payload.is_approved === true ? 1 : 0;
    const pool = getDbPool();
    await pool.execute("UPDATE boutique_product_reviews SET is_approved = ? WHERE id = ?", [approved, id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur PATCH /api/admin/boutique/reviews/[id]:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
