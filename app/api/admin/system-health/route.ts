import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { checkDatabaseHealth, checkRedisHealth, getSmtpConfigSummary, listRecentMigrations } from "@/lib/system-health";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  const [db, migrations, redis, smtp] = await Promise.all([
    checkDatabaseHealth(),
    listRecentMigrations(15),
    checkRedisHealth(),
    Promise.resolve(getSmtpConfigSummary())
  ]);

  return NextResponse.json({
    success: true,
    data: {
      database: db,
      migrations,
      redis,
      smtp,
      cron: {
        secretConfigured: Boolean(process.env.CRON_SECRET?.trim()),
        maintenanceMode: process.env.MAINTENANCE_MODE === "true"
      }
    }
  });
}
