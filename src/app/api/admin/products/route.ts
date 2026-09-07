import { isCurrentUserAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";

const productSchema = z.object({ name: z.string().trim().min(2).max(160), description: z.string().trim().max(3000).optional(), price: z.coerce.number().min(0), categoryId: z.string().min(1).nullable().optional(), isActive: z.boolean(), isFeatured: z.boolean(), isAvailable: z.boolean(), stockQuantity: z.coerce.number().int().min(0).nullable().optional() });

function forbidden() { return NextResponse.json({ error: "غير مصرح." }, { status: 403 }); }

export async function GET() {
  if (!(await isCurrentUserAdmin())) return forbidden();
  const products = await prisma.product.findMany({ include: { category: true, images: { orderBy: { position: "asc" } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await isCurrentUserAdmin())) return forbidden();
  try {
    const form = await request.formData();
    const data = productSchema.parse({ name: form.get("name"), description: form.get("description") || undefined, price: form.get("price"), categoryId: form.get("categoryId") || null, isActive: form.get("isActive") === "true", isFeatured: form.get("isFeatured") === "true", isAvailable: form.get("isAvailable") === "true", stockQuantity: form.get("stockQuantity") === "" ? null : form.get("stockQuantity") });
    const product = await prisma.product.create({ data });
    const files = form.getAll("images").filter((entry): entry is File => entry instanceof File && entry.size > 0);
    if (files.length) {
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!serviceKey) throw new Error("تعذر إعداد تخزين الصور على الخادم.");
      const storage = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);
      const images = [];
      for (const [position, file] of files.entries()) {
        if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 5_000_000) throw new Error("الصورة يجب أن تكون JPG أو PNG أو WebP وأصغر من 5MB.");
        const extension = file.type.split("/")[1];
        const path = `${product.id}/${crypto.randomUUID()}.${extension}`;
        const { error } = await storage.storage.from("products").upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
        if (error) throw error;
        const { data: url } = storage.storage.from("products").getPublicUrl(path);
        images.push({ id: crypto.randomUUID(), productId: product.id, url: url.publicUrl, alt: product.name, position });
      }
      await prisma.$transaction([prisma.productImage.createMany({ data: images }), prisma.product.update({ where: { id: product.id }, data: { imageUrl: images[0]?.url } })]);
    }
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "تعذر إضافة المنتج." }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isCurrentUserAdmin())) return forbidden();
  try {
    const body = await request.json();
    const id = z.string().min(1).parse(body.id);
    const data = productSchema.partial().parse(body);
    const product = await prisma.product.update({ where: { id }, data });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "تعذر تعديل المنتج." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isCurrentUserAdmin())) return forbidden();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "معرف المنتج مطلوب." }, { status: 400 });
  await prisma.product.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ success: true });
}
