import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { mkdir, writeFile } from "fs/promises";
import { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-guard";

export async function POST(
  _request: Request,
  context: {
    params: { id: string };
  }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }
  const id = Number(context.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ success: false, message: "Identifiant invalide." }, { status: 400 });
  }

  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT m.id, m.titre, m.details, m.statut, m.scheduled_at, m.checkin_at, m.checkout_at, m.labor_minutes, m.labor_cost, m.intervention_summary,
           c.id AS client_id, c.entreprise, u.email, u.nom, u.prenom
    FROM maintenance_interventions m
    INNER JOIN clients c ON c.id = m.client_id
    INNER JOIN users u ON u.id = c.user_id
    WHERE m.id = ?
    LIMIT 1
    `,
    [id]
  );
  const item = rows[0];
  if (!item) {
    return NextResponse.json({ success: false, message: "Intervention introuvable." }, { status: 404 });
  }
  const [partsRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT part_name, quantity, unit_cost
    FROM intervention_parts
    WHERE intervention_id = ?
    `,
    [id]
  );

  const doc = new PDFDocument({ margin: 40 });
  const chunks: Buffer[] = [];
  const reportName = `intervention-${id}-${Date.now()}.pdf`;

  return new Promise<Response>((resolve) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", async () => {
      const buffer = Buffer.concat(chunks);
      const dir = path.join(process.cwd(), "public", "generated");
      await mkdir(dir, { recursive: true });
      const filePath = path.join(dir, reportName);
      await writeFile(filePath, buffer);
      const fileUrl = `/generated/${reportName}`;
      await pool.execute(
        `
        INSERT INTO client_documents (client_id, title, doc_type, file_url, visible_to_client, created_by_user_id)
        VALUES (?, ?, 'rapport_pdf', ?, 1, NULL)
        `,
        [Number(item.client_id), `Rapport intervention #${id}`, fileUrl]
      );
      resolve(
        NextResponse.json({
          success: true,
          data: { fileUrl }
        })
      );
    });

    const logoPath = path.join(process.cwd(), "public", "logo-haitech.jpg");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 30, { fit: [60, 60] });
    }
    doc.fontSize(18).text("HAITECH GROUP - Rapport d'intervention", 120, 40);
    doc.fontSize(11).text(`Intervention #${id}`);
    doc.text(`Client: ${item.entreprise || `${item.nom} ${item.prenom ?? ""}`.trim()}`);
    doc.text(`Email: ${item.email}`);
    doc.text(`Sujet: ${item.titre}`);
    doc.text(`Statut: ${item.statut}`);
    doc.text(`Prévu: ${new Date(item.scheduled_at).toLocaleString("fr-FR")}`);
    if (item.checkin_at) doc.text(`Check-in: ${new Date(item.checkin_at).toLocaleString("fr-FR")}`);
    if (item.checkout_at) doc.text(`Check-out: ${new Date(item.checkout_at).toLocaleString("fr-FR")}`);
    doc.text(`Temps passé: ${Number(item.labor_minutes ?? 0)} min`);
    doc.text(`Coût main d'oeuvre: ${Number(item.labor_cost ?? 0).toLocaleString("fr-FR")} FCFA`);
    doc.moveDown();
    doc.text(`Détails: ${item.details ?? "-"}`);
    doc.text(`Résumé: ${item.intervention_summary ?? "-"}`);
    doc.moveDown();
    doc.text("Pièces utilisées:");
    if (!partsRows.length) {
      doc.text("- Aucune");
    } else {
      partsRows.forEach((part) => {
        doc.text(`- ${part.part_name} | Qté ${part.quantity} | PU ${Number(part.unit_cost).toLocaleString("fr-FR")} FCFA`);
      });
    }
    doc.end();
  });
}
