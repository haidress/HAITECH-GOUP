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
    SELECT d.id, l.nom AS lead_nom, d.montant_ht, d.remise_percent, d.tva_percent, d.montant_total, d.statut, d.created_at
    FROM devis d
    LEFT JOIN leads l ON l.id = d.lead_id
    ORDER BY d.created_at DESC
    `
  );

  const headers = ["id", "lead_nom", "montant_ht", "remise_percent", "tva_percent", "montant_total", "statut", "created_at"];
  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((h) => csvEscape(row[h] ?? null)).join(","));
  });

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="devis-export.csv"'
    }
  });
}
