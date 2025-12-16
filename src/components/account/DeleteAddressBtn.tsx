"use client";

import { deleteAddress } from "@/lib/actions/address-actions";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DeleteAddressBtn({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Bu adresi silmek istediğinize emin misiniz?")) return;

    setLoading(true);
    const res = await deleteAddress(id);
    setLoading(false);

    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
      title="Adresi Sil"
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  );
}
