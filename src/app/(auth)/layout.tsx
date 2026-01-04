// src/app/(auth)/layout.tsx
import type { ReactNode } from 'react';

/**
 * Kimlik Doğrulama Düzeni
 * 
 * Login, Register gibi sayfalar için ortak düzen.
 * Ekranı ortalayan ve arka planı ayarlayan bir wrapper görevi görür.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {children}
      </div>
    </div>
  );
}
