import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = z
      .object({
        name: z.string().trim().min(2).max(100),
        email: z.string().email().trim().toLowerCase(),
        password: z.string().min(8).max(100),
      })
      .parse(await request.json())

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل." }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 12)

    await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: "CUSTOMER",
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "البيانات المدخلة غير صحيحة." }, { status: 400 })
    }
    console.error("Register error:", error)
    return NextResponse.json({ error: "تعذر إنشاء الحساب." }, { status: 500 })
  }
}
