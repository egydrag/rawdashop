"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(formData: FormData) {
    setLoading(true);
    setError("");
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const fullName = String(formData.get("fullName"));
    const { error: authError } = await createClient().auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    setLoading(false);
    if (authError) return setError(authError.message);
    setMessage(
      "تم إنشاء الحساب! راجعي بريدك الإلكتروني لتأكيده ثم سجّلي الدخول."
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4">
      <div className="w-full">
        <div className="text-center mb-6">
          <p className="text-4xl mb-2">🌸</p>
          <h1 className="text-2xl font-bold text-stone-900">إنشاء حساب</h1>
          <p className="text-sm text-stone-500 mt-1">انضمي إلى روضة للإكسسوارات</p>
        </div>

        <form
          action={register}
          className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-100"
        >
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              الاسم
            </label>
            <input
              required
              name="fullName"
              className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition"
              placeholder="اسمك الكريم"
            />
          </div>

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
              minLength={8}
              dir="ltr"
              className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition"
              placeholder="8 أحرف على الأقل"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {message && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              ✓ {message}
            </p>
          )}

          <button
            disabled={loading || !!message}
            className="w-full rounded-xl bg-stone-900 p-3 font-bold text-white hover:bg-stone-700 transition-colors disabled:opacity-60 text-sm"
          >
            {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
          </button>

          <p className="text-center text-sm text-stone-500">
            لديك حساب؟{" "}
            <Link href="/login" className="font-bold text-rose-600 hover:text-rose-700">
              دخول
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
