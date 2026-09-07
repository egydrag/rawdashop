import { isCurrentUserAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  if (!(await isCurrentUserAdmin()))
    return NextResponse.json({ error: "غير مصرح." }, { status: 403 });
  try {
    const { name, description } = z
      .object({
        name: z.string().trim().min(2).max(80),
        description: z.string().trim().max(500).optional(),
      })
      .parse(await request.json());
    return NextResponse.json(
      await prisma.category.create({ data: { name, description } }),
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "تعذر إضافة التصنيف." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isCurrentUserAdmin()))
    return NextResponse.json({ error: "غير مصرح." }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "معرف التصنيف مطلوب." }, { status: 400 });
  try {
    // تحقق أن التصنيف لا يحتوي منتجات نشطة
    const count = await prisma.product.count({ where: { categoryId: id, isActive: true } });
    if (count > 0)
      return NextResponse.json(
        { error: "لا يمكن حذف التصنيف لأنه يحتوي على منتجات نشطة." },
        { status: 409 }
      );
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "تعذر حذف التصنيف." }, { status: 400 });
  }
}
