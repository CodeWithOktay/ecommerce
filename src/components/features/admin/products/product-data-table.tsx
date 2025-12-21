"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Package,
  AlertCircle,
  CheckCircle2,
  Archive,
  EyeOff,
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
}

export default function ProductDataTable({ products }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "ARCHIVED" | "LOW_STOCK"
  >("ALL");

  // --- FİLTRELEME MANTIĞI ---
  const filteredProducts = products.filter((product) => {
    // 🛡️ Güvenli Arama (Null check)
    const term = searchTerm.toLowerCase();
    const nameMatch = (product.name || "").toLowerCase().includes(term);
    const catMatch = (product.categoryName || "").toLowerCase().includes(term);
    const brandMatch = (product.brandName || "").toLowerCase().includes(term);

    const matchesSearch = nameMatch || catMatch || brandMatch;

    // Durum Filtresi
    let matchesStatus = true;
    if (statusFilter === "ACTIVE")
      matchesStatus = product.isActive && !product.isArchived;
    if (statusFilter === "ARCHIVED") matchesStatus = product.isArchived;
    if (statusFilter === "LOW_STOCK")
      matchesStatus = product.stock < 10 && !product.isArchived;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* --- ÜST BAR --- */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        {/* Arama */}
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Ürün, kategori veya marka ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>

        {/* Filtreler */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <FilterButton
            label="Tümü"
            active={statusFilter === "ALL"}
            onClick={() => setStatusFilter("ALL")}
          />
          <FilterButton
            label="Aktif"
            active={statusFilter === "ACTIVE"}
            onClick={() => setStatusFilter("ACTIVE")}
            icon={<CheckCircle2 size={14} />}
          />
          <FilterButton
            label="Kritik"
            active={statusFilter === "LOW_STOCK"}
            onClick={() => setStatusFilter("LOW_STOCK")}
            icon={<AlertCircle size={14} />}
            isWarning
          />
          <FilterButton
            label="Arşiv"
            active={statusFilter === "ARCHIVED"}
            onClick={() => setStatusFilter("ARCHIVED")}
            icon={<Archive size={14} />}
          />
        </div>
      </div>

      {/* --- TABLO --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-6 py-4">Ürün</th>
                <th className="px-6 py-4">Kategori / Marka</th>
                <th className="px-6 py-4">Fiyat</th>
                <th className="px-6 py-4">Stok</th>
                <th className="px-6 py-4">Statü</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  {/* 1. Görsel & İsim */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="max-w-[200px]">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-semibold text-lg text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2"
                        >
                          <p
                            className="font-medium text-gray-900 truncate"
                            title={product.name}
                          >
                            {product.name}
                          </p>
                        </Link>

                        <p className="text-xs text-gray-500">
                          ID: {product.id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* 2. Kategori */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {product.categoryName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {product.brandName}
                      </span>
                    </div>
                  </td>

                  {/* 3. Fiyat */}
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {product.price.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    TL
                  </td>

                  {/* 4. Stok */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          product.stock < 10
                            ? product.stock === 0
                              ? "bg-red-500"
                              : "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                      />
                      <span className="text-sm text-gray-700">
                        {product.stock} Adet
                      </span>
                    </div>
                  </td>

                  {/* 5. Statü */}
                  <td className="px-6 py-4">
                    {product.isArchived ? (
                      <Badge variant="gray" icon={<Archive size={12} />}>
                        Arşiv
                      </Badge>
                    ) : product.isActive ? (
                      <Badge variant="green" icon={<CheckCircle2 size={12} />}>
                        Yayında
                      </Badge>
                    ) : (
                      <Badge variant="red" icon={<EyeOff size={12} />}>
                        Pasif
                      </Badge>
                    )}
                  </td>

                  {/* 6. İşlemler */}
                  <td className="px-6 py-4 text-right">
                    <ProductActions
                      id={product.id}
                      isArchived={product.isArchived}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Boş Durum */}
          {filteredProducts.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Package size={48} className="mx-auto mb-4 opacity-20" />
              <p>Aradığınız kriterlere uygun ürün bulunamadı.</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-right text-xs text-gray-400 px-2">
        Toplam {products.length} ürün
      </div>
    </div>
  );
}

// --- YARDIMCI BİLEŞENLER ---

function FilterButton({
  label,
  active,
  onClick,
  icon,
  isWarning,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  isWarning?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap
        ${
          active
            ? isWarning
              ? "bg-amber-100 border-amber-200 text-amber-800"
              : "bg-gray-900 border-gray-900 text-white"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function Badge({
  children,
  variant,
  icon,
}: {
  children: React.ReactNode;
  variant: "green" | "red" | "gray";
  icon: React.ReactNode;
}) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    red: "bg-rose-50 text-rose-700 border-rose-100",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${styles[variant]}`}
    >
      {icon}
      {children}
    </span>
  );
}
