export type CatalogItem = {
  id: string;
  name: string;
  category: string;
  owner: string;
  createdAt: string;
};

const store = globalThis as any;

if (!store.__veMockDb) {
  store.__veMockDb = {
    services: [
      {
        id: "seed-1",
        name: "Workspace Pro",
        category: "Подписки",
        owner: "Velocy",
        createdAt: new Date().toISOString(),
      },
    ] as CatalogItem[],
  };
}

function db() {
  return store.__veMockDb as { services: CatalogItem[] };
}

export function listCatalog(): CatalogItem[] {
  return db().services;
}

export function addCatalogItem(payload: { name: string; category: string; owner: string }): CatalogItem {
  const item: CatalogItem = {
    id: `srv-${Math.random().toString(36).slice(2, 8)}`,
    name: payload.name,
    category: payload.category,
    owner: payload.owner,
    createdAt: new Date().toISOString(),
  };

  db().services = [item, ...db().services];
  return item;
}

export function deleteCatalogItem(id: string): boolean {
  const before = db().services.length;
  db().services = db().services.filter((item) => item.id !== id);
  return db().services.length !== before;
}
