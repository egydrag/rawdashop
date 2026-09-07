import { AdminDashboard } from "@/components/AdminDashboard";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STORE_SETTINGS_ID } from "@/lib/store";

export default async function DashboardPage() {
  await requireAdminPage();
  const [products, categories, settings, orders] = await Promise.all([
    prisma.product.findMany({ select: { id: true, name: true, description: true, price: true, categoryId: true, isActive: true, isFeatured: true, isAvailable: true, stockQuantity: true, imageUrl: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.storeSettings.findUnique({ where: { id: STORE_SETTINGS_ID } }),
    prisma.order.findMany({ take: 30, orderBy: { createdAt: "desc" }, select: { id: true, customerName: true, customerPhone: true, status: true, createdAt: true, items: { select: { productName: true, quantity: true } } } }),
  ]);
  return <AdminDashboard initialProducts={products} initialCategories={categories} initialSettings={settings || { storeName: "روضة للإكسسوارات", whatsappNumber: "" }} orders={orders.map((order) => ({ ...order, createdAt: order.createdAt.toISOString() }))} />;
}
