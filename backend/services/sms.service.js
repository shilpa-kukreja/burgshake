/* Fast2SMS — https://www.fast2sms.com/ */

export async function sendOtpSms(phone, otp) {
  const apiKey = process.env.FAST2SMS_API_KEY;

  /* In dev without a key, log the OTP so you can test locally */
  if (!apiKey) {
    console.warn(
      "\n⚠️  FAST2SMS_API_KEY missing — logging OTP instead\n" +
        `   Phone: ${phone}\n   OTP:   ${otp}\n`
    );
    return { skipped: true };
  }

  const body = {
    route: "dlt",
    sender_id: process.env.FAST2SMS_SENDER_ID || "ZAYORA",
    message: process.env.FAST2SMS_MESSAGE_ID || "220034",
    variables_values: String(otp),
    numbers: String(phone),
  };

  const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.return === false) {
    console.error("Fast2SMS error:", data);
    throw new Error(data.message || "Failed to send OTP");
  }

  return data;
}