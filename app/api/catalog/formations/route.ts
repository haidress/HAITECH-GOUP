import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, titre, description, prix, niveau, duree, image FROM formations ORDER BY id DESC"
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Erreur GET catalog/formations:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
