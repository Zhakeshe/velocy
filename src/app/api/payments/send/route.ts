import { NextResponse } from "next/server";

const SEND_API_URL = "https://pay.crypt.bot/api/createInvoice";

type Payload = {
  amount?: string;
  currency?: string;
  method?: string;
};

export async function POST(request: Request) {
  const token = process.env.SEND_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "SEND_API_TOKEN is not configured" }, { status: 500 });
  }

  const body = (await request.json()) as Payload;
  const { amount, currency, method } = body ?? {};

  if (!amount || !currency || method !== "send") {
    return NextResponse.json({ error: "Missing or invalid payment data" }, { status: 400 });
  }

  const response = await fetch(SEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Crypto-Pay-API-Token": token,
    },
    body: JSON.stringify({
      amount,
      fiat: currency,
      currency_type: "fiat",
    }),
  });

  const data = await response.json();

  if (!response.ok || !data?.ok) {
    return NextResponse.json({ error: data?.error || "Send API error" }, { status: 502 });
  }

  return NextResponse.json({ payUrl: data.result?.pay_url });
}
