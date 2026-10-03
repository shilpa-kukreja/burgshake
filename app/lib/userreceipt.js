import { jsPDF } from "jspdf";

/* ── Brand palette ──────────────────────────────────── */
const DARK   = [23, 23, 23];
const MUTED  = [115, 115, 115];
const LIGHT  = [245, 245, 245];
const BORDER = [229, 229, 229];
const BRAND  = [249, 115, 22];
const GREEN  = [22, 163, 74];
const AMBER  = [217, 119, 6];

/* ── Note on the rupee symbol ───────────────────────
   jsPDF's built-in fonts (Helvetica/Times/Courier)
   are Latin-1 and cannot render "₹" (U+20B9).
   We use "Rs." throughout. If you want a real ₹,
   embed a Unicode font (e.g. NotoSans) via
   doc.addFont(...) — adds ~150KB to the bundle. */

/* ── Helpers ────────────────────────────────────────── */

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatPickupDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  if (isNaN(d)) return dateStr;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/* ── Main generator ─────────────────────────────────── */
export function generateOrderReceipt(order) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const PAGE_W = 210;
  const PAGE_H = 297;
  const M = 15;
  const CW = PAGE_W - M * 2;
  let y = M;

  /* ── Layout helpers ─────────────────────────────── */
  const pageBreak = (needed) => {
    if (y + needed > PAGE_H - 25) {
      doc.addPage();
      y = M;
    }
  };

  const sectionHeader = (title) => {
    pageBreak(14);
    y += 4;
    doc.setFillColor(...LIGHT);
    doc.rect(M, y, CW, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    doc.text(title.toUpperCase(), M + 3, y + 5.4);
    y += 12;
  };

  const row = (label, value, opts = {}) => {
    pageBreak(6);
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(opts.size || 10);
    doc.setTextColor(...(opts.labelColor || MUTED));
    doc.text(label, M, y);

    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setTextColor(...(opts.valueColor || DARK));
    doc.text(String(value ?? "—"), PAGE_W - M, y, { align: "right" });
    y += opts.lineHeight || 5.5;
  };

  /* ── Banner ─────────────────────────────────────── */
  doc.setFillColor(...DARK);
  doc.rect(0, 0, PAGE_W, 32, "F");
  doc.setFillColor(...BRAND);
  doc.rect(0, 32, PAGE_W, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("Burgshake", M, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text("Handcrafted · Takeaway only", M, 21);
  doc.text("+91 98765 43210", M, 26);

//   doc.text("burgshake.com", PAGE_W - M, 21, { align: "right" });

  y = 46;

  /* ── Receipt title + order number ───────────────── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...DARK);
  doc.text("Order Receipt", M, y);

  doc.setFontSize(11);
  doc.setTextColor(...BRAND);
  doc.text(order.orderNumber || "—", PAGE_W - M, y, { align: "right" });

  y += 3;
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(M, y, PAGE_W - M, y);
  y += 6;

  row("Placed on", formatDateTime(order.createdAt));
  row("Status", (order.status || "").toUpperCase(), { bold: true });
  y += 1;

  /* ── Customer ───────────────────────────────────── */
  sectionHeader("Customer");
  row("Name", order.customer?.name || "—");
  row(
    "Phone",
    order.customer?.phone ? `+91 ${order.customer.phone}` : "—"
  );
  row("Email", order.customer?.email || "—");

  /* ── Pickup ─────────────────────────────────────── */
  sectionHeader("Pickup");
  row("Outlet", order.pickup?.outletName || "—");
  row(
    "Scheduled",
    `${formatPickupDate(order.pickup?.date)}, ${
      order.pickup?.timeSlotLabel || ""
    }`
  );
  row("Address", order.pickup?.outletAddress || "—", { size: 9 });

  /* ── Items ──────────────────────────────────────── */
  sectionHeader("Items");

  /* Column headings */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("ITEM", M, y);
  doc.text("QTY", M + CW - 55, y, { align: "right" });
  doc.text("PRICE", M + CW - 25, y, { align: "right" });
  doc.text("TOTAL", PAGE_W - M, y, { align: "right" });
  y += 2;
  doc.setDrawColor(...BORDER);
  doc.line(M, y, PAGE_W - M, y);
  y += 6;

  (order.items || []).forEach((item) => {
    pageBreak(16);

    const nameLines = doc.splitTextToSize(item.name || "—", CW - 60);
    const lineH = 4.6;

    /* Item name (may wrap) */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text(nameLines, M, y);

    /* Qty / Price / Total columns align with the first line */
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    doc.text(String(item.qty || 1), M + CW - 55, y, { align: "right" });
    doc.text(`Rs. ${item.price}`, M + CW - 25, y, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.text(
      `Rs. ${(Number(item.price) || 0) * (Number(item.qty) || 1)}`,
      PAGE_W - M,
      y,
      { align: "right" }
    );

    y += nameLines.length * lineH;

    /* Customizations on a subdued italic line */
    const c = item.customizations;
    if (c) {
      const parts = [c.bun, c.patty, ...(c.extras || [])].filter(Boolean);
      if (parts.length > 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(...MUTED);
        const custLines = doc.splitTextToSize(parts.join(" · "), CW - 5);
        doc.text(custLines, M, y);
        y += custLines.length * 4;
      }
    }

    y += 3;
  });

  /* ── Totals ─────────────────────────────────────── */
  y += 1;
  doc.setDrawColor(...BORDER);
  doc.line(M, y, PAGE_W - M, y);
  y += 6;

  row("Subtotal", `Rs. ${order.subtotal}`);
  row("Tax (5% GST)", `Rs. ${order.tax}`);

  if (order.discount > 0) {
    row(
      `Discount${order.couponCode ? ` (${order.couponCode})` : ""}`,
      `- Rs. ${order.discount}`,
      { valueColor: GREEN }
    );
  }

  y += 2;
  doc.setDrawColor(...BORDER);
  doc.line(M, y, PAGE_W - M, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...MUTED);
  doc.text("TOTAL", M, y);

  doc.setFontSize(14);
  doc.setTextColor(...DARK);
  doc.text(`Rs. ${order.total}`, PAGE_W - M, y, { align: "right" });
  y += 10;

  /* ── Payment ────────────────────────────────────── */
  sectionHeader("Payment");
  row(
    "Method",
    order.paymentLabel ||
      (order.payment === "razorpay" ? "Paid Online" : "Pay at Counter")
  );
  row(
    "Status",
    (order.paymentStatus || "pending").toUpperCase(),
    {
      bold: true,
      valueColor: order.paymentStatus === "paid" ? GREEN : AMBER,
    }
  );
  if (order.razorpay?.paymentId) {
    row("Payment ref", order.razorpay.paymentId, { size: 8 });
  }
  if (order.razorpay?.paidAt) {
    row("Paid on", formatDateTime(order.razorpay.paidAt));
  }

  /* ── Notes ──────────────────────────────────────── */
  if (order.notes) {
    sectionHeader("Special Instructions");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    const noteLines = doc.splitTextToSize(order.notes, CW);
    pageBreak(noteLines.length * 5 + 4);
    doc.text(noteLines, M, y);
    y += noteLines.length * 5;
  }

  /* ── Footer ─────────────────────────────────────── */
  const footerY = PAGE_H - 20;
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(M, footerY, PAGE_W - M, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Thank you for ordering at Burgshake · Takeaway only — collect at the scheduled time",
    PAGE_W / 2,
    footerY + 5,
    { align: "center" }
  );
  doc.text(
    "12 Linking Road, Bandra West, Mumbai 400050 · Open daily 11 AM – 10:30 PM",
    PAGE_W / 2,
    footerY + 10,
    { align: "center" }
  );

  /* ── Save ───────────────────────────────────────── */
  const safeNumber = (order.orderNumber || "order").replace(/[^a-z0-9-]/gi, "");
  doc.save(`Burgshake-Receipt-${safeNumber}.pdf`);
}