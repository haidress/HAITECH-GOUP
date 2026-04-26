import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const pool = getDbPool();

    if (category) {
      if (category === "Boutique IT") {
        const [rows] = await pool.query<RowDataPacket[]>(
          "SELECT id, nom, description, categorie, prix_base, prix_initial, image_url, actif FROM services WHERE actif = 1 AND (categorie = 'Boutique IT' OR categorie = 'Technology') ORDER BY id DESC"
        );
        return NextResponse.json({ success: true, data: rows });
      }
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT id, nom, description, categorie, prix_base, prix_initial, image_url, actif FROM services WHERE actif = 1 AND categorie = ? ORDER BY id DESC",
        [category]
      );
      return NextResponse.json({ success: true, data: rows });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, nom, description, categorie, prix_base, prix_initial, image_url, actif FROM services WHERE actif = 1 ORDER BY id DESC"
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Erreur GET catalog/products:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
