import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const dynamicParams = true;

export default async function ProductDetails(props: { params: Promise<{ id: string }> }) {
  // 👇 لاحظ أننا نفك الـ Promise
  const { id } = await props.params;

  if (!id) {
    return <p className="text-center text-red-500">حدث خطأ: لم يتم تحديد المنتج</p>;
  }

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return <p className="text-center text-amber-600">المنتج غير موجود</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 mx-auto max-w-md">
      {product.imageUrl && (
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={400}
          className="w-full rounded-lg mb-4"
        />
      )}
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <p className="text-pink-600 text-xl font-semibold">
        السعر: {product.price} ج.م
      </p>
    </div>
  );
}
