import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { itServicePacks } from "@/lib/offers-catalog";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

function slugifyPackTitle(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function wrapText(text: string, maxWidth: number, measure: (value: string) => number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (measure(candidate) <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function sanitizePdfText(value: string) {
  return value
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[^\x09\x0A\x0D\x20-\xFF]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function GET(_request: Request, context: { params: { slug: string } }) {
  const pack = itServicePacks.find((item) => slugifyPackTitle(item.title) === context.params.slug);
  if (!pack) {
    return NextResponse.json({ success: false, message: "Pack introuvable." }, { status: 404 });
  }

  const pdf = await PDFDocument.create();
  let page = pdf.addPage([595.28, 841.89]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const marginX = 50;
  const contentWidth = page.getWidth() - marginX * 2;
  let y = page.getHeight() - 55;

  const ensureSpace = (requiredHeight: number) => {
    if (y - requiredHeight > 50) return;
    page = pdf.addPage([595.28, 841.89]);
    y = page.getHeight() - 55;
  };

  const drawLine = (text: string, size = 11, isBold = false, color = rgb(0.22, 0.25, 0.31), indent = 0) => {
    const cleanText = sanitizePdfText(text);
    if (!cleanText) return;
    const font = isBold ? bold : regular;
    const widthLimit = contentWidth - indent;
    const lines = wrapText(cleanText, widthLimit, (value) => font.widthOfTextAtSize(value, size));
    for (const line of lines) {
      ensureSpace(size + 8);
      page.drawText(line, { x: marginX + indent, y, size, font, color });
      y -= size + 4;
    }
    y -= 2;
  };

  const logoPath = path.join(process.cwd(), "public", "logo-haitech.jpg");
  if (fs.existsSync(logoPath)) {
    const logoBytes = fs.readFileSync(logoPath);
    const logo = await pdf.embedJpg(logoBytes);
    page.drawImage(logo, { x: marginX, y: y - 24, width: 44, height: 44 });
  }

  page.drawText("HAITECH GROUP", {
    x: 104,
    y: y + 8,
    size: 10,
    font: regular,
    color: rgb(0.42, 0.46, 0.52)
  });
  page.drawText("Fiche offre services IT", {
    x: 104,
    y: y - 8,
    size: 18,
    font: bold,
    color: rgb(0.04, 0.16, 0.37)
  });
  page.drawText(`Date d'edition: ${new Date().toLocaleDateString("fr-FR")}`, {
    x: 104,
    y: y - 24,
    size: 10,
    font: regular,
    color: rgb(0.42, 0.46, 0.52)
  });
  y -= 70;

  drawLine(pack.title, 16, true, rgb(0.07, 0.09, 0.11));
  drawLine(pack.subtitle || "Offre HAITECH Services IT", 11, false);
  if (pack.badge) drawLine(`Badge: ${pack.badge}`, 10, true, rgb(0.04, 0.16, 0.37));
  drawLine(`Pour qui: ${pack.audience}`, 10.5);

  const base = pack.fromPriceFcfa ?? 0;
  if (base > 0) {
    const high = Math.round(base * 1.3);
    drawLine(`Prix a partir de: ${base.toLocaleString("fr-FR")} FCFA`, 11, true, rgb(0.04, 0.16, 0.37));
    drawLine(`Fourchette indicative: ${base.toLocaleString("fr-FR")} - ${high.toLocaleString("fr-FR")} FCFA`, 10.5);
  }

  y -= 4;
  drawLine("Ce que contient cette offre", 13, true, rgb(0.04, 0.16, 0.37));
  for (const item of pack.items) {
    drawLine(`- ${item}`, 10.5, false, rgb(0.22, 0.25, 0.31), 6);
  }

  y -= 4;
  drawLine("Non inclus (standard)", 13, true, rgb(0.04, 0.16, 0.37));
  for (const excluded of ["Hors materiel", "Hors interventions exceptionnelles", "Hors developpements specifiques"]) {
    drawLine(`- ${excluded}`, 10.5, false, rgb(0.22, 0.25, 0.31), 6);
  }

  y -= 4;
  drawLine("Utilisation en reunion", 13, true, rgb(0.04, 0.16, 0.37));
  drawLine("Cette fiche sert a cadrer le perimetre, comparer les options et valider le budget.");
  drawLine("Questions a valider:", 10.5, true);
  for (const question of [
    "Volume de postes et utilisateurs",
    "Niveau d'urgence et SLA attendu",
    "Perimetre exact des interventions",
    "Planning de demarrage"
  ]) {
    drawLine(`- ${question}`, 10.5, false, rgb(0.22, 0.25, 0.31), 6);
  }

  y -= 4;
  drawLine("Prochaine etape recommandee", 13, true, rgb(0.04, 0.16, 0.37));
  drawLine("Diagnostic gratuit 15 min, puis proposition adaptee sous 24h.");
  drawLine("WhatsApp: +225 07 89 17 46 19", 10.5, false);
  drawLine("Email: haitechgroupe@gmail.com", 10.5, false);
  drawLine("Site: https://haitech-group.ci", 10.5, false);

  y -= 6;
  drawLine("Document commercial HAITECH GROUP - diffusion interne/client autorisee", 9, false, rgb(0.42, 0.46, 0.52));

  const bytes = await pdf.save();
  const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const pdfBlob = new Blob([arrayBuffer], { type: "application/pdf" });
  return new NextResponse(pdfBlob, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=\"fiche-${context.params.slug}.pdf\"`,
      "Cache-Control": "no-store"
    }
  });
}
