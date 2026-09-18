import nodemailer from "nodemailer";
import { env } from "../config/env.js";

/* ── Create reusable transporter ──────────────────── */
let transporter = null;

function getTransporter() {
  if (!transporter) {
    /* If email credentials are missing, return null
       and skip actual sending (log to console instead) */
    if (!env.EMAIL_HOST || !env.EMAIL_USER || !env.EMAIL_PASS) {
      console.warn(
        "⚠️  Email is not configured (EMAIL_HOST/USER/PASS missing). Emails will be logged to console."
      );
      return null;
    }

    transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: Number(env.EMAIL_PORT) || 587,
      secure: Number(env.EMAIL_PORT) === 465, // true for 465, false for others
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

/* ── Base send function ───────────────────────────── */
async function sendMail({ to, subject, html, text, replyTo }) {
  const t = getTransporter();

  if (!t) {
    console.log("\n📧 [Email skipped — no SMTP config]");
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Preview: ${text?.slice(0, 120) || "(html only)"}\n`);
    return { skipped: true };
  }

  try {
    const info = await t.sendMail({
      from: env.EMAIL_FROM || `"Burgshake" <${env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
      replyTo: replyTo || undefined,
    });
    console.log(`✅ Email sent: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("❌ Email send error:", err.message);
    return { error: err.message };
  }
}

/* ═══════════════════════════════════════════════════
   TEMPLATE — Base wrapper (reusable for all emails)
   ═══════════════════════════════════════════════════ */
function emailWrapper({ title, preheader = "", bodyHtml }) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0; padding:0; background:#FFF6EC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#171717;">
    <span style="display:none !important; visibility:hidden; opacity:0; height:0; width:0; font-size:1px; line-height:1px;">${preheader}</span>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FFF6EC; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 20px 50px -20px rgba(249,115,22,0.25);">
            
            <!-- HEADER -->
            <tr>
              <td style="background: linear-gradient(135deg, #F97316, #EA580C); padding:28px 32px;">
                <table width="100%">
                  <tr>
                    <td align="left">
                      <div style="font-size:20px; font-weight:800; color:#ffffff; letter-spacing:-0.02em; font-family: 'Segoe UI', Roboto, sans-serif;">
                        Burg<span style="color:#FED7AA;">shake</span>
                      </div>
                      <div style="font-size:11px; color:rgba(255,255,255,0.85); margin-top:4px; text-transform:uppercase; letter-spacing:0.15em;">
                        Handcrafted · Takeaway Only
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:32px;">
                ${bodyHtml}
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="padding:24px 32px; background:#FDFCFB; border-top:1px solid #F5E6D3; text-align:center;">
                <div style="font-size:11px; color:#737373; line-height:1.6;">
                  <strong>Burgshake</strong> · 12 Linking Road, Bandra West, Mumbai<br />
                  Open daily 11 AM – 11 PM · <a href="tel:+919876543210" style="color:#EA580C; text-decoration:none;">+91 98765 43210</a>
                </div>
                <div style="font-size:10px; color:#A3A3A3; margin-top:12px;">
                  You&apos;re receiving this because you contacted us or placed an order.
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/* ═══════════════════════════════════════════════════
   EMAIL — Notify admin of new contact
   ═══════════════════════════════════════════════════ */
export async function sendContactNotificationToAdmin(contact) {
  const subject = `🍔 New contact: ${contact.name} — ${contact.topic}`;

  const bodyHtml = `
    <h1 style="margin:0 0 16px; font-size:22px; font-weight:800; color:#171717; letter-spacing:-0.02em;">
      New message received
    </h1>
    <p style="margin:0 0 20px; font-size:14px; line-height:1.6; color:#525252;">
      You have a new contact form submission on Burgshake.
    </p>

    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #F5E6D3; border-radius:14px; overflow:hidden;">
      <tr>
        <td style="padding:14px 18px; background:#FFF6EC; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#EA580C; width:110px;">
          Name
        </td>
        <td style="padding:14px 18px; background:#FFF6EC; font-size:14px; color:#171717;">
          ${contact.name}
        </td>
      </tr>
      <tr>
        <td style="padding:14px 18px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#737373;">
          Email
        </td>
        <td style="padding:14px 18px; font-size:14px; color:#171717;">
          <a href="mailto:${contact.email}" style="color:#EA580C; text-decoration:none;">${contact.email}</a>
        </td>
      </tr>
      ${
        contact.phone
          ? `
      <tr>
        <td style="padding:14px 18px; background:#FDFCFB; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#737373;">
          Phone
        </td>
        <td style="padding:14px 18px; background:#FDFCFB; font-size:14px; color:#171717;">
          <a href="tel:${contact.phone}" style="color:#EA580C; text-decoration:none;">+91 ${contact.phone}</a>
        </td>
      </tr>
      `
          : ""
      }
      <tr>
        <td style="padding:14px 18px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#737373;">
          Topic
        </td>
        <td style="padding:14px 18px; font-size:14px; color:#171717;">
          ${contact.topic}
        </td>
      </tr>
    </table>

    <div style="margin-top:24px; padding:18px; background:#FFF6EC; border-left:3px solid #F97316; border-radius:8px;">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#EA580C; margin-bottom:8px;">
        Message
      </div>
      <div style="font-size:14px; line-height:1.7; color:#404040; white-space:pre-wrap;">
        ${contact.message}
      </div>
    </div>

    <p style="margin:24px 0 0; font-size:12px; color:#A3A3A3;">
      Reply within 24 hours to keep customers happy. 💛
    </p>
  `;

  return sendMail({
    to: env.EMAIL_USER,
    subject,
    html: emailWrapper({
      title: "New Contact Submission",
      preheader: `${contact.name} — ${contact.topic}`,
      bodyHtml,
    }),
    text: `New contact from ${contact.name} (${contact.email}) — ${contact.topic}\n\n${contact.message}`,
    replyTo: contact.email,
  });
}

/* ═══════════════════════════════════════════════════
   EMAIL — Auto-reply to user
   ═══════════════════════════════════════════════════ */
export async function sendContactAutoReply(contact) {
  const bodyHtml = `
    <h1 style="margin:0 0 8px; font-size:22px; font-weight:800; color:#171717; letter-spacing:-0.02em;">
      Thanks, ${contact.name.split(" ")[0]}! 🍔
    </h1>
    <p style="margin:0 0 20px; font-size:14px; line-height:1.7; color:#525252;">
      We&apos;ve received your message and our team will get back to you within
      a few hours during business hours.
    </p>

    <div style="padding:18px; background:#FFF6EC; border-radius:12px;">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#EA580C; margin-bottom:8px;">
        Your message
      </div>
      <div style="font-size:13.5px; line-height:1.7; color:#404040; white-space:pre-wrap;">
        ${contact.message}
      </div>
    </div>

    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;">
      <tr>
        <td style="padding:14px 0; border-top:1px solid #F5E6D3;">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#737373; margin-bottom:4px;">
            Need to reach us faster?
          </div>
          <div style="font-size:14px; color:#404040;">
            Call us at <a href="tel:+919876543210" style="color:#EA580C; text-decoration:none; font-weight:600;">+91 98765 43210</a>
          </div>
        </td>
      </tr>
    </table>

    <p style="margin:28px 0 0; font-size:13px; line-height:1.6; color:#737373;">
      We&apos;re open every day, 11 AM to 11 PM. Come visit us at 12 Linking Road, Bandra West.
    </p>
    <p style="margin:16px 0 0; font-size:13px; color:#404040;">
      — The Burgshake Team
    </p>
  `;

  return sendMail({
    to: contact.email,
    subject: "We got your message — Burgshake",
    html: emailWrapper({
      title: "Message Received",
      preheader: "We&apos;ll be in touch shortly.",
      bodyHtml,
    }),
    text: `Thanks ${contact.name.split(" ")[0]}! We received your message and will reply soon.`,
  });
}