import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";

function csvEscape(value: string | number | null) {
  const text = value === null ? "" : String(value);
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT nom, email, telephone, source, besoin, budget, statut, created_at
    FROM leads
    ORDER BY created_at DESC
    `
  );

  const headers = ["nom", "email", "telephone", "source", "besoin", "budget", "statut", "created_at"];
  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((h) => csvEscape(row[h] ?? null)).join(","));
  });

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="leads-export.csv"'
    }
  });
}
