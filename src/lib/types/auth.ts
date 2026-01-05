export type UserService = {
  id: string;
  name: string;
  area: string;
  plan: string;
  price: string;
  billing: string;
  nextInvoice: string;
  status: "active" | "pending" | "expired";
};

export type AuthUser = { name: string; email: string; services: UserService[] };
