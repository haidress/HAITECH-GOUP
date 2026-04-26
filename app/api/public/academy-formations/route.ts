import { NextResponse } from "next/server";
import { academyCatalogFormations } from "@/lib/academy-catalog";
import { listAcademyFormationsFromDb } from "@/lib/repositories/academy-repository";

export async function GET() {
  try {
    const dbFormations = await listAcademyFormationsFromDb();
    if (dbFormations.length > 0) {
      return NextResponse.json({ success: true, data: dbFormations, source: "db" });
    }
  } catch {
    // fallback statique
  }

  return NextResponse.json({ success: true, data: academyCatalogFormations, source: "static" });
}
