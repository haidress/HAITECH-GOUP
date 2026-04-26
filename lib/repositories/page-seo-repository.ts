import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";

export type SitePageSeo = {
  path: string;
  meta_title: string;
  meta_description: string;
  og_title: string | null;
  og_description: string | null;
  og_image_path: string | null;
  updated_at: string;
};

export async function fetchPageSeo(path: string): Promise<SitePageSeo | null> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT path, meta_title, meta_description, og_title, og_description, og_image_path, updated_at
    FROM site_page_seo
    WHERE path = ?
    LIMIT 1
    `,
    [path]
  );
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows[0] as SitePageSeo;
}

export async function listAllPageSeo(): Promise<SitePageSeo[]> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT path, meta_title, meta_description, og_title, og_description, og_image_path, updated_at
    FROM site_page_seo
    ORDER BY path ASC
    `
  );
  return rows as SitePageSeo[];
}

export async function upsertPageSeo(row: Omit<SitePageSeo, "updated_at">) {
  const pool = getDbPool();
  await pool.execute(
    `
    INSERT INTO site_page_seo (path, meta_title, meta_description, og_title, og_description, og_image_path)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      meta_title = VALUES(meta_title),
      meta_description = VALUES(meta_description),
      og_title = VALUES(og_title),
      og_description = VALUES(og_description),
      og_image_path = VALUES(og_image_path)
    `,
    [
      row.path,
      row.meta_title,
      row.meta_description,
      row.og_title,
      row.og_description,
      row.og_image_path
    ]
  );
}
