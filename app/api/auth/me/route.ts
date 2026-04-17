import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json(
      { success: true, user },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0"
        }
      }
    );
  } catch (error) {
    console.error("Erreur auth/me:", error);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
