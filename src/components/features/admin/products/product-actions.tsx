"use client";

import { deleteProduct, toggleProductArchive } from "@/lib/actions/product";
import { Eye, EyeOff, Trash2, Pencil, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface Props {
  productId: string;
  isArchived: boolean;
}

export default function ProductActions({ productId, isArchived }: Props) {
  const [isPending, startTransition] = useTransition();

  // ARŞİVLE / ÇIKAR
  const handleArchive = () => {
    startTransition(async () => {
      const result = await toggleProductArchive(productId, isArchived);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  };

  // SİL
  const handleDelete = () => {
    if (
      !confirm(
        "Bu ürünü tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz!"
      )
    )
      return;

    startTransition(async () => {
      const result = await deleteProduct(productId);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Düzenle Butonu */}
      <Link
        href={`/admin/products/${productId}/edit`}
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
