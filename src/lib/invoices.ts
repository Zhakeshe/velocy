export type Invoice = {
  id: string;
  amount: string;
  time: string;
  method: string;
  status: "pending" | "paid";
};

const STORAGE_KEY = "velocy_invoices";

export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Invoice[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addInvoice(invoice: Invoice) {
  if (typeof window === "undefined") {
    return;
  }

  const next = [invoice, ...getInvoices()];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
