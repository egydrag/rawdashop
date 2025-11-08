import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const imageSrc = product.imageUrl || "/placeholder.jpg";

  return (
    <div className="bg-white shadow rounded-2xl overflow-hidden hover:shadow-lg transition">
      <Image
        src={imageSrc}
        alt={product.name}
        className="w-full h-64 object-cover"
        width={400}
        height={400}
      />
      <div className="p-3">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-pink-600 font-bold mt-2">{product.price} ج.م</p>
        <Link
          href={`/product/${product.id}`}
          className="text-sm text-blue-500 mt-2 inline-block"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
}
