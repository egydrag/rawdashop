import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <p className="text-6xl mb-4">🌸</p>
      <h1 className="text-3xl font-bold text-stone-900 mb-2">الصفحة غير موجودة</h1>
      <p className="text-stone-500 text-sm mb-6 max-w-xs">
        عذرًا، لم نتمكن من العثور على الصفحة التي تبحثين عنها.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-rose-600 px-6 py-3 font-bold text-white hover:bg-rose-700 transition-colors text-sm"
      >
        العودة للمتجر
      </Link>
    </div>
  );
}
