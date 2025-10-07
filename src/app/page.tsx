"use client";
import { ProductCard } from "../components/ProductCard";
import { mockProducts } from "../lib/mockData";

export default function HomePage() {
  return (
    <>
      <style jsx>{`
        .modern-theme {
          --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --gradient-secondary: linear-gradient(
            135deg,
            #f093fb 0%,
            #f5576c 100%
          );
          --gradient-card: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          --dark: #1e293b;
          --light: #f8fafc;
          --text: #334155;
          --border: #e2e8f0;
          --accent: #10b981;
        }

        .gradient-border {
          background: linear-gradient(
            135deg,
            #667eea,
            #764ba2,
            #f093fb,
            #f5576c
          );
          padding: 2px;
          border-radius: 12px;
        }

        .gradient-border > div {
          background: white;
          border-radius: 10px;
        }
      `}</style>

      <main className="modern-theme bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] min-h-screen p-6 md:p-8">
        {/* Hero Section with Gradient */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white py-12 rounded-2xl mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Modern Alışveriş Deneyimi
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Teknoloji ve stilin buluştuğu nokta. En yeni ürünler burada!
            </p>
          </div>
        </div>

        {/* Products Grid with Gradient Borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {mockProducts.map((product) => (
            <div key={product.id} className="gradient-border">
              <div className="h-full">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--border)] text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[#667EEA] to-[#764BA2] rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
              🚚
            </div>
            <h3 className="font-semibold text-[var(--dark)] mb-2">
              Hızlı Teslimat
            </h3>
            <p className="text-[var(--text)] text-sm">Aynı gün kargo imkanı</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--border)] text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[#F093FB] to-[#F5576C] rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
              🔒
            </div>
            <h3 className="font-semibold text-[var(--dark)] mb-2">
              Güvenli Ödeme
            </h3>
            <p className="text-[var(--text)] text-sm">256-bit SSL güvenliği</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--border)] text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
              ⭐
            </div>
            <h3 className="font-semibold text-[var(--dark)] mb-2">
              Kalite Garantisi
            </h3>
            <p className="text-[var(--text)] text-sm">15 gün iade garantisi</p>
          </div>
        </div>
      </main>
    </>
  );
}
