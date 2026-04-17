import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";

export type ServiceRecord = {
  id: number;
  nom: string;
  categorie: string;
  prix_base: number;
};

export async function listActiveServices() {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, nom, categorie, prix_base FROM services WHERE actif = 1 ORDER BY nom ASC"
  );
  return rows as unknown as ServiceRecord[];
}

export type CreateDevisInput = {
  leadId?: number;
  clientId?: number;
  remisePercent?: number;
  tvaPercent?: number;
  items: Array<{
    serviceId: number;
    quantite: number;
    prixUnitaire: number;
  }>;
};

export async function createDevis(input: CreateDevisInput) {
  const pool = getDbPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const montantHt = input.items.reduce((sum, item) => sum + item.quantite * item.prixUnitaire, 0);
    const remisePercent = input.remisePercent ?? 0;
    const tvaPercent = input.tvaPercent ?? 18;
    const montantRemise = montantHt * (remisePercent / 100);
    const baseTaxable = montantHt - montantRemise;
    const montantTva = baseTaxable * (tvaPercent / 100);
    const total = baseTaxable + montantTva;

    const [devisRes] = await conn.execute(
      `
      INSERT INTO devis (client_id, lead_id, montant_ht, remise_percent, tva_percent, montant_total, statut)
      VALUES (?, ?, ?, ?, ?, ?, 'envoye')
      `,
      [input.clientId ?? null, input.leadId ?? null, montantHt, remisePercent, tvaPercent, total]
    );
    const devisId = (devisRes as { insertId: number }).insertId;

    for (const item of input.items) {
      await conn.execute(
        `
        INSERT INTO devis_items (devis_id, service_id, quantite, prix_unitaire)
        VALUES (?, ?, ?, ?)
        `,
        [devisId, item.serviceId, item.quantite, item.prixUnitaire]
      );
    }

    await conn.commit();
    return devisId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export async function listDevis() {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT d.id, d.client_id, d.lead_id, d.montant_ht, d.remise_percent, d.tva_percent, d.montant_total, d.statut, d.created_at,
           l.nom AS lead_nom, c.entreprise AS client_entreprise
    FROM devis d
    LEFT JOIN leads l ON l.id = d.lead_id
    LEFT JOIN clients c ON c.id = d.client_id
    ORDER BY d.created_at DESC
    LIMIT 100
    `
  );
  return rows;
}

export async function getDevisDetails(devisId: number) {
  const pool = getDbPool();
  const [devisRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT d.id, d.montant_ht, d.remise_percent, d.tva_percent, d.montant_total, d.statut, d.created_at,
           l.nom AS lead_nom, l.email AS lead_email, l.telephone AS lead_telephone
    FROM devis d
    LEFT JOIN leads l ON l.id = d.lead_id
    WHERE d.id = ?
    LIMIT 1
    `,
    [devisId]
  );
  if (!devisRows.length) return null;

  const [itemRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT di.quantite, di.prix_unitaire, s.nom AS service_nom
    FROM devis_items di
    INNER JOIN services s ON s.id = di.service_id
    WHERE di.devis_id = ?
    `,
    [devisId]
  );

  return {
    devis: devisRows[0],
    items: itemRows
  };
}
