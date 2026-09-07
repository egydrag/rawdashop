import { prisma } from "@/lib/prisma";

export const STORE_SETTINGS_ID = "default";

export function formatEgp(price: number) {
  return new Intl.NumberFormat("ar-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 2 }).format(price);
}

export async function getStoreSettings() {
  return prisma.storeSettings.findUnique({ where: { id: STORE_SETTINGS_ID } });
}
