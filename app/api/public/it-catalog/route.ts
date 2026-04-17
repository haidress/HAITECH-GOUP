import { NextResponse } from "next/server";
import { fetchPublicItCatalog } from "@/lib/repositories/it-catalog-repository";

export async function GET() {
  try {
    const data = await fetchPublicItCatalog();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/public/it-catalog:", error);
    return NextResponse.json({ success: false, message: "Catalogue indisponible." }, { status: 500 });
  }
}
