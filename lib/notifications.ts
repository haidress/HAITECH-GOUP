import { getDbPool } from "@/lib/db";
import { sendOrderStatusEmails } from "@/lib/email";

function normalizePhoneForWa(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export function buildWhatsAppRedirectUrl(to: string, message: string) {
  const phone = normalizePhoneForWa(to);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoUrl(to: string, subject: string, body: string) {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function queueInAppNotification(userId: number, message: string, eventType: string, payload?: unknown) {
  const pool = getDbPool();
  await pool.execute(
    `
    INSERT INTO notification_events (user_id, channel, event_type, payload_json, status)
    VALUES (?, 'in_app', ?, ?, 'queued')
    `,
    [userId, eventType, payload === undefined ? JSON.stringify({ message }) : JSON.stringify(payload)]
  );
}

export async function sendWhatsAppNotification({
  to,
  message,
  eventType
}: {
  to: string;
  message: string;
  eventType: string;
}) {
  const provider = (process.env.WHATSAPP_PROVIDER ?? "").toLowerCase();
  const whatsappUrl = buildWhatsAppRedirectUrl(to, message);
  if (!provider) {
    console.log(`WhatsApp fallback (${eventType}) -> ${to}: ${message}`);
    return { sent: false, fallback: true, provider: "none" as const, redirect: { whatsappUrl } };
  }

  try {
    if (provider === "meta") {
      const token = process.env.WHATSAPP_META_TOKEN;
      const phoneNumberId = process.env.WHATSAPP_META_PHONE_NUMBER_ID;
      if (!token || !phoneNumberId) {
        console.log("WhatsApp Meta non configuré (WHATSAPP_META_TOKEN / WHATSAPP_META_PHONE_NUMBER_ID).");
        return { sent: false, fallback: true, provider: "meta" as const, redirect: { whatsappUrl } };
      }

      const endpoint = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
      const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: {
          preview_url: false,
          body: message
        }
      };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      return {
        sent: response.ok,
        fallback: !response.ok,
        provider: "meta" as const,
        status: response.status,
        redirect: response.ok ? undefined : { whatsappUrl }
      };
    }

    if (provider === "twilio") {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_WHATSAPP_FROM;
      if (!accountSid || !authToken || !from) {
        console.log("Twilio WhatsApp non configuré (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_WHATSAPP_FROM).");
        return { sent: false, fallback: true, provider: "twilio" as const, redirect: { whatsappUrl } };
      }

      const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const form = new URLSearchParams();
      form.set("To", to.startsWith("whatsapp:") ? to : `whatsapp:${to}`);
      form.set("From", from.startsWith("whatsapp:") ? from : `whatsapp:${from}`);
      form.set("Body", message);

      const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: form.toString()
      });
      return {
        sent: response.ok,
        fallback: !response.ok,
        provider: "twilio" as const,
        status: response.status,
        redirect: response.ok ? undefined : { whatsappUrl }
      };
    }

    console.log(`Provider WhatsApp inconnu: ${provider}`);
    return { sent: false, fallback: true, provider: "unknown" as const, redirect: { whatsappUrl } };
  } catch (error) {
    console.error("sendWhatsAppNotification error:", error);
    return { sent: false, fallback: true, provider: "error" as const, redirect: { whatsappUrl } };
  }
}

export async function notifyOrderCriticalUpdate({
  clientEmail,
  clientContact,
  referenceCode,
  productName,
  nextStatus,
  adminEmails,
  clientUserId
}: {
  clientEmail: string;
  clientContact: string;
  referenceCode: string;
  productName: string;
  nextStatus: string;
  adminEmails: string[];
  clientUserId?: number | null;
}) {
  await sendOrderStatusEmails({
    clientEmail,
    referenceCode,
    productName,
    nextStatus,
    adminEmails
  });

  const waResult = await sendWhatsAppNotification({
    to: clientContact,
    message: `HAITECH: votre commande ${referenceCode} est maintenant au statut "${nextStatus}".`,
    eventType: "order_status_changed"
  });

  if (clientUserId) {
    const mailtoUrl = buildMailtoUrl(
      clientEmail,
      `Mise à jour commande ${referenceCode}`,
      `Bonjour,\nLe statut de votre commande ${referenceCode} est maintenant: ${nextStatus}.\nProduit: ${productName}.`
    );
    await queueInAppNotification(clientUserId, `Commande ${referenceCode}: ${nextStatus}`, "order_status_changed", {
      referenceCode,
      nextStatus,
      whatsappUrl: waResult.redirect?.whatsappUrl,
      mailtoUrl
    });
  }
}
