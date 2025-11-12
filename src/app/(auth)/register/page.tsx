// src/app/(auth)/register/page.tsx
'use client';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Lock,
  Mail,
  User as UserIcon,
} from 'lucide-react';
// Image import'una artık bu sayfada gerek yok, layout'ta kaldı.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function RegisterPage() {
  // ... (Tüm state'ler ve handleSubmit fonksiyonu aynı kalıyor)
  // Form state'leri
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Durum state'leri
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setError('');
        setIsLoading(false);

        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');

        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message || 'Bir hata oluştu!');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Ağ hatası. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  // --- RETURN KISMI SADELEŞTİ ---
  // Dıştaki wrapper'lar, logo ve footer layout'tan geldiği için
  // bu dosyadan kaldırıldı.
  return (
    <>
      {/* Sayfaya özel başlık (Logo layout'tan geliyor) */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Hesabınızı Oluşturun
        </h2>
        <p className="text-gray-600 mt-2">
          KervanPazar&apos;a katılın ve alışverişe başlayın.
        </p>
      </div>

      {/* Kayıt Kartı */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hata ve Başarı Mesajları */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
              <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...
            </div>
          )}

          {/* İsim ve Soyisim Alanları */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* İsim Alanı */}
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-gray-900"
              >
                Adınız
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                  placeholder="Adınız"
                  required
                />
              </div>
            </div>

            {/* Soyisim Alanı */}
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-semibold text-gray-900"
              >
                Soyadınız
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                  placeholder="Soyadınız"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email Alanı */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900"
            >
              E-posta Adresi
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                placeholder="examle@mail.com"
                required
              />
            </div>
          </div>

          {/* Şifre Alanı */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-900"
            >
              Şifre
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Kayıt Butonu */}
          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 group"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Kayıt Olunuyor...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>Hesap Oluştur</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </button>
        </form>

        {/* Giriş Sayfasına Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Zaten bir hesabın var mı?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
