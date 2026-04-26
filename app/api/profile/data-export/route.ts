import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { exportUserPersonalData } from "@/lib/profile-data";
import { writeAuditLog } from "@/lib/audit-log";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  try {
    const data = await exportUserPersonalData(user.id);
    await writeAuditLog({
      actorUserId: user.id,
      action: "PROFILE_DATA_EXPORT_REQUESTED",
      resourceType: "user",
      resourceId: user.id
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("data-export:", error);
    return NextResponse.json({ success: false, message: "Export impossible." }, { status: 500 });
  }
}
