import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import * as XLSX from "xlsx";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";

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

  const worksheet = XLSX.utils.json_to_sheet(rows as unknown as Record<string, unknown>[]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Devis");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="devis-export.xlsx"'
    }
  });
}
