/* utils/notifyAdmin.js */

/**
 * Marks an order as notified and (optionally) emits a socket event.
 * Safe to call even if socket.io is not installed.
 */
export async function notifyAdmin(order) {
  if (!order) return;

  // Guard — never fire twice
  if (order.notifiedAdmin) return;

  order.notifiedAdmin = true;

  // If order is a mongoose doc, persist the flag
  if (typeof order.save === "function" && order.isModified?.("notifiedAdmin")) {
    await order.save();
  } else if (typeof order.save === "function" && order.isNew === false) {
    // even if not marked modified, save defensively
    try { await order.save(); } catch { /* ignore */ }
  }

  // Try to emit via socket.io IF it exists — never crash if not
  try {
    const mod = await import("../socket.js").catch(() => null);
    if (mod?.getIO) {
      const io = mod.getIO();
      if (io) {
        io.to("admin").emit("new-order", {
          _id: order._id,
          orderNumber: order.orderNumber,
          customer: order.customer,
          total: order.total,
          payment: order.payment,
          paymentStatus: order.paymentStatus,
          status: order.status,
          createdAt: order.createdAt,
        });
      }
    }
  } catch {
    /* socket not configured — ignore */
  }
}