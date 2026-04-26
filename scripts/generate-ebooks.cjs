const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const targetDirectory = path.join(process.cwd(), "public", "ebooks");
fs.mkdirSync(targetDirectory, { recursive: true });
const logoPath = path.join(process.cwd(), "public", "logo-haitech.jpg");

const ebooks = [
  ["guide-excel-complet.pdf", "Guide Excel complet", 10000, "Formules, TCD et automatisation Excel."],
  ["prompting-ia-pratique.pdf", "Prompting IA pratique", 6000, "Utiliser l'IA pour travailler plus vite."],
  ["guide-prospection-whatsapp.pdf", "Guide prospection WhatsApp", 3000, "Trouver des clients avec WhatsApp."],
  ["canva-express.pdf", "Canva Express", 4000, "Creer des visuels professionnels rapidement."],
  ["lancer-son-activite.pdf", "Lancer son activite (0 -> 1)", 8000, "Passer de l'idee aux premiers revenus."],
  ["tableaux-bord-excel-pme.pdf", "Tableaux de bord Excel PME", 10000, "Suivi des performances et KPI."],
  ["cybersecurite-tpe.pdf", "Cybersecurite TPE", 9000, "Protection concrete pour petites structures."],
  ["pack-cv-entretien.pdf", "Pack CV & entretien", 7000, "CV efficace et methode d'entretien."],
  ["guide-branding-personnel.pdf", "Branding personnel", 7500, "Construire une image professionnelle forte."],
  ["mini-manuel-seo-local.pdf", "SEO local", 6500, "Gagner en visibilite locale."],
  ["gestion-financiere-simple.pdf", "Gestion financiere", 8500, "Marge, tresorerie et pilotage simple."]
];

for (const [fileName, title, price, subtitle] of ebooks) {
  const filePath = path.join(targetDirectory, fileName);
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 60, bottom: 60, left: 60, right: 60 }
  });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 60, 50, { width: 56, height: 56 });
  }

  doc.fontSize(10).fillColor("#6B7280").text("HAITECH GROUP | Academy", 130, 58);
  doc.fontSize(21).fillColor("#0A2A5E").text("Fiche e-book", 130, 74);
  doc.fontSize(16).fillColor("#111827").text(title, 60, 130, { width: 470 });
  doc.fontSize(13).fillColor("#0A2A5E").text(`Prix public: ${price.toLocaleString("fr-FR")} FCFA`, 60, 170);

  doc.roundedRect(60, 205, 470, 66, 10).fillAndStroke("#EEF5FF", "#D4E3FF");
  doc
    .fillColor("#1F2937")
    .fontSize(11)
    .text(
      `${subtitle} Ce support pratique vous aide a progresser rapidement avec des methodes claires et des modeles exploitables.`,
      76,
      224,
      { width: 438 }
    );

  doc.moveTo(60, 295).lineTo(530, 295).strokeColor("#E5E7EB").stroke();
  doc.fontSize(12).fillColor("#0A2A5E").text("Ce que vous obtenez", 60, 312);

  const benefits = [
    "Contenu structure, accessible et concret",
    "Actions rapides a mettre en oeuvre des aujourd'hui",
    "Approche orientee resultats pour etudiants et professionnels",
    "Accompagnement possible via HAITECH Academy"
  ];
  let y = 336;
  for (const item of benefits) {
    doc.fontSize(11).fillColor("#374151").text(`- ${item}`, 70, y, { width: 440 });
    y += 24;
  }

  doc.moveTo(60, y + 6).lineTo(530, y + 6).strokeColor("#E5E7EB").stroke();
  doc.fontSize(11).fillColor("#111827").text("Besoin d'accompagnement ?", 60, y + 22);
  doc
    .fontSize(10)
    .fillColor("#4B5563")
    .text("WhatsApp: +225 07 89 17 46 19 | Email: haitechgroupe@gmail.com", 60, y + 42, { width: 470 });
  doc.fontSize(10).text("Site: https://haitech-group.ci", 60, y + 58);

  doc.fontSize(9).fillColor("#6B7280").text("Document promotionnel - HAITECH GROUP", 60, 780);

  doc.end();
}

console.log(`Generated ${ebooks.length} ebook files in ${targetDirectory}`);
