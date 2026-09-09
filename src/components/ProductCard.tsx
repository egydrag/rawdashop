import Link from "next/link";
import Image from "next/image";

export interface ProductCardProduct {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  category?: { name: string } | null;
}

export default function ProductCard({ product }: { product: ProductCardProduct }) {
  const imageSrc = product.imageUrl || "/placeholder.jpg";

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-stone-100">
        {/* الصورة */}
        <div className="relative aspect-square overflow-hidden bg-rose-50">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* شارة المميز */}
          {product.isFeatured && (
            <span className="absolute top-2 inset-e-2 bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              ⭐ مميز
            </span>
          )}
          {/* شارة غير متاح */}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
              <span className="bg-stone-800 text-white text-sm font-bold px-3 py-1 rounded-full">
                غير متاح
              </span>
            </div>
          )}
        </div>

        {/* المعلومات */}
        <div className="p-3">
          {product.category && (
            <p className="text-xs text-stone-400 mb-1">{product.category.name}</p>
          )}
          <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-2 gap-2">
            <p className="text-rose-600 font-bold text-base">
              {new Intl.NumberFormat("ar-EG", {
                style: "currency",
                currency: "EGP",
                maximumFractionDigits: 0,
              }).format(product.price)}
            </p>
            <span className="text-xs text-rose-700 bg-rose-50 px-2 py-1 rounded-lg shrink-0">
              عرض التفاصيل
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
