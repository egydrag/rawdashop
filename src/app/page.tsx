import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4 text-center">منتجاتنا</h1>
      <ProductGrid products={products} />
    </section>
  );
}
