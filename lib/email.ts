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

export async function sendLeadNurtureEmail(to: string, nom: string) {
  const { host, port, user, pass, from } = getSmtpConfig();
  if (!host || !user || !pass) {
    console.log(`Lead nurture email fallback for ${to} (${nom})`);
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
    subject: "HAITECH GROUP — votre demande nous tient à cœur",
    html: `
      <p>Bonjour ${nom},</p>
      <p>Nous avons bien reçu votre message sur notre site et restons à votre disposition pour échanger sur votre besoin.</p>
      <p>Répondez simplement à cet e-mail ou contactez-nous via le formulaire du site pour préciser votre contexte.</p>
      <p>Cordialement,<br/>L'équipe HAITECH GROUP</p>
    `
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

export async function sendOrderRelanceEmail({
  to,
  referenceCode,
  productName,
  dayMark
}: {
  to: string;
  referenceCode: string;
  productName: string;
  dayMark: number;
}) {
  const { host, port, user, pass, from } = getSmtpConfig();
  if (!host || !user || !pass) {
    console.log(`Order relance fallback: J+${dayMark} ${referenceCode} -> ${to}`);
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
    subject: `Relance commande ${referenceCode} (J+${dayMark})`,
    html: `
      <p>Bonjour,</p>
      <p>Nous revenons vers vous concernant votre commande <strong>${referenceCode}</strong> (${productName}).</p>
      <p>Nous restons disponibles pour finaliser rapidement votre besoin.</p>
      <p>Equipe HAITECH GROUP</p>
    `
  });

  return { delivered: true, fallback: false };
}
