'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

// Props interface'i - bileşenin alacağı props'ları tanımlar
interface Props {
  children: ReactNode; // Provider içinde sarılacak React bileşenleri
  session?: Session | null; // Opsiyonel: NextAuth session objesi
}

/**
 * AuthProvider Bileşeni
 * 
 * NextAuth session yönetimi için context provider'ı sağlar.
 * Uygulamanın herhangi bir yerinde useSession hook'u kullanabilmek için
 * uygulamanın root'unda bu provider ile sarılması gerekir.
 * 
 * @param children - Provider içinde render edilecek child component'ler
 * @param session - Opsiyonel session objesi (server component'lerden geçilebilir)
 * 
 * @example
 * // layout.tsx içinde kullanım:
 * export default function RootLayout({
 *   children,
 * }: {
 *   children: React.ReactNode;
 * }) {
 *   return (
 *     <html lang="tr">
 *       <body>
 *         <AuthProvider>
 *           {children}
 *         </AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 */
export default function AuthProvider({ children, session }: Props) {
  /**
   * SessionProvider'ı render eder
   * - Client-side session yönetimini sağlar
   * - useSession hook'unun çalışmasını mümkün kılar
   * - Session state'ini tüm uygulamada paylaşır
   */
  return (
    <SessionProvider 
      session={session} // Session prop'unu NextAuth SessionProvider'ına geçir
    >
      {children} {/* Child component'leri render et */}
    </SessionProvider>
  );
}