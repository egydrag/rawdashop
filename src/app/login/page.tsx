"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCredentialsLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("بيانات الدخول غير صحيحة.");
      return;
    }

    router.replace(next.startsWith("/") ? next : "/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4">
      <div className="w-full">
        <div className="text-center mb-6">
          <p className="text-4xl mb-2">🌸</p>
          <h1 className="text-2xl font-bold text-stone-900">تسجيل الدخول</h1>
          <p className="text-sm text-stone-500 mt-1">مرحبًا بعودتك لمتجر روضة</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                required
                name="email"
                type="email"
                dir="ltr"
                className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">
                كلمة المرور
              </label>
              <input
                required
                name="password"
                type="password"
                dir="ltr"
                className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="cursor-pointer w-full rounded-xl bg-stone-900 p-3 font-bold text-white hover:bg-stone-700 transition-colors disabled:opacity-60 text-sm"
            >
              {loading ? "جارٍ الدخول..." : "دخول"}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-stone-400 font-medium">
                أو الدخول باستخدام
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: next })}
              className="cursor-pointer flex items-center justify-center gap-2 border border-stone-200 rounded-xl p-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl: next })}
              className="cursor-pointer flex items-center justify-center gap-2 border border-stone-200 rounded-xl p-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-sm text-stone-500 pt-2">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="font-bold text-rose-600 hover:text-rose-700">
              إنشاء حساب
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-stone-500">جاري التحميل...</div>}>
      <LoginForm />
    </Suspense>
  );
}
