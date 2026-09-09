import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function isCurrentUserAdmin() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("admin")?.value;

  return Boolean(
    adminCookie &&
      process.env.ADMIN_SECRET &&
      adminCookie === process.env.ADMIN_SECRET
  );
}

export async function requireAdminPage() {
  if (!(await isCurrentUserAdmin())) {
    redirect("/login?next=/dashboard");
  }

  return true;
}