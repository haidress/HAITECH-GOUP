import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { verifyCronRequest } from "@/lib/cron-auth";
import { getDbPool } from "@/lib/db";

function csvEscape(value: string | number | null) {
  const text = value === null ? "" : String(value);
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export async function GET(request: Request) {
  const denied = verifyCronRequest(request);
  if (denied) return denied;

  try {
    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT id, nom, email, telephone, source, besoin, budget, statut, assigned_user_id, created_at, updated_at
      FROM leads
      ORDER BY created_at DESC
      `
    );

    const headers = [
      "id",
      "nom",
      "email",
      "telephone",
      "source",
      "besoin",
      "budget",
      "statut",
      "assigned_user_id",
      "created_at",
      "updated_at"
    ];
    const lines = [headers.join(",")];
    (rows as RowDataPacket[]).forEach((row) => {
      lines.push(headers.map((h) => csvEscape(row[h] ?? null)).join(","));
    });

    const stamp = new Date().toISOString().slice(0, 10);
    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads-cron-${stamp}.csv"`
      }
    });
  } catch (error) {
    console.error("cron leads-export:", error);
    return NextResponse.json({ ok: false, message: "Export impossible." }, { status: 500 });
  }
}
