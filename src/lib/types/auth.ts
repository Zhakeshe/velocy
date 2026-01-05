export type UserService = {
  id: string;
  catalogId?: string;
  name: string;
  area: string;
  plan: string;
  price: string;
  billing: string;
  nextInvoice: string;
  status: "active" | "pending" | "expired";
  ip: string;
  hostname: string;
  ptr: string;
  panelUrl: string;
  activatedAt: string;
};

export type AuthUser = { name: string; email: string; balance: number; services: UserService[] };
