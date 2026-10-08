/* ═══════════════════════════════════════════════════
   Sound alerts for the admin panel.

   Two modes available:
   1. Chime (Web Audio) — two-tone ding, reliable everywhere
   2. Voice (Speech Synthesis) — speaks "New order, new order"

   Use both together for maximum alertness. If the voice
   fails or isn't supported, the chime still plays.
   ═══════════════════════════════════════════════════ */

let audioCtx = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  return audioCtx;
}

/* ── Unlock the AudioContext on first user gesture ── */

export async function unlockAudio() {
  const ctx = getCtx();
  if (!ctx) return false;
  if (ctx.state === "running") return true;
  try {
    await ctx.resume();
    return ctx.state === "running";
  } catch {
    return false;
  }
}

export function installAudioUnlockListener() {
  if (typeof window === "undefined") return () => {};

  const handler = async () => {
    const ok = await unlockAudio();
    if (ok) {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
      window.removeEventListener("touchstart", handler);
    }
  };

  window.addEventListener("pointerdown", handler);
  window.addEventListener("keydown", handler);
  window.addEventListener("touchstart", handler);

  return () => {
    window.removeEventListener("pointerdown", handler);
    window.removeEventListener("keydown", handler);
    window.removeEventListener("touchstart", handler);
  };
}

/* ── Chime — 3 repeats ──────────────────────────── */

export async function playChime() {
  const ctx = getCtx();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      return;
    }
  }

  if (ctx.state !== "running") return;

  const now = ctx.currentTime;
  const CHIME_INTERVAL = 0.7;
  const REPEATS = 3;

  for (let i = 0; i < REPEATS; i++) {
    const offset = i * CHIME_INTERVAL;
    const notes = [
      { freq: 880, start: offset + 0.0, duration: 0.16 },
      { freq: 660, start: offset + 0.18, duration: 0.38 },
    ];

    notes.forEach(({ freq, start, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + start);
      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(0.35, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + duration + 0.05);
    });
  }
}

/* ── Voice — "New order, new order, pay attention" ──

   Uses the browser's built-in speech synthesizer. Chrome,
   Edge, Safari, and Firefox all support it. The voice
   itself depends on what's installed on the OS — Windows
   ships with Microsoft voices, macOS with Siri voices,
   Android with Google voices. */

export function speakNewOrder() {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;

  /* Cancel anything currently speaking — important if a
     previous alert is still playing, so they don't queue up. */
  try {
    window.speechSynthesis.cancel();
  } catch {}

  const utterance = new SpeechSynthesisUtterance(
    "New order. New order. Please pay attention."
    // "Pani ki tanki bhar gayi hai kirpaya dhayan de attention please Pani ki tanki bhar gayi hai kirpaya dhayan de "
  );

  utterance.rate = 0.95;   // slightly slower than default — clearer
  utterance.pitch = 1.05;  // a touch higher — more attention-grabbing
  utterance.volume = 1.0;
  utterance.lang = "en-IN"; // Indian English if available

  /* Try to pick an English voice, prefer en-IN */
  try {
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => v.lang === "en-IN") ||
      voices.find((v) => v.lang === "en-GB") ||
      voices.find((v) => v.lang?.startsWith("en"));
    if (preferred) utterance.voice = preferred;
  } catch {}

  window.speechSynthesis.speak(utterance);
}

/* ── Combined alert — chime + voice together ────── */

export async function playNotificationSound() {
  /* Fire both in parallel. The chime establishes "something
     just happened"; the voice tells the admin what. */
  speakNewOrder();
  await playChime();
}

/* ── Browser Notification API (unchanged) ── */

export async function requestNotificationPermission() {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try {
    const result = await Notification.requestPermission();
    return result === "granted";
  } catch {
    return false;
  }
}

export function showOrderNotification(order) {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (document.visibilityState === "visible") return;

  try {
    const n = new Notification("New order received 🍔", {
      body: `${order.orderNumber} · ${order.customer?.name || "Guest"} · ₹${order.total}`,
      icon: "/logo.png",
      tag: order.orderNumber,
      requireInteraction: false,
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {}
}