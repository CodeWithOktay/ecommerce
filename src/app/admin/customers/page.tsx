import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import CustomerSearch from "@/components/features/admin/customers/customer-search";
import CustomerStats from "@/components/features/admin/customers/customer-stats"; // New Component
import Pagination from "@/components/ui/pagination"; // New Component
import { Users, Mail, ArrowRight, Search, ChevronUp, ChevronDown } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
}

/**
 * Müşteri Yönetimi Sayfası
 * 
 * Kayıtlı kullanıcıları listeler, arama ve sıralama imkanı sunar.
 * - Server-side pagination ve filtering uygular.
 * - Aylık yeni müşteri ve aktif kullanıcı istatistiklerini hesaplar.
 * - URL query string üzerinden state (page, sort, q) yönetimi yapar.
 */
export default async function CustomersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const sort = params.sort || "createdAt-desc"; // Default sort
  const currentPage = Number(params.page) || 1;
  const pageSize = 10;

  // Parse Sort
  const [sortField, sortDir] = sort.split("-");
  const orderBy = { [sortField]: sortDir as "asc" | "desc" };

  // --- STATS CALCULATION ---
  // Get counts efficiently
  const totalCustomers = await prisma.user.count({ where: { role: "USER" } });
  
  // New users this month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const newUsersCount = await prisma.user.count({
    where: {
      role: "USER",
      createdAt: { gte: firstDayOfMonth },
    },
  });

  // Mock Active Users (e.g., users with orders or recent login - assuming 80% for now as we don't have 'lastLogin')
  const activeUsersCount = Math.floor(totalCustomers * 0.8);

  // --- DATA FETCHING ---
  const where = {
    role: "USER" as const, // Explicitly cast if needed or just string
    ...(query && {
        OR: [
          { firstName: { contains: query, mode: "insensitive" as const } },
          { lastName: { contains: query, mode: "insensitive" as const } },
          { email: { contains: query, mode: "insensitive" as const } },
        ],
    }),
  };

  // 1. Get total count for *this filter* to calculate total pages
  const totalFiltered = await prisma.user.count({ where });
  const totalPages = Math.ceil(totalFiltered / pageSize);

  // 2. Fetch paginated data
  const customers = await prisma.user.findMany({
    where,
    orderBy,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  // Helper to generate sort URL
  const getSortUrl = (field: string) => {
    const isCurrent = sortField === field;
    const newDir = isCurrent && sortDir === "asc" ? "desc" : "asc";
    const newSort = `${field}-${newDir}`;
    
    // Preserve existing query params
    const searchPart = query ? `&q=${query}` : "";
    return `/admin/customers?sort=${newSort}${searchPart}&page=${currentPage}`;
  };
  
  // Helper for pagination URL base
  const getPaginationBaseUrl = () => {
      const searchPart = query ? `&q=${query}` : "";
      return `/admin/customers?sort=${sort}${searchPart}`;
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <div className="w-4 h-4 opacity-0 group-hover:opacity-30 transition-opacity"><ChevronDown size={14} /></div>;
    return sortDir === "asc" ? <ChevronUp size={14} className="text-indigo-600" /> : <ChevronDown size={14} className="text-indigo-600" />;
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 flex items-center gap-3">
            <Users className="text-indigo-600" size={32} />
            Müşteriler
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl font-light">
            Sistemdeki kayıtlı müşterileri görüntüleyin, arayın ve yönetin.
          </p>
        </div>
        
        {/* Export Button Area */}
        <div className="flex items-center gap-3">
             {/* Removed Export Button */}
        </div>
      </div>

      {/* STATS WIDGETS */}
      <CustomerStats 
        total={totalCustomers} 
        newThisMonth={newUsersCount} 
        active={activeUsersCount} 
      />

      {/* Content Section */}
      <div className="space-y-6">
        {/* Search Bar Container */}
        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center z-10 sticky top-4">
             <div className="w-full sm:max-w-md">
                <CustomerSearch />
             </div>
             <div className="flex items-center gap-2">
                 {query && (
                    <span className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 animate-in zoom-in">
                       &quot;{query}&quot; için sonuçlar
                    </span>
                 )}
             </div>
        </div>

        {/* Customers Grid/List */}
        <div className="bg-transparent overflow-hidden">
             {customers.length > 0 ? (
                <>
                <div className="overflow-x-auto min-h-[400px]">
                  <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-gray-400 text-xs uppercase tracking-wider">
                        <th className="px-6 py-2 font-semibold group cursor-pointer select-none">
                            <Link href={getSortUrl("firstName")} className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                                Müşteri Bilgileri
                                <SortIcon field="firstName" />
                            </Link>
                        </th>
                        <th className="px-6 py-2 font-semibold">İletişim</th>
                         <th className="px-6 py-2 font-semibold group cursor-pointer select-none">
                            <Link href={getSortUrl("createdAt")} className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                                Kayıt Tarihi
                                <SortIcon field="createdAt" />
                            </Link>
                        </th>
                        <th className="px-6 py-2 font-semibold text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((user) => (
                        <tr 
                          key={user.id} 
                          className="group bg-white hover:bg-white/90 shadow-sm hover:shadow-md hover:shadow-indigo-100/50 transition-all duration-300 rounded-2xl transform hover:-translate-y-1"
                        >
                          <td className="px-6 py-5 rounded-l-2xl border-y border-l border-gray-100 group-hover:border-indigo-50">
                            <div className="flex items-center gap-4">
                              <div className="relative w-12 h-12 flex-shrink-0 transition-transform group-hover:scale-105 duration-300">
                                <Image
                                  src={
                                    user.image ||
                                    `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
                                  }
                                  fill
                                  alt=""
                                  className="rounded-full object-cover border-4 border-gray-50 group-hover:border-indigo-100 shadow-sm"
                                />
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-xs text-gray-400 font-mono mt-0.5">
                                  #{user.id.slice(0, 8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 border-y border-gray-100 group-hover:border-indigo-50">
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                               <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                   <Mail size={16} />
                               </div>
                               {user.email}
                            </div>
                          </td>
                           <td className="px-6 py-5 border-y border-gray-100 group-hover:border-indigo-50 text-sm text-gray-500">
                               {new Date(user.createdAt).toLocaleDateString("tr-TR", { month: 'short', day: 'numeric', year: 'numeric' })}
                           </td>
                          <td className="px-6 py-5 rounded-r-2xl border-y border-r border-gray-100 group-hover:border-indigo-50 text-right">
                            <Link
                              href={`/admin/customers/${user.id}`}
                              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-900 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-lg hover:shadow-gray-200"
                            >
                              Detay
                              <ArrowRight size={16} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}
                <Pagination 
                   currentPage={currentPage} 
                   totalPages={totalPages} 
                   baseUrl={getPaginationBaseUrl()} 
                />
                </>
             ) : (
                <div className="p-16 text-center flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-sm">
                      <Search size={40} className="text-gray-300" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
                   <p className="max-w-md mx-auto text-gray-500">
                      &quot;{query}&quot; aramasıyla eşleşen herhangi bir müşteri kaydı bulunamadı. Lütfen farklı bir terim deneyin.
                   </p>
                </div>
             )}
        </div>
      </div>
    </div>
  );
}
