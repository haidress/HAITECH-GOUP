import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getDevisDetails } from "@/lib/devis";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import fs from "fs";
import path from "path";

export async function GET(
  _request: Request,
  context: {
    params: { id: string };
  }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  const devisId = Number(context.params.id);
  if (!Number.isFinite(devisId) || devisId <= 0) {
    return NextResponse.json({ success: false, message: "Identifiant invalide." }, { status: 400 });
  }

  const details = await getDevisDetails(devisId);
  if (!details) {
    return NextResponse.json({ success: false, message: "Devis introuvable." }, { status: 404 });
  }

  const doc = new PDFDocument({ margin: 40 });
  const chunks: Buffer[] = [];

  return new Promise<Response>((resolve) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(
        new NextResponse(pdfBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename=\"devis-${devisId}.pdf\"`
          }
        })
      );
    });

    const logoPath = path.join(process.cwd(), "public", "logo-haitech.jpg");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 30, { fit: [60, 60] });
    }
    doc.fontSize(18).text("HAITECH GROUP - Devis", 120, 40, { underline: true });
    doc.fontSize(10).text("Abidjan, Côte d'Ivoire | +225 07 89 17 46 19 | haitechgroupe@gmail.com", 120, 62);
    doc.moveDown();
    doc.fontSize(12).text(`Devis #${details.devis.id}`);
    doc.text(`Date: ${new Date(details.devis.created_at).toLocaleDateString("fr-FR")}`);
    doc.text(`Statut: ${details.devis.statut}`);
    if (details.devis.lead_nom) {
      doc.text(`Client/Lead: ${details.devis.lead_nom}`);
    }
    doc.moveDown();
    doc.text("Lignes du devis:");
    doc.moveDown(0.5);

    details.items.forEach((item) => {
      const total = Number(item.quantite) * Number(item.prix_unitaire);
      doc.text(
        `- ${item.service_nom} | Qté: ${item.quantite} | PU: ${item.prix_unitaire} | Total: ${total.toFixed(2)}`
      );
    });

    doc.moveDown();
    doc.fontSize(12).text(`Montant HT: ${Number(details.devis.montant_ht).toFixed(2)} FCFA`);
    doc.text(`Remise: ${Number(details.devis.remise_percent).toFixed(2)}%`);
    doc.text(`TVA: ${Number(details.devis.tva_percent).toFixed(2)}%`);
    doc.fontSize(14).text(`Montant TTC: ${Number(details.devis.montant_total).toFixed(2)} FCFA`);
    doc.moveDown();
    doc.fontSize(9).fillColor("gray").text("HAITECH GROUP - Un seul groupe, mille solutions.", { align: "center" });
    doc.end();
  });
}
