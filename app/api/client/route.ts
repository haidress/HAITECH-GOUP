import { NextResponse } from "next/server";
import { hasAnyRole } from "@/lib/admin-guard";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  if (!(await hasAnyRole(["client", "admin"]))) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  const user = await getCurrentUser();
  return NextResponse.json({ success: true, user });
}
