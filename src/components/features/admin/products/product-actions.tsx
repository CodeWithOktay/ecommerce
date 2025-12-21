"use client";

import { deleteProduct, toggleProductArchive } from "@/lib/actions/product";
import { Eye, EyeOff, Trash2, Pencil, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 🟢 1. Router'ı import ettik
import { useTransition } from "react";
import toast from "react-hot-toast";

interface Props {
  id: string;
  isArchived: boolean;
}

export default function ProductActions({ id, isArchived }: Props) {
  const router = useRouter(); // 🟢 2. Router'ı tanımladık
  const [isPending, startTransition] = useTransition();

  // ARŞİVLE / ÇIKAR
  const handleArchive = async () => {
    startTransition(async () => {
      try {
        const result = await toggleProductArchive(id, isArchived);

        if (result.success) {
          toast.success(result.message);
          router.refresh(); // 🟢 3. Listeyi anında güncelle
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Bir hata oluştu.");
      }
    });
  };

  // SİL
  const handleDelete = async () => {
    // window.confirm kullanarak tarayıcı penceresi olduğunu garantiye alalım
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        "Bu ürünü tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz!"
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteProduct(id);

        if (result.success) {
          toast.success(result.message);
          router.refresh(); // 🟢 3. Listeyi anında güncelle
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Silme işlemi sırasında hata oluştu.");
      }
    });
  };

  // Butonlara tıklandığında olası tablo satırı tıklamasını engellemek için (stopPropagation)
  const preventBubble = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="flex items-center justify-end gap-2"
      onClick={preventBubble}
    >
      {/* Düzenle Butonu */}
      <Link
        href={`/admin/products/${id}/edit`} // Eğer admin panelin /admin altındaysa burayı `/admin/products/${id}/edit` yapman gerekebilir
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
        title="Düzenle"
      >
        <Pencil size={18} />
      </Link>

      {/* Arşiv Butonu */}
      <button
        onClick={handleArchive}
        disabled={isPending}
        className={`p-2 rounded-lg transition-colors border border-transparent ${
          isArchived
            ? "text-green-600 hover:bg-green-50 hover:border-green-100"
            : "text-amber-600 hover:bg-amber-50 hover:border-amber-100"
        }`}
        title={isArchived ? "Yayına Al" : "Arşivle"}
      >
        {isPending ? (
          <Loader2 size={18} className="animate-spin" />
        ) : isArchived ? (
          <Eye size={18} />
        ) : (
          <EyeOff size={18} />
        )}
      </button>

      {/* Sil Butonu */}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
        title="Sil"
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
