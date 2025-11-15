import ProductCard from "./ProductCard";
import { Product } from "@/types";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-2 sm:px-0">
      {products.map((p: Product) => (
        <div
          key={p.id}
          className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
        >
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
