"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Package,
  CheckCircle2,
  Archive,
  EyeOff,
  AlertTriangle,
  XCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import ProductActions from "./product-actions";

export const dynamic = "force-dynamic";

interface ProductRow {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  isArchived: boolean;
  categoryName: string;
  brandName: string;
  image: string;
}

interface Props {
  products: ProductRow[];
  currentSort: string;
}

/**
 * Ürün Veri Tablosu
 * 
 * Yönetim panelinde ürünleri listeleyen ana tablo.
 * Özellikler:
 * - Client-side sıralama (Sort)
 * - Stok durumu gösterimi (Kritik stok uyarısı)
 * - Statü rozetleri (Yayında, Pasif, Arşiv)
 * - Görsel önizleme
 */
export default function ProductDataTable({ products, currentSort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sort Helper
  const handleSort = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Toggle Logic: DESC -> ASC -> OFF (Default)
    if (currentSort === `${key}_desc`) {
        // Was DESC, switch to ASC
        params.set("sort", `${key}_asc`);
    } else if (currentSort === `${key}_asc`) {
        // Was ASC, switch to OFF (Remove sort param)
        params.delete("sort");
    } else {
        // No sort or different key, start with DESC
        params.set("sort", `${key}_desc`);
    }

    router.push(`/admin/products?${params.toString()}`);
  };

  const getSortIcon = (key: string) => {
    if (currentSort === `${key}_asc`) return <ArrowUp size={14} className="text-indigo-600" />;
    if (currentSort === `${key}_desc`) return <ArrowDown size={14} className="text-indigo-600" />;
    return <ArrowUpDown size={14} className="text-gray-300 group-hover:text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      {/* --- TABLO --- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] overflow-hidden ring-1 ring-gray-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100/80 text-[11px] uppercase tracking-widest text-gray-500 font-bold backdrop-blur-sm">
                <th className="px-6 py-5 font-semibold text-gray-400 pl-8 cursor-pointer group select-none hover:bg-gray-100/50 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">
                    Ürün
                    {getSortIcon('name')}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-400">Kategori / Marka</th>
                <th className="px-6 py-5 font-semibold text-gray-400 cursor-pointer group select-none hover:bg-gray-100/50 transition-colors" onClick={() => handleSort('price')}>
                  <div className="flex items-center gap-2">
                    Fiyat
                    {getSortIcon('price')}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-400 cursor-pointer group select-none hover:bg-gray-100/50 transition-colors" onClick={() => handleSort('stock')}>
                   <div className="flex items-center gap-2">
                    Stok Durumu
                    {getSortIcon('stock')}
                   </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-400">Statü</th>
                <th className="px-6 py-5 text-right font-semibold text-gray-400 pr-8">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/80">
              {products.map((product, index) => {
                const isOutOfStock = product.stock === 0;
                const isCriticalStock = product.stock <= 5 && !isOutOfStock;

                return (
                  <tr
                    key={product.id}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'forwards'
                    }}
                    className={`
                      group transition-all duration-300 hover:bg-indigo-50/30
                      opacity-0 translate-y-2 animate-[fadeIn_0.5s_ease-out_forwards]
                      ${isOutOfStock ? "bg-red-50/10" : ""}
                    `}
                  >
                    {/* 1. Görsel & İsim */}
                    <td className="px-6 py-5 pl-8">
                      <div className="flex items-center gap-5">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 bg-white shrink-0 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] group-hover:shadow-md transition-shadow">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${isOutOfStock ? "grayscale opacity-70" : ""}`}
                            sizes="64px"
                          />
                        </div>
                        <div className="max-w-[240px] flex flex-col gap-1">
                          <Link
                            href={`/products/${product.id}`}
                            className="block group/link"
                          >
                            <p
                              className={`font-bold text-[15px] truncate transition-colors duration-200 ${isOutOfStock ? 'text-gray-500 line-through decoration-red-300' : 'text-gray-900 group-hover/link:text-indigo-600'}`}
                              title={product.name}
                            >
                              {product.name}
                            </p>
                          </Link>
                          <p className="text-[10px] text-gray-400 font-mono tracking-wide uppercase">
                            #{product.id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Kategori */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-900/80 transition-colors">
                          {product.categoryName}
                        </span>
                        <span className="text-[11px] font-medium text-gray-400 bg-gray-100/50 px-2 py-0.5 rounded-full w-fit">
                          {product.brandName}
                        </span>
                      </div>
                    </td>

                    {/* 3. Fiyat */}
                    <td className="px-6 py-5">
                      <span className="font-bold text-gray-900 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm group-hover:border-indigo-100 group-hover:shadow-indigo-100/50 transition-all font-mono text-sm tracking-tight text-nowrap">
                      {product.price.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}
                      <span className="text-gray-400 ml-1 text-[10px]">TL</span>
                      </span>
                    </td>

                    {/* 4. Stok */}
                    <td className="px-6 py-5">
                       {/* Stok bitmişse özel görünüm */}
                       {isOutOfStock ? (
                          <div className="flex items-center gap-2 text-red-600 bg-red-50/50 px-3 py-1.5 rounded-lg w-fit border border-red-100/60">
                            <XCircle size={14} strokeWidth={2.5} />
                            <span className="text-xs font-bold">Stok Tükendi</span>
                          </div>
                       ) : (
                          <div className={`flex items-center gap-3 px-3 py-1.5 rounded-lg w-fit transition-colors ${isCriticalStock ? 'bg-amber-50 border border-amber-100' : ''}`}>
                            <div className="relative flex items-center justify-center">
                              {isCriticalStock && <div className="absolute w-full h-full bg-red-400/20 rounded-full animate-ping" />}
                              <div
                                className={`w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm transition-colors duration-300 ${
                                  isCriticalStock ? "bg-red-500" : "bg-emerald-500"
                                }`}
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className={`text-sm font-bold ${
                                isCriticalStock ? "text-red-700" : "text-gray-700" 
                              }`}>
                                {product.stock} <span className="text-[10px] font-normal opacity-70">Adet</span>
                              </span>
                              {isCriticalStock && (
                                <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider leading-none">Kritik Stok</span>
                              )}
                            </div>
                          </div>
                       )}
                    </td>

                    {/* 5. Statü */}
                    <td className="px-6 py-5">
                      {product.isArchived ? (
                        <Badge variant="gray" icon={<Archive size={12} strokeWidth={2.5} />}>
                          Arşiv
                        </Badge>
                      ) : product.isActive ? (
                        <Badge variant="blue" icon={<CheckCircle2 size={12} strokeWidth={2.5} />}>
                          Yayında
                        </Badge>
                      ) : (
                        <Badge variant="red" icon={<EyeOff size={12} strokeWidth={2.5} />}>
                          Pasif
                        </Badge>
                      )}
                    </td>

                    {/* 6. İşlemler */}
                    <td className="px-6 py-5 text-right pr-8">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <ProductActions
                          id={product.id}
                          isArchived={product.isArchived}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Boş Durum */}
          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4 shadow-inner">
                  <Package size={40} className="text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-bold text-xl mb-1 mt-2">Ürün Bulunamadı</h3>
              <p className="text-gray-500 text-sm max-w-[280px] leading-relaxed">
                Bu kriterlere uygun kayıt bulunmuyor. Yeni bir ürün ekleyerek başlayabilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-gray-400 px-4 font-bold uppercase tracking-widest opacity-60">
        <span>Gösterilen: {products.length} Kayıt</span>
        <span>Kervan Yönetim Paneli</span>
      </div>
    </div>
  );
}

// --- YARDIMCI BİLEŞENLER ---

function Badge({
  children,
  variant,
  icon,
}: {
  children: React.ReactNode;
  variant: "blue" | "red" | "gray";
  icon: React.ReactNode;
}) {
  const styles = {
    // Premium Blue/Indigo Theme for Active
    blue: "bg-indigo-50 text-indigo-700 border-indigo-200/60 shadow-indigo-100/50",
    // Soft Red for Inactive/Critical
    red: "bg-rose-50 text-rose-700 border-rose-200/60 shadow-rose-100/50",
    // Neutral Gray
    gray: "bg-gray-100/80 text-gray-600 border-gray-200 shadow-gray-200/50",
  };
  
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border shadow-sm transition-transform hover:scale-105 select-none
        ${styles[variant]}
      `}
    >
      {icon}
      {children}
    </span>
  );
}
