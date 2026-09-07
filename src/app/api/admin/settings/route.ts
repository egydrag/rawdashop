import { isCurrentUserAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STORE_SETTINGS_ID } from "@/lib/store";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(request: Request) {
  if (!(await isCurrentUserAdmin())) return NextResponse.json({ error: "غير مصرح." }, { status: 403 });
  try {
    const data = z.object({ storeName: z.string().trim().min(2).max(100), whatsappNumber: z.string().trim().regex(/^[+0-9 ()-]{8,30}$/) }).parse(await request.json());
    return NextResponse.json(await prisma.storeSettings.upsert({ where: { id: STORE_SETTINGS_ID }, create: { id: STORE_SETTINGS_ID, ...data }, update: data }));
  } catch { return NextResponse.json({ error: "رقم WhatsApp أو اسم المتجر غير صالح." }, { status: 400 }); }
}
