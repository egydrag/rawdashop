import { isCurrentUserAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStorageClient, PRODUCTS_BUCKET } from "@/lib/storage";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!(await isCurrentUserAdmin())) return NextResponse.json({ error: "غير مصرح." }, { status: 403 });
  try {
    const form = await request.formData();
    const productId = String(form.get("productId") || "");
    const file = form.get("image");
    if (!productId || !(file instanceof File) || !/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 5_000_000) {
      return NextResponse.json({ error: "اختاري صورة JPG أو PNG أو WebP أصغر من 5MB." }, { status: 400 });
    }
    const product = await prisma.product.findUnique({ where: { id: productId }, include: { images: true } });
    if (!product) return NextResponse.json({ error: "المنتج غير موجود." }, { status: 404 });

    const storage = getStorageClient();
    const path = `${product.id}/${crypto.randomUUID()}.${file.type.split("/")[1]}`;
    const { error } = await storage.storage.from(PRODUCTS_BUCKET).upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
    if (error) throw error;
    const { data: url } = storage.storage.from(PRODUCTS_BUCKET).getPublicUrl(path);

    await prisma.$transaction([
      prisma.productImage.create({
        data: { productId, url: url.publicUrl, alt: product.name, position: product.images.length },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { imageUrl: product.imageUrl || url.publicUrl },
      }),
    ]);
    return NextResponse.json({ imageUrl: product.imageUrl || url.publicUrl });
  } catch (error) {
    console.error("Product image upload error", error);
    return NextResponse.json({ error: "تعذر رفع الصورة." }, { status: 500 });
  }
}
