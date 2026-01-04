import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

/**
 * Sayfalandırma Bileşeni
 * 
 * Listeleme sayfaları için navigasyon sağlar.
 * 
 * @param currentPage - Aktif sayfa numarası
 * @param totalPages - Toplam sayfa sayısı
 * @param baseUrl - Yönlendirilecek temel URL (Query string için)
 */
export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Helper to build URL
  const getUrl = (page: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${page}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Link
        href={hasPrev ? getUrl(currentPage - 1) : "#"}
        aria-disabled={!hasPrev}
        className={`p-2 rounded-lg border flex items-center justify-center transition-colors ${
          hasPrev
            ? "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
            : "bg-gray-50 border-gray-100 text-gray-300 pointer-events-none"
        }`}
      >
        <ChevronLeft size={18} />
      </Link>
      
      <div className="flex items-center gap-1 font-medium text-sm text-gray-600">
        <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg shadow-sm text-indigo-600 font-bold">
            {currentPage}
        </span>
        <span className="text-gray-400">/</span>
        <span className="px-2">{totalPages}</span>
      </div>

      <Link
        href={hasNext ? getUrl(currentPage + 1) : "#"}
        aria-disabled={!hasNext}
        className={`p-2 rounded-lg border flex items-center justify-center transition-colors ${
          hasNext
             ? "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
             : "bg-gray-50 border-gray-100 text-gray-300 pointer-events-none"
        }`}
      >
        <ChevronRight size={18} />
      </Link>
    </div>
  );
}
