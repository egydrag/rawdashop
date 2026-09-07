import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true, images: { orderBy: { position: "asc" } } },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(products);
}
