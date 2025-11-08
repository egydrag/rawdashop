"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

export default function UploadForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "تنبيه",
        text: "اختر صورة قبل الرفع 📷",
        confirmButtonColor: "#d33",
        confirmButtonText: "حسناً",
      });
      return;
    }

    setLoading(true);

    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ 😔",
        text: error.message,
        confirmButtonColor: "#d33",
      });
      setLoading(false);
      return;
    }

    const publicUrl = supabase.storage.from("products").getPublicUrl(fileName)
      .data.publicUrl;

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: parseFloat(price),
        imageUrl: publicUrl,
        description, // ← أضفنا الوصف هنا
      }),
    });

    Swal.fire({
      icon: "success",
      title: "تم الرفع بنجاح 🎉",
      text: "تم إضافة المنتج إلى المتجر!",
      confirmButtonColor: "#16a34a",
      confirmButtonText: "رائع!",
    });

    setLoading(false);
    setName("");
    setPrice("");
    setFile(null);
  };

  return (
    <form
      onSubmit={handleUpload}
      className="flex flex-col gap-3 max-w-md mx-auto bg-white p-5 rounded-xl shadow"
    >
      <h2 className="text-xl font-bold">رفع منتج جديد</h2>

      <input
        type="text"
        placeholder="اسم المنتج"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="number"
        placeholder="السعر"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2 rounded"
      />

      <textarea
        placeholder="وصف المنتج"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded"
      />

      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-700">صورة المنتج</label>
        <label className="bg-pink-600 transition-all duration-700 hover:bg-pink-700 text-white py-2 px-4 rounded cursor-pointer text-center w-fit">
          {file ? "✅ تم اختيار الصورة" : "📷 اختر صورة"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        {file && (
          <p className="text-sm text-gray-500">الملف المختار: {file.name}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-pink-600 cursor-pointer transition-all duration-700 text-white py-2 rounded hover:bg-pink-700"
      >
        {loading ? "جارٍ الرفع..." : "رفع المنتج"}
      </button>
    </form>
  );
}
