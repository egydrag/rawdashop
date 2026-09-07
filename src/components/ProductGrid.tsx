"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ProductCard, { type ProductCardProduct } from "./ProductCard";

interface Category {
  id: string;
  name: string;
}

interface Props {
  products: ProductCardProduct[];
  categories: Category[];
}

export default function ProductGrid({ products, categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("cat") || "";

  const filtered = activeCategory
    ? products.filter((p) => (p as { categoryId?: string | null }).categoryId === activeCategory)
    : products;

  function selectCategory(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("cat", id);
    } else {
      params.delete("cat");
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="space-y-4">
      {/* فلتر التصنيفات */}
      {categories.length > 0 && (
        <nav aria-label="التصنيفات" className="flex flex-wrap gap-2">
          <button
            onClick={() => selectCategory("")}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors border ${
              !activeCategory
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
            }`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors border ${
                activeCategory === cat.id
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>
      )}

      {/* شبكة المنتجات */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-white p-8 text-center text-stone-500 border border-stone-100">
          لا توجد منتجات في هذا التصنيف.
        </p>
      )}
    </div>
  );
}
