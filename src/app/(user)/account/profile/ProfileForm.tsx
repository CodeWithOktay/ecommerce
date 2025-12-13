'use client';

import { updateMyProfile } from "@/lib/actions/user-actions";
import { useState } from "react";
import { User, Lock, Save, Loader2 } from "lucide-react";

interface ProfileFormProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const result = await updateMyProfile(formData);

    setLoading(false);
    if (result.success) {
      setMessage({ text: result.message, type: 'success' });
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      
      {/* İsim Soyisim */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Adınız</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input 
              name="firstName" 
              defaultValue={user.firstName || ''} 
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Soyadınız</label>
          <input 
            name="lastName" 
            defaultValue={user.lastName || ''} 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
            required
          />
        </div>
      </div>

      {/* Email (Disabled) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">E-posta Adresi</label>
        <input 
          disabled 
          defaultValue={user.email || ''} 
          className="w-full p-3 border rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed" 
        />
        <p className="text-xs text-gray-500">Güvenlik nedeniyle e-posta adresi değiştirilemez.</p>
      </div>

      {/* Şifre Değiştirme */}
      <div className="pt-4 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-500" />
          Şifre Değiştir
        </h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Yeni Şifre</label>
          <input 
            type="password"
            name="password" 
            placeholder="Değiştirmek istemiyorsanız boş bırakın"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
          />
        </div>
      </div>

      {/* Mesaj Alanı */}
      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Buton */}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
        Bilgileri Güncelle
      </button>
    </form>
  );
}