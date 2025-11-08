import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, price, imageUrl, description } = body;

    const product = await prisma.product.create({
      data: { name, price, imageUrl, description }, // ← أضفنا الوصف هنا
    });
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
