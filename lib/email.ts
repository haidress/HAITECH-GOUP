import nodemailer from "nodemailer";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? "no-reply@haitech-group.ci";
  return { host, port, user, pass, from };
}

export async function sendOtpEmail(to: string, otpCode: string) {
  const { host, port, user, pass, from } = getSmtpConfig();

  if (!host || !user || !pass) {
    console.log(`OTP email fallback for ${to}: ${otpCode}`);
    return { delivered: false, fallback: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  await transporter.sendMail({
    from,
    to,
    subject: "Code de vérification HAITECH GROUP",
    html: `<p>Votre code OTP est : <strong>${otpCode}</strong></p><p>Ce code expire dans 10 minutes.</p>`
  });

  return { delivered: true, fallback: false };
}

export async function sendOrderStatusEmails({
  clientEmail,
  referenceCode,
  productName,
  nextStatus,
  adminEmails
}: {
  clientEmail: string;
  referenceCode: string;
  productName: string;
  nextStatus: string;
  adminEmails: string[];
}) {
  const { host, port, user, pass, from } = getSmtpConfig();
  if (!host || !user || !pass) {
    console.log(
      `Order status email fallback: ${referenceCode} -> ${nextStatus} (client: ${clientEmail}, admins: ${adminEmails.join(",")})`
    );
    return { delivered: false, fallback: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  await transporter.sendMail({
    from,
    to: clientEmail,
    subject: `Mise à jour de votre commande ${referenceCode}`,
    html: `
      <p>Bonjour,</p>
      <p>Le statut de votre commande <strong>${referenceCode}</strong> a été mis à jour.</p>
      <p>Produit: <strong>${productName}</strong></p>
      <p>Nouveau statut: <strong>${nextStatus}</strong></p>
      <p>Vous pouvez suivre votre commande depuis l'espace suivi HAITECH GROUP.</p>
    `
  });

  if (adminEmails.length > 0) {
    await transporter.sendMail({
      from,
      to: adminEmails,
      subject: `Admin - statut commande ${referenceCode} modifié`,
      html: `
        <p>Commande: <strong>${referenceCode}</strong></p>
        <p>Produit: <strong>${productName}</strong></p>
        <p>Nouveau statut: <strong>${nextStatus}</strong></p>
        <p>Notification automatique pour suivi commercial.</p>
      `
    });
  }

  return { delivered: true, fallback: false };
}
