"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 👈 1. Bunu ekle
import { addBrandToCategory } from "@/lib/actions/add-brand-to-category";
import { toast } from "react-hot-toast";

interface Props {
  categoryId: string;
}

export const CategoryBrandForm = ({ categoryId }: Props) => {
  const router = useRouter(); // 👈 2. Hook'u başlat
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);

    const result = await addBrandToCategory(categoryId, name);

    if (result.success) {
      toast.success(`${name} eklendi!`);
      setName("");

      // 👇 3. İŞTE SİHİRLİ SATIR BURASI! 👇
      router.refresh();
      // Bu komut sayfayı komple yenilemeden verileri günceller.
    } else {
      toast.error(result.error || "Hata oluştu.");
    }

    setIsLoading(false);
  };

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-medium mb-2">Bu Kategoriye Hızlı Marka Ekle</h3>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Marka adı..."
          className="flex-1 border p-2 rounded-md"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {isLoading ? "+" : "Ekle"}
        </button>
      </form>
    </div>
  );
};
