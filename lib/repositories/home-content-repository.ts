import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";

export type HomePublicContent = {
  announcementTitle: string | null;
  announcementBody: string | null;
  announcementCtaLabel: string | null;
  announcementCtaHref: string | null;
  announcementVisible: boolean;
  heroCtaPrimaryLabel: string;
  heroCtaPrimaryLabelB: string;
  homeExperimentVariant: "A" | "B";
  lastSiteUpdateLabel: string | null;
};

const defaults: HomePublicContent = {
  announcementTitle: null,
  announcementBody: null,
  announcementCtaLabel: null,
  announcementCtaHref: null,
  announcementVisible: false,
  heroCtaPrimaryLabel: "Demander un devis",
  heroCtaPrimaryLabelB: "Obtenir une proposition",
  homeExperimentVariant: "A",
  lastSiteUpdateLabel: null
};

function mapRow(row: RowDataPacket | undefined): HomePublicContent {
  if (!row) return defaults;
  const v = String(row.home_experiment_variant ?? "A").toUpperCase() === "B" ? "B" : "A";
  return {
    announcementTitle: row.announcement_title != null ? String(row.announcement_title) : null,
    announcementBody: row.announcement_body != null ? String(row.announcement_body) : null,
    announcementCtaLabel: row.announcement_cta_label != null ? String(row.announcement_cta_label) : null,
    announcementCtaHref: row.announcement_cta_href != null ? String(row.announcement_cta_href) : null,
    announcementVisible: Boolean(row.announcement_visible),
    heroCtaPrimaryLabel: String(row.hero_cta_primary_label ?? defaults.heroCtaPrimaryLabel),
    heroCtaPrimaryLabelB: String(row.hero_cta_primary_label_b ?? defaults.heroCtaPrimaryLabelB),
    homeExperimentVariant: v,
    lastSiteUpdateLabel: row.last_site_update_label != null ? String(row.last_site_update_label) : null
  };
}

export async function fetchPublicHomeContent(): Promise<HomePublicContent> {
  try {
    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT announcement_title, announcement_body, announcement_cta_label, announcement_cta_href,
              announcement_visible, hero_cta_primary_label, hero_cta_primary_label_b, home_experiment_variant,
              last_site_update_label
       FROM home_public_content WHERE id = 1 LIMIT 1`
    );
    return mapRow(rows[0]);
  } catch {
    return defaults;
  }
}

export async function saveHomeContent(data: HomePublicContent): Promise<void> {
  const pool = getDbPool();
  await pool.execute(
    `
    INSERT INTO home_public_content (
      id, announcement_title, announcement_body, announcement_cta_label, announcement_cta_href,
      announcement_visible, hero_cta_primary_label, hero_cta_primary_label_b, home_experiment_variant,
      last_site_update_label
    ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      announcement_title = VALUES(announcement_title),
      announcement_body = VALUES(announcement_body),
      announcement_cta_label = VALUES(announcement_cta_label),
      announcement_cta_href = VALUES(announcement_cta_href),
      announcement_visible = VALUES(announcement_visible),
      hero_cta_primary_label = VALUES(hero_cta_primary_label),
      hero_cta_primary_label_b = VALUES(hero_cta_primary_label_b),
      home_experiment_variant = VALUES(home_experiment_variant),
      last_site_update_label = VALUES(last_site_update_label)
    `,
    [
      data.announcementTitle,
      data.announcementBody,
      data.announcementCtaLabel,
      data.announcementCtaHref,
      data.announcementVisible ? 1 : 0,
      data.heroCtaPrimaryLabel,
      data.heroCtaPrimaryLabelB,
      data.homeExperimentVariant,
      data.lastSiteUpdateLabel
    ]
  );
}
