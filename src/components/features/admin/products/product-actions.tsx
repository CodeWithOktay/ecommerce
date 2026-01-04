"use client";

import { deleteProduct, toggleProductArchive } from "@/lib/actions/product";
import { Trash2, Pencil, Loader2, RefreshCcw, Archive } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface Props {
  id: string;
  isArchived: boolean;
}

/**
 * Ürün İşlem Butonları
 * 
 * Tablo satırlarında her ürün için işlem yapmayı sağlar:
 * - Düzenle (Edit): Ürün detay sayfasına yönlendirir.
 * - Arşivle/Yayına Al: Ürün durumunu değiştirir.
 * - Sil: Ürünü kalıcı olarak siler.
 */
export default function ProductActions({ id, isArchived }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 🔄 ARŞİVLE / GERİ YÜKLE (TOGGLE)
  const handleToggleArchive = async () => {
    startTransition(async () => {
      try {
        // Server Action çağırıyoruz (isArchived durumunun tersini yapar)
        const result = await toggleProductArchive(id, isArchived);

        if (result.success) {
          toast.success(result.message);
          router.refresh();
        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error("İşlem sırasında bir hata oluştu.");
      }
    });
  };

  // 🗑️ KALICI SİL
  const handleDelete = async () => {
    // Tarayıcı kontrolü (SSR hatası almamak için)
    if (typeof window !== "undefined") {
      const confirmMessage = isArchived
        ? "Bu arşivlenmiş ürünü KALICI OLARAK silmek istiyor musunuz? Geri alınamaz!"
        : "Bu ürünü silmek istediğinize emin misiniz?";

      if (!window.confirm(confirmMessage)) return;
    }

    startTransition(async () => {
      try {
        const result = await deleteProduct(id);

        if (result.success) {
          toast.success("Ürün başarıyla silindi.");
          router.refresh();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Silme hatası:", error);
        toast.error("Silinemedi.");
      }
    });
  };

  // Tablo satırına tıklamayı engelle (Event Bubbling)
  const preventBubble = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      className="flex items-center justify-end gap-2"
      onClick={preventBubble}
    >
      {/* ✏️ DÜZENLE (Sadece arşivde değilse gösterilebilir veya her zaman kalabilir) */}
      <Link
        href={`/admin/products/${id}/edit`}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
        title="Düzenle"
      >
        <Pencil size={18} />
      </Link>

      {/* 🔄 ARŞİVLE / GERİ YÜKLE BUTONU */}
      <button
        onClick={handleToggleArchive}
        disabled={isPending}
        className={`p-2 rounded-lg transition-colors border border-transparent ${
          isArchived
            ? "text-green-600 hover:bg-green-50 hover:border-green-100" // Arşivdeyse Yeşil (Geri Yükle)
            : "text-amber-600 hover:bg-amber-50 hover:border-amber-100" // Yayındaysa Turuncu (Arşivle)
        }`}
        title={isArchived ? "Yayına Al (Geri Yükle)" : "Arşive Kaldır"}
      >
        {isPending ? (
          <Loader2 size={18} className="animate-spin" />
        ) : isArchived ? (
          <RefreshCcw size={18} /> // Geri yükleme ikonu
        ) : (
          <Archive size={18} /> // Arşivleme ikonu (veya EyeOff)
        )}
      </button>

      {/* 🗑️ SİL BUTONU */}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
        title="Kalıcı Olarak Sil"
      >
        {isPending ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Trash2 size={18} />
        )}
      </button>
    </div>
  );
}
