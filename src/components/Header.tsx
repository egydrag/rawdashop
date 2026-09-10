import Link from "next/link";
import { currentUser, isCurrentUserAdmin } from "@/lib/auth";
import { signOut } from "@/auth";

async function logout() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export async function Header() {
  const user = await currentUser();
  const isAdmin = user ? await isCurrentUserAdmin() : false;

  return (
    <header className="bg-white border-b border-stone-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* الشعار */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🌸</span>
          <span className="font-bold text-stone-900 text-base leading-tight hidden sm:block">
            روضة
          </span>
        </Link>

        {/* روابط التنقل */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <Link
                  href="/dashboard"
                  className="text-sm font-bold bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700 transition-colors"
                >
                  لوحة التحكم
                </Link>
              )}
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  خروج
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
              >
                دخول
              </Link>
              <Link
                href="/register"
                className="text-sm font-bold bg-stone-900 text-white px-3 py-1.5 rounded-lg hover:bg-stone-700 transition-colors"
              >
                حساب جديد
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
