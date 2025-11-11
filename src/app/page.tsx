import ProductGrid from "@/components/ProductGrid";

export default async function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
  const products = await res.json();

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4 text-center">منتجاتنا</h1>
      <ProductGrid products={products} />
    </section>
  );
}
