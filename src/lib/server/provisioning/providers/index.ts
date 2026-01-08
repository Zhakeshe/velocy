import type { PanelProvider, PanelType } from "../types";
import { cyberPanelProvider } from "./cyberpanel";
import { pterodactylProvider } from "./pterodactyl";
import { proxmoxProvider } from "./proxmox";

const providers: Record<PanelType, PanelProvider> = {
  web: cyberPanelProvider,
  game: pterodactylProvider,
  vps: proxmoxProvider,
};

export function getProvider(type: PanelType) {
  return providers[type];
}
