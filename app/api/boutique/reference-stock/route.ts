import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";

/** Stock des références catalogue vitrine (lecture publique, sans auth). */
export async function GET() {
  try {
    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>("SELECT product_id, quantity FROM boutique_reference_stock");
    const data: Record<string, number> = {};
    for (const r of rows as RowDataPacket[]) {
      data[String(r.product_id)] = Number(r.quantity);
    }
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: true, data: {} });
  }
}
