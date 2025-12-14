"use client";

import { updateMyProfile } from "@/lib/actions/user-actions";
import { useState } from "react";
import {
  User,
  Lock,
  Save,
  Loader2,
  Phone,
  MapPin,
  Building,
  Mail,
  Navigation,
} from "lucide-react";
import toast from "react-hot-toast";

interface ProfileFormProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
  };
  address?: {
    addressLine: string;
    city: string;
    district: string;
  };
}

export default function ProfileForm({ user, address }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const result = await updateMyProfile(formData);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }
  const [phone, setPhone] = useState(user.phoneNumber || "");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");

    if (val.length > 11) val = val.slice(0, 11);

    let formatted = "";

    if (val.length > 0) {
      formatted = val.slice(0, 4);
    }
    if (val.length > 4) {
      formatted += " " + val.slice(4, 7);
    }
    if (val.length > 7) {
      formatted += " " + val.slice(7, 9);
    }
    if (val.length > 9) {
      formatted += " " + val.slice(9, 11);
    }

    setPhone(formatted);
  };

  const inputClass =
    "w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#667EEA] focus:border-transparent outline-none transition-all";
  const labelClass =
    "block text-xs font-bold text-gray-500 uppercase mb-1 ml-1";

  return (
    <form
      action={handleSubmit}
      className="space-y-8 animate-in fade-in duration-500"
    >
      {/* 1. KİŞİSEL BİLGİLER */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <User className="text-[#667EEA]" size={20} /> Kişisel Bilgiler
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClass}>Ad</label>
            <div className="relative">
              <User
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                name="firstName"
                defaultValue={user.firstName || ""}
                className={inputClass}
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Soyad</label>
            <div className="relative">
              <User
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                name="lastName"
                defaultValue={user.lastName || ""}
                className={inputClass}
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>E-posta</label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                disabled
                defaultValue={user.email || ""}
                className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Telefon</label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="tel"
                name="phoneNumber"
                value={phone}
                onChange={handlePhoneChange}
                className={inputClass}
                placeholder="05XX XXX XX XX"
                maxLength={14}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. ADRES BİLGİLERİ */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <MapPin className="text-[#667EEA]" size={20} /> Teslimat Adresi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="space-y-1">
            <label className={labelClass}>Şehir</label>
            <div className="relative">
              <Building
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                name="city"
                defaultValue={address?.city || ""}
                className={inputClass}
                placeholder="İl"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>İlçe</label>
            <div className="relative">
              <Navigation
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                name="district"
                defaultValue={address?.district || ""}
                className={inputClass}
                placeholder="İlçe"
              />
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Açık Adres</label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
            <textarea
              name="addressLine"
              defaultValue={address?.addressLine || ""}
              rows={3}
              className={`${inputClass} pl-10 resize-none`}
              placeholder="Mahalle, Sokak, Bina No..."
            />
          </div>
        </div>
      </div>

      {/* 3. ŞİFRE */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <Lock className="text-[#667EEA]" size={20} /> Şifre Değiştir
        </h3>
        <div className="space-y-1 max-w-md">
          <label className={labelClass}>Yeni Şifre</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="password"
              name="password"
              className={inputClass}
              placeholder="Değiştirmek istemiyorsanız boş bırakın"
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#667EEA]/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Güncelleniyor...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Değişiklikleri Kaydet
            </>
          )}
        </button>
      </div>
    </form>
  );
}
