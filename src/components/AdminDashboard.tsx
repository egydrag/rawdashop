"use client";

import Image from "next/image";
import { useState } from "react";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  stockQuantity: number | null;
  imageUrl: string | null;
};
type Settings = { storeName: string; whatsappNumber: string };
type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  status: string;
  createdAt: string;
  items: { productName: string; quantity: number }[];
};

export function AdminDashboard({
  initialProducts,
  initialCategories,
  initialSettings,
  orders,
}: {
  initialProducts: Product[];
  initialCategories: Category[];
  initialSettings: Settings;
  orders: Order[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "settings">("products");

  const notify = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // إضافة منتج
  async function addProduct(form: FormData) {
    const response = await fetch("/api/admin/products", { method: "POST", body: form });
    const result = await response.json();
    if (!response.ok) return notify(result.error || "تعذر إضافة المنتج.", "error");
    setProducts((current) => [result, ...current]);
    notify("تمت إضافة المنتج بنجاح ✓");
  }

  // تعديل منتج
  async function updateProduct(product: Product, patch: Partial<Product>) {
    const response = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, ...patch }),
    });
    const result = await response.json();
    if (!response.ok) return notify(result.error || "تعذر حفظ التعديل.", "error");
    setProducts((current) =>
      current.map((item) => (item.id === product.id ? { ...item, ...result } : item))
    );
    notify("تم حفظ التعديل ✓");
  }

  // إخفاء منتج (soft delete)
  async function hideProduct(product: Product) {
    const response = await fetch(`/api/admin/products?id=${product.id}`, { method: "DELETE" });
    if (!response.ok) return notify("تعذر إخفاء المنتج.", "error");
    setProducts((current) =>
      current.map((item) => (item.id === product.id ? { ...item, isActive: false } : item))
    );
    notify("تم إخفاء المنتج من المتجر.");
  }

  // استعادة منتج مخفي
  async function restoreProduct(product: Product) {
    const response = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, isActive: true }),
    });
    if (!response.ok) return notify("تعذر استعادة المنتج.", "error");
    setProducts((current) =>
      current.map((item) => (item.id === product.id ? { ...item, isActive: true } : item))
    );
    notify("تم إظهار المنتج في المتجر ✓");
  }

  // رفع صورة
  async function addImage(product: Product, image: File) {
    const form = new FormData();
    form.set("productId", product.id);
    form.set("image", image);
    const response = await fetch("/api/admin/products/images", { method: "POST", body: form });
    const result = await response.json();
    if (!response.ok) return notify(result.error || "تعذر رفع الصورة.", "error");
    setProducts((current) =>
      current.map((item) =>
        item.id === product.id ? { ...item, imageUrl: result.imageUrl } : item
      )
    );
    notify("تمت إضافة الصورة ✓");
  }

  // إضافة تصنيف
  async function addCategory(form: FormData) {
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.get("categoryName") }),
    });
    const result = await response.json();
    if (!response.ok) return notify(result.error || "تعذر إضافة التصنيف.", "error");
    setCategories((current) => [...current, result]);
    notify("تمت إضافة التصنيف ✓");
  }

  // حذف تصنيف
  async function deleteCategory(id: string) {
    const response = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    if (!response.ok) return notify("تعذر حذف التصنيف. تأكدي أنه لا يحتوي على منتجات.", "error");
    setCategories((current) => current.filter((c) => c.id !== id));
    notify("تم حذف التصنيف ✓");
  }

  // حفظ الإعدادات
  async function saveSettings(form: FormData) {
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeName: form.get("storeName"),
        whatsappNumber: form.get("whatsappNumber"),
      }),
    });
    const result = await response.json();
    if (!response.ok) return notify(result.error || "تعذر حفظ الإعدادات.", "error");
    setSettings(result);
    notify("تم حفظ الإعدادات ✓");
  }

  const activeProducts = products.filter((p) => p.isActive);
  const hiddenProducts = products.filter((p) => !p.isActive);

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      {/* الرأس */}
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">لوحة التحكم</h1>
          <p className="text-sm text-stone-500 mt-0.5">إدارة متجر {settings.storeName}</p>
        </div>
        <a
          href="/"
          className="text-sm text-stone-600 hover:text-stone-900 border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors"
        >
          ← عرض المتجر
        </a>
      </header>

      {/* إشعار */}
      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-bold border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* إحصائيات */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-stone-100 text-center shadow-sm">
          <p className="text-2xl font-bold text-stone-900">{activeProducts.length}</p>
          <p className="text-xs text-stone-500 mt-1">منتج نشط</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-100 text-center shadow-sm">
          <p className="text-2xl font-bold text-stone-900">{orders.length}</p>
          <p className="text-xs text-stone-500 mt-1">طلب مسجل</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-100 text-center shadow-sm">
          <p className="text-2xl font-bold text-stone-900">{categories.length}</p>
          <p className="text-xs text-stone-500 mt-1">تصنيف</p>
        </div>
      </div>

      {/* تبويبات */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
        {(["products", "orders", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
              activeTab === tab
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {tab === "products" ? "المنتجات" : tab === "orders" ? "الطلبات" : "الإعدادات"}
          </button>
        ))}
      </div>

      {/* ===== تبويب المنتجات ===== */}
      {activeTab === "products" && (
        <div className="space-y-5">
          {/* إضافة منتج */}
          <section className="rounded-2xl bg-white p-5 shadow-sm border border-stone-100">
            <h2 className="text-base font-bold mb-4 text-stone-900">إضافة منتج جديد</h2>
            <form action={addProduct} className="grid gap-3 sm:grid-cols-2">
              <input
                required
                name="name"
                className="rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition sm:col-span-2"
                placeholder="اسم المنتج *"
              />
              <input
                required
                name="price"
                type="number"
                min="0"
                step="0.01"
                className="rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
                placeholder="السعر بالجنيه *"
              />
              <input
                name="stockQuantity"
                type="number"
                min="0"
                className="rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
                placeholder="الكمية (اختياري)"
              />
              <textarea
                name="description"
                rows={2}
                className="rounded-xl border border-stone-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-300 transition sm:col-span-2"
                placeholder="وصف المنتج (اختياري)"
              />
              <select
                name="categoryId"
                className="rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
              >
                <option value="">بدون تصنيف</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-4 p-3 border border-stone-200 rounded-xl">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input name="isFeatured" type="checkbox" value="true" className="w-4 h-4" />
                  <span>منتج مميز</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    name="isAvailable"
                    type="checkbox"
                    value="true"
                    defaultChecked
                    className="w-4 h-4"
                  />
                  <span>متاح</span>
                </label>
              </div>
              <input type="hidden" name="isActive" value="true" />
              <div className="sm:col-span-2">
                <label className="block text-xs text-stone-500 mb-1">
                  صور المنتج (JPG, PNG, WebP — يرجى ضغط الصور لتكون أقل من 2MB)
                </label>
                <input
                  name="images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.some(file => file.size > 2 * 1024 * 1024)) {
                      alert("⚠️ إحدى الصور حجمها كبير جداً!\n\nيرجى ضغط الصورة (باستخدام موقع مثل tinypng.com) بحيث لا يتجاوز حجمها 2 ميجابايت لتسريع متجرك.");
                      e.target.value = ""; // إفراغ الحقل
                    }
                  }}
                  className="w-full rounded-xl border border-stone-200 p-3 text-sm file:me-3 file:rounded-lg file:border-0 file:bg-rose-50 file:px-3 file:py-1 file:text-xs file:font-bold file:text-rose-700"
                />
              </div>
              <button className="sm:col-span-2 rounded-xl bg-rose-600 p-3 font-bold text-white hover:bg-rose-700 transition-colors text-sm">
                + إضافة المنتج
              </button>
            </form>
          </section>

          {/* قائمة المنتجات النشطة */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-stone-900">
              المنتجات ({activeProducts.length})
            </h2>
            {activeProducts.map((product) => (
              <ProductEditor
                key={product.id}
                product={product}
                categories={categories}
                onSave={updateProduct}
                onHide={hideProduct}
                onAddImage={addImage}
              />
            ))}
            {activeProducts.length === 0 && (
              <p className="text-center text-stone-400 bg-white rounded-2xl p-8 border border-stone-100">
                لا توجد منتجات نشطة بعد. أضيفي أول منتج!
              </p>
            )}
          </section>

          {/* المنتجات المخفية */}
          {hiddenProducts.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-base font-bold text-stone-500">
                المنتجات المخفية ({hiddenProducts.length})
              </h2>
              {hiddenProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 border border-stone-100 opacity-60 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {product.imageUrl && (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-sm text-stone-700">{product.name}</p>
                      <p className="text-xs text-stone-400">{product.price} ج.م</p>
                    </div>
                  </div>
                  <button
                    onClick={() => restoreProduct(product)}
                    className="text-xs font-bold text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors shrink-0"
                  >
                    استعادة
                  </button>
                </div>
              ))}
            </section>
          )}

          {/* التصنيفات */}
          <section className="rounded-2xl bg-white p-5 shadow-sm border border-stone-100">
            <h2 className="text-base font-bold mb-4 text-stone-900">التصنيفات</h2>
            <form action={addCategory} className="flex gap-2 mb-4">
              <input
                required
                name="categoryName"
                className="min-w-0 flex-1 rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
                placeholder="اسم التصنيف الجديد"
              />
              <button className="rounded-xl bg-stone-900 px-4 text-white text-sm font-bold hover:bg-stone-700 transition-colors">
                إضافة
              </button>
            </form>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-full px-3 py-1"
                >
                  <span className="text-sm text-stone-700">{cat.name}</span>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors text-xs font-bold"
                    title="حذف التصنيف"
                  >
                    ×
                  </button>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-stone-400">لا توجد تصنيفات بعد.</p>
              )}
            </div>
          </section>
        </div>
      )}

      {/* ===== تبويب الطلبات ===== */}
      {activeTab === "orders" && (
        <section className="space-y-3">
          <h2 className="text-base font-bold text-stone-900">
            طلبات WhatsApp ({orders.length})
          </h2>
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-white p-4 border border-stone-100 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-bold text-stone-900">{order.customerName}</p>
                  <p className="text-sm text-stone-500">{order.customerPhone}</p>
                </div>
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full font-bold">
                  {order.status === "PENDING_WHATSAPP" ? "في انتظار WhatsApp" : order.status}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-stone-100">
                <p className="text-sm text-stone-700">
                  {order.items.map((item) => `${item.productName} × ${item.quantity}`).join("، ")}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  {new Date(order.createdAt).toLocaleString("ar-EG")}
                </p>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-center text-stone-400 bg-white rounded-2xl p-8 border border-stone-100">
              لا توجد طلبات مسجلة بعد.
            </p>
          )}
        </section>
      )}

      {/* ===== تبويب الإعدادات ===== */}
      {activeTab === "settings" && (
        <section className="rounded-2xl bg-white p-5 shadow-sm border border-stone-100">
          <h2 className="text-base font-bold mb-1 text-stone-900">إعدادات المتجر</h2>
          <p className="text-xs text-stone-500 mb-4">
            رقم WhatsApp سيُستخدم في جميع طلبات المتجر.
          </p>
          <form action={saveSettings} className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">اسم المتجر</label>
              <input
                name="storeName"
                defaultValue={settings.storeName}
                className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
                placeholder="اسم المتجر"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">
                رقم WhatsApp
              </label>
              <input
                name="whatsappNumber"
                defaultValue={settings.whatsappNumber}
                className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
                placeholder="مثال: 201012345678"
                inputMode="tel"
                dir="ltr"
              />
              <p className="text-xs text-stone-400 mt-1">
                اكتبي الرقم مع رمز الدولة بدون علامة + (مثال: 201012345678)
              </p>
            </div>
            <button className="w-full rounded-xl bg-stone-900 p-3 font-bold text-white hover:bg-stone-700 transition-colors text-sm">
              حفظ الإعدادات
            </button>
          </form>
        </section>
      )}
    </div>
  );
}

// ===== مكون تعديل المنتج =====
function ProductEditor({
  product,
  categories,
  onSave,
  onHide,
  onAddImage,
}: {
  product: Product;
  categories: Category[];
  onSave: (product: Product, patch: Partial<Product>) => Promise<void>;
  onHide: (product: Product) => Promise<void>;
  onAddImage: (product: Product, image: File) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(String(product.price));

  return (
    <article className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden">
      {/* رأس البطاقة */}
      <div className="flex items-center gap-3 p-4">
        {/* صورة مصغرة */}
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-rose-50 shrink-0">
          <Image
            src={product.imageUrl || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        {/* المعلومات */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-stone-900 text-sm truncate">{product.name}</h3>
          <p className="text-rose-600 font-bold text-sm">{product.price} ج.م</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                product.isAvailable
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-stone-100 text-stone-500"
              }`}
            >
              {product.isAvailable ? "متاح" : "غير متاح"}
            </span>
            {product.isFeatured && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold">
                ⭐ مميز
              </span>
            )}
          </div>
        </div>
        {/* زر التعديل */}
        <button
          onClick={() => setEditing(!editing)}
          className={`text-xs font-bold px-3 py-2 rounded-lg border transition-colors shrink-0 ${
            editing
              ? "bg-stone-100 border-stone-200 text-stone-700"
              : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
          }`}
        >
          {editing ? "إغلاق" : "تعديل"}
        </button>
      </div>

      {/* نموذج التعديل */}
      {editing && (
        <div className="border-t border-stone-100 p-4 bg-stone-50 space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-stone-200 bg-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
              placeholder="اسم المنتج"
            />
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="rounded-xl border border-stone-200 bg-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
              placeholder="السعر"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="rounded-xl border border-stone-200 bg-white p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-300 transition sm:col-span-2"
              placeholder="الوصف"
            />
            <select
              value={product.categoryId || ""}
              onChange={(e) => onSave(product, { categoryId: e.target.value || null })}
              className="rounded-xl border border-stone-200 bg-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
            >
              <option value="">بدون تصنيف</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-4 bg-white rounded-xl border border-stone-200 p-2.5">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.isFeatured}
                  onChange={(e) => onSave(product, { isFeatured: e.target.checked })}
                  className="w-4 h-4"
                />
                مميز
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.isAvailable}
                  onChange={(e) => onSave(product, { isAvailable: e.target.checked })}
                  className="w-4 h-4"
                />
                متاح
              </label>
            </div>
          </div>

          {/* رفع صورة */}
          <div>
            <label className="block text-xs text-stone-500 mb-1">تغيير الصورة (أقل من 2MB)</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 2 * 1024 * 1024) {
                    alert("⚠️ الصورة حجمها كبير جداً!\n\nيرجى ضغط الصورة (باستخدام موقع مثل tinypng.com) بحيث لا يتجاوز حجمها 2 ميجابايت لتسريع متجرك.");
                    e.target.value = ""; // إفراغ الحقل
                    return;
                  }
                  onAddImage(product, file);
                }
              }}
              className="w-full rounded-xl border border-stone-200 bg-white p-2.5 text-xs file:me-3 file:rounded-lg file:border-0 file:bg-rose-50 file:px-3 file:py-1 file:text-xs file:font-bold file:text-rose-700"
            />
          </div>

          {/* أزرار الحفظ والإخفاء */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onSave(product, { name, description, price: Number(price) })}
              className="flex-1 rounded-xl bg-stone-900 p-2.5 text-sm font-bold text-white hover:bg-stone-700 transition-colors"
            >
              حفظ التعديلات
            </button>
            <button
              onClick={() => onHide(product)}
              className="px-4 rounded-xl border border-red-200 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              إخفاء
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
