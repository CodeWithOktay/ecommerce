"use client";

import { setDefaultAddress } from "@/lib/actions/address-actions";
import { CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface SetDefaultBtnProps {
  id: string;
  isDefault: boolean;
}

export default function SetDefaultBtn({ id, isDefault }: SetDefaultBtnProps) {
  const [loading, setLoading] = useState(false);

  const handleSetDefault = async () => {
    if (isDefault) return;

    setLoading(true);
    const res = await setDefaultAddress(id);
    setLoading(false);

    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  };

  if (isDefault) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
        <CheckCircle2 size={14} className="fill-green-200" />
        Varsayılan
      </div>
    );
  }

  return (
    <button
      onClick={handleSetDefault}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-[#667EEA] hover:bg-indigo-50 rounded-full text-xs font-medium transition-all group"
    >
      <Circle size={14} className="group-hover:fill-indigo-100" />
      {loading ? "İşleniyor..." : "Varsayılan Yap"}
    </button>
  );
}
