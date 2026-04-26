import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { getMetricsSnapshot } from "@/lib/observability";

export async function GET() {
  try {
    const pool = getDbPool();
    await pool.query("SELECT 1");
    return NextResponse.json({
      ok: true,
      service: "haitech-group-officiel",
      db: "ok",
      metrics: getMetricsSnapshot()
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "haitech-group-officiel",
        db: "error",
        message: error instanceof Error ? error.message : "health check failed",
        metrics: getMetricsSnapshot()
      },
      { status: 503 }
    );
  }
}
