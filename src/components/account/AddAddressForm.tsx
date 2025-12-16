"use client";

import { createAddress } from "@/lib/actions/address-actions";
import { useState } from "react";
import { Save, Loader2, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { IMaskInput } from "react-imask";

export default function AddAddressForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createAddress(formData);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setIsOpen(false);
    } else {
      toast.error(result.message);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-[#667EEA] hover:text-[#667EEA] hover:bg-indigo-50/50 transition-all duration-300 group"
      >
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-white group-hover:shadow-md transition-all">
          <Plus size={24} />
        </div>
        <span className="font-bold">Yeni Adres Ekle</span>
      </button>
    );
  }

  // Ortak input stili (CSS class)
  // capitalize: Baş harfleri görsel olarak büyütür.
  const inputClass =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#667EEA] focus:ring-2 focus:ring-[#667EEA]/10 transition-all capitalize";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h3 className="font-bold text-gray-900">Yeni Adres Bilgileri</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-red-500"
        >
          <X size={20} />
        </button>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            placeholder="Adres Başlığı (Örn: Evim)"
            className={inputClass}
            required
          />
          <input
            name="firstName"
            placeholder="Ad"
            className={inputClass}
            required
          />
          <input
            name="lastName"
            placeholder="Soyad"
            className={inputClass}
            required
          />

          {/* 🟢 TELEFON MASKELEME - Kütüphane ile */}
          <IMaskInput
            mask="0 (000) 000 00 00"
            definitions={{
              "0": /[0-9]/,
            }}
            inputRef={(el) => {}}
            name="phone"
            placeholder="0 (5XX) XXX XX XX"
            className={inputClass}
            required
          />

          <input
            name="city"
            placeholder="Şehir"
            className={inputClass}
            required
          />
          <input
            name="district"
            placeholder="İlçe"
            className={inputClass}
            required
          />
        </div>

        <textarea
          name="addressLine"
          placeholder="Açık Adres (Mahalle, Sokak, Bina No...)"
          rows={3}
          className={`${inputClass} resize-none`} // resize-none ekledik
          required
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#667EEA] text-white rounded-xl font-bold hover:bg-[#5a6fd6] flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
