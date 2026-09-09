import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/lib/store";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, categories, products] = await Promise.all([
    getStoreSettings(),
    prisma.category.findMany({
      where: { products: { some: { isActive: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: { select: { name: true } } },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  const storeName = settings?.storeName || "روضة للإكسسوارات";
  const featured = products.filter((p) => p.isFeatured);

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section */}
      <section className="rounded-2xl bg-linear-to-br from-rose-50 to-pink-50 px-6 py-10 text-center border border-rose-100">
        <p className="text-3xl mb-2">🌸</p>
        <h1 className="text-3xl font-bold text-stone-900">{storeName}</h1>
        <p className="mt-2 text-stone-500 text-sm max-w-xs mx-auto leading-relaxed">
          إكسسوارات مختارة بعناية — اطلبي بسهولة عبر WhatsApp
        </p>
      </section>

      {/* المنتجات المميزة */}
      {featured.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
            <span>⭐</span> منتجات مميزة
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {featured.map((product) => (
              <div key={product.id}>
                {/* استخدام ProductCard مباشرةً بدون فلتر */}
                <a href={`/product/${product.id}`} className="block group">
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-stone-100">
                    <div className="relative aspect-square overflow-hidden bg-rose-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.imageUrl || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 inset-e-2 bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        ⭐ مميز
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-rose-600 font-bold text-base mt-1">
                        {new Intl.NumberFormat("ar-EG", {
                          style: "currency",
                          currency: "EGP",
                          maximumFractionDigits: 0,
                        }).format(product.price)}
                      </p>
                    </div>
                  </article>
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* كل المنتجات مع الفلتر */}
      <section>
        <h2 className="text-lg font-bold text-stone-900 mb-3">كل المنتجات</h2>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl aspect-square animate-pulse border border-stone-100" />
              ))}
            </div>
          }
        >
          <ProductGrid
            products={products.map((p) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              imageUrl: p.imageUrl,
              isAvailable: p.isAvailable,
              isFeatured: p.isFeatured,
              category: p.category,
              categoryId: p.categoryId,
            }))}
            categories={categories}
          />
        </Suspense>

        {products.length === 0 && (
          <p className="rounded-xl bg-white p-8 text-center text-stone-500 border border-stone-100">
            لا توجد منتجات متاحة حاليًا.
          </p>
        )}
      </section>
    </div>
  );
}
