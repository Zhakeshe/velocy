type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

const EMAIL_WEBHOOK_URL = process.env.EMAIL_WEBHOOK_URL;

export async function sendEmail(payload: EmailPayload) {
  if (!EMAIL_WEBHOOK_URL) {
    throw new Error("EMAIL_WEBHOOK_URL is not configured");
  }

  const response = await fetch(EMAIL_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Email provider rejected the request");
  }
}
