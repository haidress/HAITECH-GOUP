import { NextResponse } from "next/server";
import { listActiveServices } from "@/lib/devis";
import { isAdminAuthenticated } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  try {
    const services = await listActiveServices();
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error("Erreur services:", error);
    return NextResponse.json({ success: false, message: "Impossible de charger les services." }, { status: 500 });
  }
}
