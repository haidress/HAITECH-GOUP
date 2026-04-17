import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import {
  itAddOns as defaultAddons,
  itManagedTiers as defaultManagedTiers,
  itServiceLines as defaultServiceLines,
  itServicePacks as defaultPacks,
  type ItManagedTier,
  type ItServiceLine,
  type ItServicePack
} from "@/lib/offers-catalog";

export type PublicItCatalog = {
  serviceLines: ItServiceLine[];
  managedTiers: ItManagedTier[];
  packs: ItServicePack[];
  addons: string[];
};

function parseJsonStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v));
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return parsed.map((v) => String(v));
    } catch {
      return [];
    }
  }
  return [];
}

function defaults(): PublicItCatalog {
  return {
    serviceLines: defaultServiceLines,
    managedTiers: defaultManagedTiers,
    packs: defaultPacks,
    addons: defaultAddons
  };
}

export async function fetchPublicItCatalog(): Promise<PublicItCatalog> {
  const pool = getDbPool();
  try {
    const [lineRows] = await pool.query<RowDataPacket[]>(
      `SELECT icon, title, description AS desc, cta FROM it_service_lines WHERE is_active = 1 ORDER BY sort_order ASC, id ASC`
    );
    const [tierRows] = await pool.query<RowDataPacket[]>(
      `SELECT name, audience, from_price_fcfa AS fromPricePerPosteFcfa, highlights, sla FROM it_managed_tiers WHERE is_active = 1 ORDER BY sort_order ASC, id ASC`
    );
    const [packRows] = await pool.query<RowDataPacket[]>(
      `SELECT title, badge, subtitle, audience, items, from_price_fcfa AS fromPriceFcfa FROM it_service_packs WHERE is_active = 1 ORDER BY sort_order ASC, id ASC`
    );
    const [addonRows] = await pool.query<RowDataPacket[]>(
      `SELECT label FROM it_service_addons WHERE is_active = 1 ORDER BY sort_order ASC, id ASC`
    );

    if (!lineRows.length && !tierRows.length && !packRows.length && !addonRows.length) {
      return defaults();
    }

    const serviceLines: ItServiceLine[] = lineRows.length
      ? lineRows.map((r) => ({
          icon: String(r.icon ?? ""),
          title: String(r.title ?? ""),
          desc: String(r.desc ?? ""),
          cta: String(r.cta ?? "")
        }))
      : defaults().serviceLines;

    const managedTiers: ItManagedTier[] = tierRows.length
      ? tierRows.map((r) => ({
          name: String(r.name ?? ""),
          audience: String(r.audience ?? ""),
          fromPricePerPosteFcfa: Number(r.fromPricePerPosteFcfa ?? 0),
          highlights: parseJsonStringArray(r.highlights),
          sla: String(r.sla ?? "")
        }))
      : defaults().managedTiers;

    const packs: ItServicePack[] = packRows.length
      ? packRows.map((r) => ({
          title: String(r.title ?? ""),
          badge: String(r.badge ?? ""),
          subtitle: String(r.subtitle ?? ""),
          audience: String(r.audience ?? ""),
          items: parseJsonStringArray(r.items),
          fromPriceFcfa: r.fromPriceFcfa == null ? undefined : Number(r.fromPriceFcfa)
        }))
      : defaults().packs;

    const addons = addonRows.length ? addonRows.map((r) => String(r.label ?? "")) : defaults().addons;

    return { serviceLines, managedTiers, packs, addons };
  } catch {
    return defaults();
  }
}

export type ItCatalogPayload = PublicItCatalog;

export async function saveItCatalog(payload: ItCatalogPayload): Promise<void> {
  const pool = getDbPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute("DELETE FROM it_service_addons");
    await conn.execute("DELETE FROM it_service_packs");
    await conn.execute("DELETE FROM it_managed_tiers");
    await conn.execute("DELETE FROM it_service_lines");

    let sort = 0;
    for (const line of payload.serviceLines) {
      await conn.execute(
        `INSERT INTO it_service_lines (sort_order, icon, title, description, cta, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
        [sort++, line.icon, line.title, line.desc, line.cta]
      );
    }
    sort = 0;
    for (const tier of payload.managedTiers) {
      await conn.execute(
        `INSERT INTO it_managed_tiers (sort_order, name, audience, from_price_fcfa, highlights, sla, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)`,
        [sort++, tier.name, tier.audience, tier.fromPricePerPosteFcfa, JSON.stringify(tier.highlights), tier.sla]
      );
    }
    sort = 0;
    for (const pack of payload.packs) {
      await conn.execute(
        `INSERT INTO it_service_packs (sort_order, title, badge, subtitle, audience, items, from_price_fcfa, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          sort++,
          pack.title,
          pack.badge ?? "",
          pack.subtitle,
          pack.audience,
          JSON.stringify(pack.items),
          pack.fromPriceFcfa ?? null
        ]
      );
    }
    sort = 0;
    for (const label of payload.addons) {
      const trimmed = label.trim();
      if (!trimmed) continue;
      await conn.execute(`INSERT INTO it_service_addons (sort_order, label, is_active) VALUES (?, ?, 1)`, [sort++, trimmed]);
    }

    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}
