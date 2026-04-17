import { NextResponse } from "next/server";
import { fetchPublicHomeContent } from "@/lib/repositories/home-content-repository";

export async function GET() {
  try {
    const data = await fetchPublicHomeContent();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/public/home:", error);
    return NextResponse.json({ success: false, message: "Contenu indisponible." }, { status: 500 });
  }
}
