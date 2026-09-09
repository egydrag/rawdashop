import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/lib/store";
import { Aref_Ruqaa } from "next/font/google";

const aref = Aref_Ruqaa({
  weight: '400'
})

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

  const configuredStoreName = settings?.storeName?.trim();
  const storeName =
    configuredStoreName && configuredStoreName !== "روضة للإكسسوارات"
      ? configuredStoreName
      : "بريق";
  const featured = products.filter((p) => p.isFeatured);

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden rounded-4xl bg-linear-to-br from-rose-100 via-pink-50 to-amber-50 px-6 py-12 text-center border border-rose-100 sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute -inset-e-16 -top-20 size-56 rounded-full bg-white/50 blur-3xl" />
        <div className="pointer-events-none absolute -inset-s-20 -bottom-24 size-64 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center rounded-full border border-rose-200 bg-white/70 px-4 py-1 text-xs font-bold text-rose-700">
            لمسة تكمّل أناقتك
          </span>
          <h1 className={`mt-2 text-4xl font-bold tracking-tight ${aref.className} text-stone-900 sm:text-5xl`}>
            {storeName}
          </h1>
          <p className="mt-3 text-lg font-semibold text-rose-800 sm:text-xl">
            أجمل الإكسسوارات لإطلالة تليق بك
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
            اكتشفي مجموعتنا المميزة من إكسسوارات الشعر والتوك المختارة بعناية،
            وصمّمت لتضيف لمسة من الجمال إلى كل يوم وكل مناسبة.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#products"
              className="rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-600/20 transition-colors hover:bg-rose-700"
            >
              تسوّقي الآن
            </a>
            <a
              href="#featured"
              className="rounded-xl border border-rose-200 bg-white/80 px-6 py-3 text-sm font-bold text-rose-700 transition-colors hover:bg-white"
            >
              اكتشفي المميز
            </a>
          </div>
          <div className="mx-auto mt-9 grid max-w-lg grid-cols-3 divide-x divide-x-reverse divide-rose-200/80 text-center">
            <div className="px-2">
              <strong className="block text-xl font-bold text-stone-900">1000+</strong>
              <span className="text-xs text-stone-500">عميلة سعيدة</span>
            </div>
            <div className="px-2">
              <strong className="block text-xl font-bold text-stone-900">500+</strong>
              <span className="text-xs text-stone-500">قطعة مميزة</span>
            </div>
            <div className="px-2">
              <strong className="block text-xl font-bold text-stone-900">4.9</strong>
              <span className="text-xs text-stone-500">تقييم عميلاتنا</span>
            </div>
          </div>
        </div>
      </section>

      {/* المنتجات المميزة */}
      {featured.length > 0 && (
        <section id="featured">
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
      <section id="products">
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
