import "./globals.css";
import { Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import AuthProvider from "@/components/providers/auth-provider";
import { BackToTopButton } from "@/components/ui/back-to-top";
import type { Metadata } from "next";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KervanPazar",
  description: "İpek Yolu'nun Dijital Hali",
};

/**
 * Kök Düzen (Root Layout)
 * 
 * Tüm uygulamanın ana iskeletini oluşturur.
 * - Global CSS (Tailwind) yükler.
 * - Font yapılandırması (Geist).
 * - AuthProvider ve Toast bildirimlerini sarar.
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html suppressHydrationWarning={true}>
      <body id="top" className={`${geist.variable}`} suppressHydrationWarning={true}>
        <AuthProvider session={session}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              success: {
                style: {
                  background: "#f0fdf4",
                  color: "#166534",
                  border: "1px solid #bbf7d0",
                },
              },
              error: {
                style: {
                  background: "#fef2f2",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                },
              },
            }}
          />
          <BackToTopButton />
        </AuthProvider>
      </body>
    </html>
  );
}
