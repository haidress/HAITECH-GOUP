import { NextResponse } from "next/server";
import { listPublishedRealisationProjects, mapProjectRowToPublicCase } from "@/lib/repositories/realisations-repository";

export async function GET() {
  try {
    const data = await listPublishedRealisationProjects();
    return NextResponse.json({ success: true, data: data.map(mapProjectRowToPublicCase) });
  } catch (error) {
    console.error("GET /api/public/realisations:", error);
    return NextResponse.json({ success: false, message: "Réalisations indisponibles." }, { status: 500 });
  }
}
