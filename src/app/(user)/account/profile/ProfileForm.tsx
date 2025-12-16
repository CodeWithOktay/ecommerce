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
  Eye,
  EyeOff,
  ShieldCheck,
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
  const [phone, setPhone] = useState(user.phoneNumber || "");

  // Şifre Göster/Gizle State'leri
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    // --- İstemci Tarafı Doğrulama (Client Validation) ---
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Eğer yeni şifre alanlarından biri doluysa, şifre değiştirme işlemi yapılıyor demektir.
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        toast.error("Şifre değiştirmek için mevcut şifrenizi girmelisiniz.");
        setLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        toast.error("Yeni şifre en az 6 karakter olmalıdır.");
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Yeni şifreler birbiriyle eşleşmiyor.");
        setLoading(false);
        return;
      }
    }
    // ----------------------------------------------------

    try {
      const result = await updateMyProfile(formData);
      if (result.success) {
        toast.success(result.message);
        // Başarılı olursa şifre alanlarını temizleyebiliriz (Opsiyonel)
        // Burada form resetlemek için useRef kullanılabilir veya sayfa yenilenebilir.
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 11) val = val.slice(0, 11);
    let formatted = "";
    if (val.length > 0) formatted = val.slice(0, 4);
    if (val.length > 4) formatted += " " + val.slice(4, 7);
    if (val.length > 7) formatted += " " + val.slice(7, 9);
    if (val.length > 9) formatted += " " + val.slice(9, 11);
    setPhone(formatted);
  };

  const inputClass =
    "w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#667EEA] focus:border-transparent outline-none transition-all";
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

      {/* 3. GÜVENLİK VE ŞİFRE */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <ShieldCheck className="text-[#667EEA]" size={20} /> Güvenlik
        </h3>

        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-6">
          <p className="text-xs text-yellow-700">
            <strong>Bilgi:</strong> Şifrenizi değiştirmek istemiyorsanız
            aşağıdaki alanları <u>boş bırakın</u>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mevcut Şifre */}
          <div className="space-y-1 md:col-span-2">
            <label className={labelClass}>
              Mevcut Şifre (Değişiklik İçin Gerekli)
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type={showCurrentPass ? "text" : "password"}
                name="currentPassword"
                className={inputClass}
                placeholder="Mevcut şifreniz"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Yeni Şifre */}
          <div className="space-y-1">
            <label className={labelClass}>Yeni Şifre</label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type={showNewPass ? "text" : "password"}
                name="newPassword"
                className={inputClass}
                placeholder="En az 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Yeni Şifre Tekrar */}
          <div className="space-y-1">
            <label className={labelClass}>Yeni Şifre (Tekrar)</label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type={showNewPass ? "text" : "password"} // Aynı toggle'ı kullanabiliriz
                name="confirmPassword"
                className={inputClass}
                placeholder="Şifreyi onaylayın"
              />
            </div>
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
