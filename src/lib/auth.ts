
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function currentUser() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("admin")?.value;

  if (
    !adminCookie ||
    !process.env.ADMIN_SECRET ||
    adminCookie !== process.env.ADMIN_SECRET
  ) {
    return null;
  }

  return {
    id: "admin",
  };
}

export async function isCurrentUserAdmin() {
  const user = await currentUser();
  return user !== null;
}

export async function requireAdminPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return user;
}
