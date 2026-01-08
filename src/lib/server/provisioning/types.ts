export type PanelType = "web" | "game" | "vps";

export type PanelAccountPayload = {
  email: string;
  name: string;
};

export type PanelResourcePayload = {
  orderId: string;
  email: string;
  name: string;
  productType: PanelType;
  metadata: Record<string, unknown>;
};

export type PanelAccountResult = {
  externalId: string;
};

export type PanelResourceResult = {
  externalId: string;
  panelUrl?: string;
};

export type PanelProvider = {
  type: PanelType;
  createUser: (payload: PanelAccountPayload) => Promise<PanelAccountResult>;
  createResource: (payload: PanelResourcePayload, account: PanelAccountResult) => Promise<PanelResourceResult>;
};
