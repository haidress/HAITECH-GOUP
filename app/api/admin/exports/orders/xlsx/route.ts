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
    SELECT reference_code, source_type, product_name, amount, nom, contact, email, status, created_at
    FROM customer_orders
    ORDER BY created_at DESC
    `
  );

  const worksheet = XLSX.utils.json_to_sheet(rows as unknown as Record<string, unknown>[]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Commandes");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="orders-export.xlsx"'
    }
  });
}
