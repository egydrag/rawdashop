import { WhatsAppOrderForm } from "@/components/WhatsAppOrderForm";
import { prisma } from "@/lib/prisma";
import { formatEgp } from "@/lib/store";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id, isActive: true },
    select: { name: true, description: true, imageUrl: true },
  });
  if (!product) return { title: "المنتج غير موجود | روضة للإكسسوارات" };
  return {
    title: `${product.name} | روضة للإكسسوارات`,
    description:
      product.description || `اطلبي ${product.name} من روضة للإكسسوارات`,
    openGraph: {
      title: `${product.name} | روضة للإكسسوارات`,
      description:
        product.description || `اطلبي ${product.name} من روضة للإكسسوارات`,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id, isActive: true },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
    },
  });
  if (!product) notFound();

  const images =
    product.images.length > 0
      ? product.images
      : product.imageUrl
        ? [{ id: "cover", url: product.imageUrl, alt: product.name, position: 0 }]
        : [];

  return (
    <div className="max-w-2xl mx-auto">
      {/* رابط العودة */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 mb-4 transition-colors"
      >
        ← العودة للمتجر
      </Link>

      <article className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        {/* الصور */}
        {images.length > 0 ? (
          <div
            className={`grid gap-1 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
          >
            {images.map((img, index) => (
              <div
                key={img.id}
                className={`relative bg-rose-50 ${
                  images.length === 1
                    ? "aspect-square"
                    : index === 0 && images.length % 2 !== 0
                      ? "aspect-square col-span-2"
                      : "aspect-square"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 672px"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="aspect-square bg-rose-50 flex items-center justify-center">
            <span className="text-6xl opacity-30">🌸</span>
          </div>
        )}

        {/* المعلومات */}
        <div className="p-5 space-y-4">
          {/* التصنيف والاسم */}
          <div>
            {product.category && (
              <p className="text-xs text-stone-400 mb-1 font-medium uppercase tracking-wider">
                {product.category.name}
              </p>
            )}
            <h1 className="text-2xl font-bold text-stone-900">{product.name}</h1>
          </div>

          {/* السعر والتوفر */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-3xl font-bold text-rose-600">
              {formatEgp(product.price)}
            </p>
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full ${
                product.isAvailable
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-stone-100 text-stone-500 border border-stone-200"
              }`}
            >
              {product.isAvailable ? "✓ متاح الآن" : "غير متاح حاليًا"}
            </span>
          </div>

          {/* الوصف */}
          {product.description && (
            <p className="text-stone-600 leading-7 text-sm border-t border-stone-100 pt-4">
              {product.description}
            </p>
          )}

          {/* الكمية */}
          {product.stockQuantity !== null && product.stockQuantity !== undefined && (
            <p className="text-xs text-stone-500">
              الكمية المتاحة: {product.stockQuantity} قطعة
            </p>
          )}

          {/* زر WhatsApp */}
          <div className="border-t border-stone-100 pt-4">
            <WhatsAppOrderForm
              productId={product.id}
              productName={product.name}
              available={product.isAvailable}
              maxQuantity={product.stockQuantity}
            />
          </div>
        </div>
      </article>
    </div>
  );
}
