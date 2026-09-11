import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function currentUser() {
  const session = await auth()
  return session?.user ?? null
}

export async function isCurrentUserAdmin() {
  const session = await auth()
  return session?.user?.role === "ADMIN"
}

export async function requireAdminPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?next=/dashboard")
  }
  return session.user
}

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }
  return session.user
}
