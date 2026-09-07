import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatEgp, getStoreSettings } from "@/lib/store";
import { NextResponse } from "next/server";
import { z } from "zod";

const orderSchema = z.object({ productId: z.string().min(1), customerName: z.string().trim().min(2).max(120), customerPhone: z.string().trim().min(7).max(30), quantity: z.number().int().min(1).max(99), notes: z.string().trim().max(1000).optional().nullable() });

export async function POST(request: Request) {
  try {
    const input = orderSchema.parse(await request.json());
    const product = await prisma.product.findFirst({ where: { id: input.productId, isActive: true, isAvailable: true }, select: { id: true, name: true, price: true, stockQuantity: true } });
    if (!product) return NextResponse.json({ error: "المنتج غير متاح حاليًا." }, { status: 404 });
    if (product.stockQuantity !== null && input.quantity > product.stockQuantity) return NextResponse.json({ error: "الكمية المطلوبة غير متاحة." }, { status: 400 });
    const settings = await getStoreSettings();
    const whatsappNumber = (settings?.whatsappNumber || process.env.WHATSAPP_NUMBER || "").replace(/\D/g, "");
    if (!whatsappNumber) return NextResponse.json({ error: "رقم WhatsApp لم يُضبط بعد." }, { status: 503 });
    const user = await currentUser();
    const order = await prisma.order.create({ data: { customerId: user?.id, customerName: input.customerName, customerPhone: input.customerPhone, notes: input.notes || null, items: { create: { productId: product.id, productName: product.name, unitPrice: product.price, quantity: input.quantity } } } });
    const productUrl = `${new URL(request.url).origin}/product/${product.id}`;
    const message = ["السلام عليكم، أريد طلب المنتج التالي:", `اسم المنتج: ${product.name}`, `السعر: ${formatEgp(product.price)}`, `الكمية: ${input.quantity}`, `رقم الطلب: ${order.id}`, `اسم العميل: ${input.customerName}`, `رقم الموبايل: ${input.customerPhone}`, `رابط المنتج: ${productUrl}`, input.notes ? `ملاحظات: ${input.notes}` : ""].filter(Boolean).join("\n");
    return NextResponse.json({ whatsappUrl: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "يرجى إدخال بيانات صحيحة." }, { status: 400 });
    console.error("WhatsApp order error", error);
    return NextResponse.json({ error: "تعذر حفظ الطلب الآن." }, { status: 500 });
  }
}
