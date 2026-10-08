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
export async function sendMail({ to, subject, html, text, replyTo }) {
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


/* ═══════════════════════════════════════════════════
   EMAIL — Welcome email for new subscribers
   ═══════════════════════════════════════════════════ */
export async function sendWelcomeEmail(subscriber) {
  const firstName = (subscriber.name || "").split(" ")[0] || "there";

  const unsubscribeUrl = `${env.CLIENT_URL?.split(",")[0]?.trim() || "http://localhost:3000"}/unsubscribe/${subscriber.unsubscribeToken}`;

  const bodyHtml = `
    <h1 style="margin:0 0 8px; font-size:22px; font-weight:800; color:#171717; letter-spacing:-0.02em;">
      Welcome to the table, ${firstName} 🍔
    </h1>
    <p style="margin:0 0 20px; font-size:14px; line-height:1.7; color:#525252;">
      You&apos;re officially on <strong>The Burgshake Letter</strong> — our
      occasional note about seasonal drops, secret offers, and what&apos;s
      coming off the grill next.
    </p>

    <div style="padding:20px; background:#FFF6EC; border-radius:12px;">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#EA580C; margin-bottom:10px;">
        What you&apos;ll get
      </div>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding:6px 0; font-size:13.5px; color:#404040; line-height:1.6;">
            🍟 &nbsp;First dibs on limited-run flavours
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0; font-size:13.5px; color:#404040; line-height:1.6;">
            🎁 &nbsp;Subscriber-only offers (no spam, ever)
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0; font-size:13.5px; color:#404040; line-height:1.6;">
            🔥 &nbsp;Behind-the-grill stories and kitchen experiments
          </td>
        </tr>
      </table>
    </div>

    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:26px;">
      <tr>
        <td align="center">
          <a
            href="${env.CLIENT_URL?.split(",")[0]?.trim() || "http://localhost:3000"}/menu"
            style="display:inline-block; padding:13px 26px; background:#171717; color:#ffffff; font-size:13px; font-weight:700; text-decoration:none; border-radius:999px; letter-spacing:-0.01em;"
          >
            Browse the menu →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:28px 0 0; font-size:13px; line-height:1.7; color:#737373;">
      Hungry now? We&apos;re open every day, 11 AM to 11 PM. Drop by the
      counter at 12 Linking Road, Bandra West.
    </p>

    <p style="margin:16px 0 0; font-size:13px; color:#404040;">
      — The Burgshake Team
    </p>

    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:32px; border-top:1px solid #F5E6D3;">
      <tr>
        <td style="padding-top:18px; font-size:11px; color:#A3A3A3; line-height:1.6; text-align:center;">
          Changed your mind?
          <a href="${unsubscribeUrl}" style="color:#737373; text-decoration:underline;">
            Unsubscribe in one click
          </a>
        </td>
      </tr>
    </table>
  `;

  return sendMail({
    to: subscriber.email,
    subject: "Welcome to The Burgshake Letter 🍔",
    html: emailWrapper({
      title: "Welcome to Burgshake",
      preheader: "You're on the list — here's what to expect.",
      bodyHtml,
    }),
    text: `Welcome to The Burgshake Letter! You'll get occasional updates on new flavours and offers.\n\nUnsubscribe: ${unsubscribeUrl}`,
    replyTo: env.EMAIL_USER,
  });
}








/* ── Format "2026-09-23" → "Wed, 23 Sep" ── */
function formatPickupDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export async function sendOrderConfirmation(order) {
  const firstName = (order.customer?.name || "there").split(" ")[0];
  const isPaid = order.payment === "razorpay";
  const isCounter = order.payment === "counter";

  /* ── Items ──────────────────────────────────────── */
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:14px 0; border-bottom:1px solid #F5E6D3;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="font-size:14px; font-weight:700; color:#171717; line-height:1.4;">
                ${item.name}
              </td>
              <td align="right" style="font-size:14px; font-weight:700; color:#171717; white-space:nowrap; padding-left:12px;">
                ₹${item.price * item.qty}
              </td>
            </tr>
            ${
              item.customizations
                ? `<tr><td colspan="2" style="font-size:12px; color:#737373; padding-top:5px; line-height:1.5;">
                    ${[
                      item.customizations.bun,
                      item.customizations.patty,
                      ...(item.customizations.extras || []),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </td></tr>`
                : ""
            }
            <tr>
              <td colspan="2" style="font-size:12px; color:#A3A3A3; padding-top:4px;">
                ₹${item.price} × ${item.qty}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `
    )
    .join("");

  /* ── Totals ─────────────────────────────────────── */
  const totalsHtml = `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:12px;">
      <tr>
        <td style="padding:6px 0; font-size:13.5px; color:#737373;">Subtotal</td>
        <td align="right" style="padding:6px 0; font-size:13.5px; color:#404040; font-weight:600;">₹${order.subtotal}</td>
      </tr>
      <tr>
        <td style="padding:6px 0; font-size:13.5px; color:#737373;">Taxes (5% GST)</td>
        <td align="right" style="padding:6px 0; font-size:13.5px; color:#404040; font-weight:600;">₹${order.tax}</td>
      </tr>
      ${
        order.discount > 0
          ? `<tr>
              <td style="padding:6px 0; font-size:13.5px; color:#059669;">
                Discount${order.couponCode ? ` (${order.couponCode})` : ""}
              </td>
              <td align="right" style="padding:6px 0; font-size:13.5px; color:#059669; font-weight:600;">−₹${order.discount}</td>
            </tr>`
          : ""
      }
      <tr>
        <td style="padding:16px 0 0; border-top:1px solid #F5E6D3; font-size:11px; text-transform:uppercase; letter-spacing:0.14em; color:#737373; font-weight:700;">
          Total
        </td>
        <td align="right" style="padding:16px 0 0; border-top:1px solid #F5E6D3; font-size:22px; font-weight:800; color:#171717; letter-spacing:-0.01em;">
          ₹${order.total}
        </td>
      </tr>
    </table>
  `;

  /* ── Payment pill ───────────────────────────────── */
  const paymentPill = isPaid
    ? `<span style="display:inline-block; padding:6px 12px; border-radius:999px; background:#ECFDF5; color:#047857; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em;">Paid Online</span>`
    : `<span style="display:inline-block; padding:6px 12px; border-radius:999px; background:#FFF7ED; color:#C2410C; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em;">Pay at Counter</span>`;

  const pickupDateLabel = formatPickupDate(order.pickup.date);

  /* ── Body ───────────────────────────────────────── */
  const bodyHtml = `
    <h1 style="margin:0 0 8px; font-size:22px; font-weight:800; color:#171717; letter-spacing:-0.02em; line-height:1.25;">
      Order confirmed, ${firstName}! 🍔
    </h1>
    <p style="margin:0 0 20px; font-size:14px; line-height:1.7; color:#525252;">
      Thanks for your order. We&apos;ve received it and the kitchen is on it.
      ${isCounter ? "Just pay at the counter when you pick up." : "Your payment has been received."}
    </p>

    <!-- Order number card -->
    <div style="padding:18px; background:#FFF6EC; border-radius:14px; text-align:center; margin-bottom:20px;">
      <div style="font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.16em; color:#EA580C; margin-bottom:6px;">
        Order Number
      </div>
      <div style="font-size:20px; font-weight:800; color:#171717; letter-spacing:-0.01em; word-break:break-word;">
        ${order.orderNumber}
      </div>
      <div style="margin-top:12px;">${paymentPill}</div>
    </div>

    <!-- ═══ Pickup card — mobile-friendly stacked layout ═══ -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #F5E6D3; border-radius:14px; margin-bottom:24px;">
      <!-- Top row: outlet -->
      <tr>
        <td style="padding:16px 18px; background:#FFF6EC; border-radius:14px 14px 0 0;">
          <div style="font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#EA580C; margin-bottom:8px;">
            Pickup at
          </div>
          <div style="font-size:15px; font-weight:700; color:#171717; line-height:1.4;">
            ${order.pickup.outletName}
          </div>
          <div style="font-size:13px; color:#737373; line-height:1.6; margin-top:4px;">
            ${order.pickup.outletAddress}
          </div>
        </td>
      </tr>
      <!-- Bottom row: date + time -->
      <tr>
        <td style="padding:16px 18px; border-top:1px solid #F5E6D3;">
          <div style="font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#EA580C; margin-bottom:8px;">
            Ready by
          </div>
          <div style="font-size:15px; font-weight:700; color:#171717; line-height:1.4;">
            ${pickupDateLabel}
          </div>
          <div style="font-size:13.5px; color:#525252; line-height:1.6; margin-top:4px;">
            ${order.pickup.timeSlotLabel}
          </div>
        </td>
      </tr>
    </table>

    <!-- Items -->
    <h2 style="margin:0 0 4px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#737373;">
      Your Order
    </h2>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:8px;">
      ${itemsHtml}
    </table>

    ${totalsHtml}

    ${
      order.notes
        ? `<div style="margin-top:24px; padding:16px; background:#FFF6EC; border-left:3px solid #F97316; border-radius:8px;">
            <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#EA580C; margin-bottom:6px;">
              Your Note
            </div>
            <div style="font-size:13.5px; line-height:1.7; color:#404040; font-style:italic;">
              &ldquo;${order.notes}&rdquo;
            </div>
          </div>`
        : ""
    }

    <!-- Important callout -->
    <div style="margin-top:24px; padding:16px; background:#FEF3C7; border-radius:12px;">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#B45309; margin-bottom:6px;">
        ⚠️ Takeaway only
      </div>
      <div style="font-size:13px; line-height:1.65; color:#78350F;">
        Please collect your order at the counter. We hold ready orders for
        <strong>30 minutes</strong> past the scheduled time. If you&apos;re running
        late, call us at <a href="tel:+919876543210" style="color:#B45309; text-decoration:underline;">+91 98765 43210</a>.
      </div>
    </div>

    <p style="margin:28px 0 0; font-size:13px; line-height:1.7; color:#737373;">
      Questions? Reply to this email or call us at 11 AM – 11 PM, any day.
    </p>
    <p style="margin:16px 0 0; font-size:13px; color:#404040;">
      — The Burgshake Team
    </p>
  `;

  return sendMail({
    to: order.customer.email,
    subject: `Order confirmed — ${order.orderNumber} · Burgshake`,
    html: emailWrapper({
      title: "Order Confirmed",
      preheader: `${order.orderNumber} confirmed · Pickup at ${order.pickup.outletName}, ${order.pickup.timeSlotLabel}`,
      bodyHtml,
    }),
    text: `Thanks ${firstName}! Your order ${order.orderNumber} is confirmed. Total: ₹${order.total}. Pickup at ${order.pickup.outletName} — ${pickupDateLabel}, ${order.pickup.timeSlotLabel}.`,
    replyTo: env.EMAIL_USER,
  });
}










/* ═══════════════════════════════════════════════════
   EMAIL — New order alert to admin
   Sent alongside the customer confirmation so the admin
   has a full copy they can act on.
   ═══════════════════════════════════════════════════ */
export async function sendAdminOrderAlert(order) {
  const isPaid = order.payment === "razorpay";
  const isCounter = order.payment === "counter";
  const pickupDateLabel = formatPickupDate(order.pickup.date);

  /* ── Items table ────────────────────────────────── */
  const itemsHtml = order.items
    .map((item) => {
      const customParts = item.customizations
        ? [
            item.customizations.bun,
            item.customizations.patty,
            ...(item.customizations.extras || []),
          ].filter(Boolean)
        : [];

      return `
        <tr>
          <td style="padding:12px 0; border-bottom:1px solid #F5E6D3;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="font-size:14px; font-weight:700; color:#171717; line-height:1.4;">
                  ${item.qty}× ${item.name}
                </td>
                <td align="right" style="font-size:14px; font-weight:700; color:#171717; white-space:nowrap; padding-left:12px;">
                  ₹${item.price * item.qty}
                </td>
              </tr>
              ${
                customParts.length
                  ? `<tr><td colspan="2" style="font-size:12px; color:#737373; padding-top:4px; line-height:1.5;">
                      ${customParts.join(" · ")}
                    </td></tr>`
                  : ""
              }
            </table>
          </td>
        </tr>
      `;
    })
    .join("");

  /* ── Payment banner ─────────────────────────────── */
  const paymentBanner = isPaid
    ? `<div style="padding:14px 18px; background:#ECFDF5; border-radius:12px; margin-bottom:20px;">
        <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#047857; margin-bottom:4px;">
          ✅ Paid Online
        </div>
        <div style="font-size:13px; line-height:1.6; color:#065F46;">
          Payment received via Razorpay${order.razorpay?.paymentId ? ` — ref <code style="background:#fff; padding:2px 6px; border-radius:4px; font-size:12px;">${order.razorpay.paymentId}</code>` : ""}.
        </div>
      </div>`
    : `<div style="padding:14px 18px; background:#FFF7ED; border-radius:12px; margin-bottom:20px;">
        <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#C2410C; margin-bottom:4px;">
          💵 Collect at Counter
        </div>
        <div style="font-size:13px; line-height:1.6; color:#7C2D12;">
          Customer pays <strong>₹${order.total}</strong> in cash or card on pickup.
        </div>
      </div>`;

  /* ── Body ───────────────────────────────────────── */
  const bodyHtml = `
    <h1 style="margin:0 0 4px; font-size:20px; font-weight:800; color:#171717; letter-spacing:-0.02em; line-height:1.25;">
      🍔 New order received
    </h1>
    <p style="margin:0 0 20px; font-size:13.5px; line-height:1.6; color:#525252;">
      A new order has been placed on the website.
    </p>

    ${paymentBanner}

    <!-- Order number + total -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #F5E6D3; border-radius:14px; margin-bottom:20px;">
      <tr>
        <td style="padding:16px 18px; background:#FFF6EC; border-radius:14px 14px 0 0;">
          <div style="font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#EA580C; margin-bottom:6px;">
            Order Number
          </div>
          <div style="font-size:19px; font-weight:800; color:#171717; letter-spacing:-0.01em; word-break:break-word;">
            ${order.orderNumber}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 18px; border-top:1px solid #F5E6D3;">
          <div style="font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#EA580C; margin-bottom:6px;">
            Total
          </div>
          <div style="font-size:22px; font-weight:800; color:#171717;">
            ₹${order.total}
          </div>
        </td>
      </tr>
    </table>

    <!-- Customer contact -->
    <h2 style="margin:0 0 12px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#737373;">
      Customer
    </h2>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #F5E6D3; border-radius:14px; margin-bottom:20px;">
      <tr>
        <td style="padding:14px 18px; background:#FDFCFB; border-radius:14px 14px 0 0;">
          <div style="font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#737373; margin-bottom:4px;">
            Name
          </div>
          <div style="font-size:14px; font-weight:700; color:#171717;">
            ${order.customer.name}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 18px; border-top:1px solid #F5E6D3;">
          <div style="font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#737373; margin-bottom:4px;">
            Phone
          </div>
          <div style="font-size:14px; font-weight:700; color:#171717;">
            <a href="tel:+91${order.customer.phone}" style="color:#EA580C; text-decoration:none;">
              +91 ${order.customer.phone}
            </a>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 18px; border-top:1px solid #F5E6D3;">
          <div style="font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#737373; margin-bottom:4px;">
            Email
          </div>
          <div style="font-size:13.5px; color:#171717; word-break:break-all;">
            <a href="mailto:${order.customer.email}" style="color:#EA580C; text-decoration:none;">
              ${order.customer.email}
            </a>
          </div>
        </td>
      </tr>
    </table>

    <!-- Pickup -->
    <h2 style="margin:0 0 12px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#737373;">
      Pickup
    </h2>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #F5E6D3; border-radius:14px; margin-bottom:20px;">
      <tr>
        <td style="padding:14px 18px; background:#FDFCFB; border-radius:14px 14px 0 0;">
          <div style="font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#737373; margin-bottom:4px;">
            Outlet
          </div>
          <div style="font-size:14px; font-weight:700; color:#171717;">
            ${order.pickup.outletName}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 18px; border-top:1px solid #F5E6D3;">
          <div style="font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#737373; margin-bottom:4px;">
            Scheduled
          </div>
          <div style="font-size:14px; font-weight:700; color:#171717;">
            ${pickupDateLabel} · ${order.pickup.timeSlotLabel}
          </div>
        </td>
      </tr>
    </table>

    <!-- Items -->
    <h2 style="margin:0 0 4px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#737373;">
      Items (${order.items.length})
    </h2>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:12px;">
      ${itemsHtml}
    </table>

    ${
      order.notes
        ? `<div style="margin-top:20px; padding:16px; background:#FFF6EC; border-left:3px solid #F97316; border-radius:8px;">
            <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:#EA580C; margin-bottom:6px;">
              Customer Note
            </div>
            <div style="font-size:13.5px; line-height:1.7; color:#404040; font-style:italic;">
              &ldquo;${order.notes}&rdquo;
            </div>
          </div>`
        : ""
    }

    <!-- Admin panel CTA -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:28px;">
      <tr>
        <td align="center">
          <a href="${env.CLIENT_URL?.split(",")[0]?.trim() || "http://localhost:3000"}/admin/orders/${order.orderNumber}"
             style="display:inline-block; padding:13px 26px; background:#171717; color:#ffffff; font-size:13px; font-weight:700; text-decoration:none; border-radius:999px;">
            Open in admin panel →
          </a>
        </td>
      </tr>
    </table>
  `;

  return sendMail({
    to: env.EMAIL_USER,
    subject: `🍔 New order — ${order.orderNumber} · ₹${order.total} · ${order.customer.name}`,
    html: emailWrapper({
      title: "New Order",
      preheader: `${order.orderNumber} · ${order.customer.name} · ₹${order.total} · ${pickupDateLabel}, ${order.pickup.timeSlotLabel}`,
      bodyHtml,
    }),
    text: `New order ${order.orderNumber} from ${order.customer.name} (${order.customer.phone}). Total: ₹${order.total}. Pickup: ${pickupDateLabel}, ${order.pickup.timeSlotLabel}. ${isCounter ? "Collect at counter." : "Paid online."}`,
    replyTo: order.customer.email,
  });
}