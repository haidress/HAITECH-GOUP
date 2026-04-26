import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import type { CatalogFormation } from "@/lib/academy-catalog";

function mapLevel(value: string | null | undefined): CatalogFormation["level"] {
  const normalized = (value ?? "").toLowerCase();
  if (normalized.includes("avanc")) return "Avancé";
  if (normalized.includes("inter")) return "Intermédiaire";
  return "Débutant";
}

export function mapDbFormationToCatalogFormation(row: {
  titre: string;
  description: string | null;
  prix: number | string | null;
  niveau: string | null;
  duree: string | null;
  image: string | null;
}): CatalogFormation {
  const title = String(row.titre);
  const lower = title.toLowerCase();
  let category: CatalogFormation["category"] = "Informatique de base";
  if (/(react|next|web|javascript|html|css)/i.test(lower)) category = "Développement web";
  else if (/(design|canva|photoshop|video|montage|community)/i.test(lower)) category = "Design & création";
  else if (/(ia|intelligence artificielle|prompt)/i.test(lower)) category = "IA & digital";
  else if (/(business|marketing|entrepren)/i.test(lower)) category = "Business & digital";
  else if (/(reseau|cyber|maintenance|depannage)/i.test(lower)) category = "Technique & maintenance";

  return {
    name: title,
    category,
    level: mapLevel(row.niveau),
    format: "Présentiel / Visio",
    duration: String(row.duree || "Flexible"),
    price: Number(row.prix || 0),
    image: row.image || "/slide-support.png",
    outcomes: row.description ? [String(row.description)] : []
  };
}

export async function listAcademyFormationsFromDb(): Promise<CatalogFormation[]> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT titre, description, prix, niveau, duree, image FROM formations ORDER BY id DESC"
  );
  return rows.map((row) =>
    mapDbFormationToCatalogFormation({
      titre: String(row.titre),
      description: (row.description as string | null) ?? null,
      prix: (row.prix as number | string | null) ?? null,
      niveau: (row.niveau as string | null) ?? null,
      duree: (row.duree as string | null) ?? null,
      image: (row.image as string | null) ?? null
    })
  );
}
