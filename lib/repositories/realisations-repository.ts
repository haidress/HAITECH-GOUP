import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import type { RealisationTag } from "@/lib/realisations-data";

export type RealisationProjectRecord = {
  id: number;
  slug: string;
  title: string;
  tag: RealisationTag;
  client_name: string;
  sector: string;
  context_text: string;
  challenge_text: string;
  solution_text: string;
  outcome_text: string;
  excerpt: string;
  year_label: string;
  duration_label: string;
  stack_json: string | null;
  highlights_json: string | null;
  detail_notes_json: string | null;
  links_json: string | null;
  image_url: string;
  image_fit: "cover" | "contain";
  is_published: 0 | 1;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function parseJsonArray(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => String(item)).filter(Boolean);
  } catch {
    return [];
  }
}

function parseLinks(raw: string | null): Array<{ label: string; href: string }> {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) =>
        typeof item === "object" && item
          ? { label: String((item as { label?: unknown }).label ?? ""), href: String((item as { href?: unknown }).href ?? "") }
          : null
      )
      .filter((item): item is { label: string; href: string } => Boolean(item?.label && item?.href));
  } catch {
    return [];
  }
}

export function mapProjectRowToPublicCase(row: RealisationProjectRecord) {
  return {
    id: row.slug,
    title: row.title,
    tag: row.tag,
    clientName: row.client_name,
    sector: row.sector,
    context: row.context_text,
    challenge: row.challenge_text,
    solution: row.solution_text,
    outcome: row.outcome_text,
    excerpt: row.excerpt,
    year: row.year_label,
    duration: row.duration_label,
    stack: parseJsonArray(row.stack_json),
    highlights: parseJsonArray(row.highlights_json),
    detailNotes: parseJsonArray(row.detail_notes_json),
    image: row.image_url,
    imageFit: row.image_fit,
    links: parseLinks(row.links_json)
  };
}

export async function listAdminRealisationProjects(): Promise<RealisationProjectRecord[]> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT *
    FROM realisation_projects
    ORDER BY sort_order ASC, updated_at DESC, id DESC
    `
  );
  return rows as unknown as RealisationProjectRecord[];
}

export async function listPublishedRealisationProjects(): Promise<RealisationProjectRecord[]> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT *
    FROM realisation_projects
    WHERE is_published = 1
    ORDER BY sort_order ASC, updated_at DESC, id DESC
    `
  );
  return rows as unknown as RealisationProjectRecord[];
}

export async function getPublishedRealisationProjectBySlug(slug: string): Promise<RealisationProjectRecord | null> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT *
    FROM realisation_projects
    WHERE slug = ? AND is_published = 1
    LIMIT 1
    `,
    [slug]
  );
  if (!rows.length) return null;
  return rows[0] as unknown as RealisationProjectRecord;
}

export async function createRealisationProject(input: Omit<RealisationProjectRecord, "id" | "created_at" | "updated_at">) {
  const pool = getDbPool();
  await pool.execute(
    `
    INSERT INTO realisation_projects (
      slug, title, tag, client_name, sector, context_text, challenge_text, solution_text, outcome_text, excerpt,
      year_label, duration_label, stack_json, highlights_json, detail_notes_json, links_json,
      image_url, image_fit, is_published, sort_order
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      input.slug,
      input.title,
      input.tag,
      input.client_name,
      input.sector,
      input.context_text,
      input.challenge_text,
      input.solution_text,
      input.outcome_text,
      input.excerpt,
      input.year_label,
      input.duration_label,
      input.stack_json,
      input.highlights_json,
      input.detail_notes_json,
      input.links_json,
      input.image_url,
      input.image_fit,
      input.is_published,
      input.sort_order
    ]
  );
}

export async function updateRealisationProject(id: number, input: Omit<RealisationProjectRecord, "id" | "created_at" | "updated_at">) {
  const pool = getDbPool();
  await pool.execute(
    `
    UPDATE realisation_projects
    SET
      slug = ?,
      title = ?,
      tag = ?,
      client_name = ?,
      sector = ?,
      context_text = ?,
      challenge_text = ?,
      solution_text = ?,
      outcome_text = ?,
      excerpt = ?,
      year_label = ?,
      duration_label = ?,
      stack_json = ?,
      highlights_json = ?,
      detail_notes_json = ?,
      links_json = ?,
      image_url = ?,
      image_fit = ?,
      is_published = ?,
      sort_order = ?
    WHERE id = ?
    `,
    [
      input.slug,
      input.title,
      input.tag,
      input.client_name,
      input.sector,
      input.context_text,
      input.challenge_text,
      input.solution_text,
      input.outcome_text,
      input.excerpt,
      input.year_label,
      input.duration_label,
      input.stack_json,
      input.highlights_json,
      input.detail_notes_json,
      input.links_json,
      input.image_url,
      input.image_fit,
      input.is_published,
      input.sort_order,
      id
    ]
  );
}

export async function deleteRealisationProject(id: number) {
  const pool = getDbPool();
  await pool.execute("DELETE FROM realisation_projects WHERE id = ?", [id]);
}
