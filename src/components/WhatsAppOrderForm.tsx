"use client";

import { useState } from "react";

type Props = {
  productId: string;
  productName: string;
  available: boolean;
  maxQuantity?: number | null;
};

export function WhatsAppOrderForm({
  productId,
  productName,
  available,
  maxQuantity,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!available) {
    return (
      <div className="rounded-xl bg-stone-100 border border-stone-200 p-4 text-center">
        <p className="text-sm text-stone-600 font-bold">
          هذا المنتج غير متاح حاليًا
        </p>
        <p className="text-xs text-stone-400 mt-1">
          تواصلي معنا عبر WhatsApp للاستفسار عن موعد التوفر
        </p>
      </div>
    );
  }

  async function submit(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/orders/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          customerName: formData.get("customerName"),
          customerPhone: formData.get("customerPhone"),
          quantity: Number(formData.get("quantity")),
          notes: formData.get("notes"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "تعذر تجهيز الطلب.");
      window.location.assign(result.whatsappUrl);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "حدث خطأ غير متوقع."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 font-bold text-white text-base hover:bg-emerald-700 active:scale-[0.98] transition-all duration-150 shadow-sm"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        اطلبي عبر WhatsApp
      </button>
    );
  }

  return (
    <form
      action={submit}
      className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
    >
      <div>
        <p className="font-bold text-emerald-900 text-base">
          طلب: {productName}
        </p>
        <p className="text-xs text-stone-500 mt-0.5">
          أدخلي بياناتك وسنفتح WhatsApp لإتمام الطلب مع المتجر
        </p>
      </div>

      <div className="space-y-2">
        <input
          required
          name="customerName"
          placeholder="الاسم"
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
        />
        <input
          required
          name="customerPhone"
          inputMode="tel"
          placeholder="رقم الموبايل (مثال: 01012345678)"
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
          dir="ltr"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-stone-700 shrink-0">الكمية:</label>
          <input
            required
            name="quantity"
            type="number"
            min="1"
            max={maxQuantity ?? undefined}
            defaultValue="1"
            className="w-24 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
          />
          {maxQuantity !== null && maxQuantity !== undefined && (
            <span className="text-xs text-stone-400">(المتاح: {maxQuantity})</span>
          )}
        </div>
        <textarea
          name="notes"
          placeholder="ملاحظات إضافية (اختياري)"
          rows={2}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white text-sm hover:bg-emerald-700 transition-colors disabled:opacity-60"
        >
          {loading ? (
            "جارٍ التجهيز..."
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              متابعة إلى WhatsApp
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
