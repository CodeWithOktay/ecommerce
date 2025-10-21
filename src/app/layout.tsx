import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { PageLayout } from '@/components/layout/PageLayout';
import AuthProvider from '@/components/shared/AuthProvider';
import { BackToTopButton } from '@/components/shared/BackToTopButton';
import { CartProvider } from '@/context/cart';
import { authOptions } from '@/lib/auth/options';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Geist } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "İpek Yolu'nun Dijital Hali",
  description: "İpek Yolu'nun Dijital Hali",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="tr">
      <body id="top" className={`${geist.variable}`}>
        <AuthProvider session={session}>
          <CartProvider>
            <Header />
            <PageLayout>{children}</PageLayout>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                success: {
                  style: {
                    background: '#f0fdf4',
                    color: '#166534',
                    border: '1px solid #bbf7d0',
                  },
                },
                error: {
                  style: {
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                  },
                },
              }}
            />
            <BackToTopButton />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
