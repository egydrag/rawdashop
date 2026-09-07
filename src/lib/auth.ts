import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function currentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function isCurrentUserAdmin() {
  const user = await currentUser();
  if (!user) return false;
  const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } });
  return profile?.role === "admin";
}

export async function requireAdminPage() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/dashboard");
  if (!(await isCurrentUserAdmin())) redirect("/");
  return user;
}
