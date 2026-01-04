"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { updateOrderStatus } from "@/lib/actions/order";
type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";
import {
  CheckSquare,
  Square,
  ArrowRight,
  Loader2,
  Package,
  Layers,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  User,
  Fingerprint,
  ExternalLink,
  MoreVertical,
  Undo2,
  Ban,
  RefreshCcw,
  CheckCircle2,
  Truck,
  Box,
  AlertTriangle,
  Info,
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: { url: string }[];
  };
}

interface Order {
  id: string;
  userId: string | null;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  address?: string | null;
  total: number;
  status: OrderStatus;
  createdAt: string;
  totalQuantity: number;
  items: OrderItem[];
}

interface OrdersClientProps {
  orders: Order[];
  counts: Record<string, number>;
  searchQuery: string;
}

// Burayı geri getirdim, arama yapınca kelimeler sarı yansın diye
const Highlight = ({ text, query }: { text: string; query: string }) => {
  if (!query || !text) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span
            key={i}
            className="bg-yellow-100 text-gray-900 font-semibold px-0.5 rounded"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

type ConfirmationType =
  | "SINGLE_CANCEL"
  | "BULK_CANCEL"
  | "BULK_UPDATE"
  | "SINGLE_UPDATE"
  | "BULK_RESTORE"
  | null;

interface ConfirmationState {
  isOpen: boolean;
  type: ConfirmationType;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  isDangerous: boolean;
  data: { id?: string; nextStatus?: OrderStatus } | null;
}

const TABS = [
  {
    id: "PENDING",
    label: "Bekleyenler",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    countColor: "bg-amber-200 text-amber-800",
  },
  {
    id: "PROCESSING",
    label: "Hazırlanıyor",
    color: "text-blue-700 bg-blue-50 border-blue-200",
    countColor: "bg-blue-200 text-blue-800",
  },
  {
    id: "SHIPPED",
    label: "Kargolandı",
    color: "text-indigo-700 bg-indigo-50 border-indigo-200",
    countColor: "bg-indigo-200 text-indigo-800",
  },
  {
    id: "DELIVERED",
    label: "Teslim Edildi",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    countColor: "bg-emerald-200 text-emerald-800",
  },
  {
    id: "CANCELLED",
    label: "İptal/İade",
    color: "text-rose-700 bg-rose-50 border-rose-200",
    countColor: "bg-rose-200 text-rose-800",
  },
];

const getStatusLabel = (status: string) => {
  const found = TABS.find((t) => t.id === status);
  return found ? found.label : status;
};

/**
 * Sipariş Yönetimi Client Bileşeni
 * 
 * Siparişlerin listelendiği, filtrelendiği ve yönetildiği ana bileşen.
 * - Tab'li yapı ile sipariş durumlarını (Bekliyor, Hazırlanıyor, Kargolandı vb.) filtreler.
 * - Seçili siparişler üzerinde toplu işlem (Durum güncelleme, İptal, Geri Yükle) yapabilir.
 * - Her siparişin detaylarını (ürünler, müşteri bilgisi) expand edilebilir satırda gösterir.
 * - Arama sonuçlarını highlight eder.
 */
export default function OrdersClient({
  orders,
  counts,
  searchQuery,
}: OrdersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("status") || "PENDING";

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    type: null,
    title: "",
    description: "",
    confirmLabel: "",
    isDangerous: false,
    data: null,
  });

  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabChange = (status: string) => {
    setSelectedIds([]);
    setExpandedIds([]);
    setActiveMenuId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    router.push(`?${params.toString()}`);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === orders.length ? [] : orders.map((o) => o.id)
    );
  };

  const toggleDetails = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  const getNextStatus = (status: OrderStatus): OrderStatus | null => {
    if (status === "PENDING") return "PROCESSING";
    if (status === "PROCESSING") return "SHIPPED";
    if (status === "SHIPPED") return "DELIVERED";
    return null;
  };

  // Burası senin istediğin "Geri Çağırınca Hazırlanıyor'a at" mantığı
  const getPrevStatus = (status: OrderStatus): OrderStatus | null => {
    if (status === "DELIVERED") return "PROCESSING";
    if (status === "SHIPPED") return "PROCESSING";
    if (status === "PROCESSING") return "PENDING";
    return null;
  };

  const getNextStatusAction = () => {
    if (currentTab === "PENDING")
      return {
        label: "Hazırlanıyor'a Aktar",
        next: "PROCESSING" as OrderStatus,
        color: "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20",
      };
    if (currentTab === "PROCESSING")
      return {
        label: "Kargolandı İşaretle",
        next: "SHIPPED" as OrderStatus,
        color:
          "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20",
      };
    if (currentTab === "SHIPPED")
      return {
        label: "Teslim Edildi Yap",
        next: "DELIVERED" as OrderStatus,
        color:
          "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20",
      };
    return null;
  };

  const requestSingleCancel = (id: string) => {
    setConfirmation({
      isOpen: true,
      type: "SINGLE_CANCEL",
      title: "Siparişi İptal Et?",
      description:
        "Bu işlemi onaylarsanız sipariş kalıcı olarak iptal edilecektir. Bu işlem geri alınabilir.",
      confirmLabel: "Evet, İptal Et",
      isDangerous: true,
      data: { id },
    });
    setActiveMenuId(null);
  };

  const requestBulkCancel = () => {
    setConfirmation({
      isOpen: true,
      type: "BULK_CANCEL",
      title: "Toplu İptal Onayı",
      description: `Seçilen ${selectedIds.length} adet siparişi iptal etmek istediğinize emin misiniz?`,
      confirmLabel: "Hepsini İptal Et",
      isDangerous: true,
      data: null,
    });
  };

  const requestBulkRestore = () => {
    setConfirmation({
      isOpen: true,
      type: "BULK_RESTORE",
      title: "Sisteme Geri Dahil Et",
      description: `Seçilen ${selectedIds.length} adet iptal edilmiş siparişi tekrar Bekleyen duruma getirelim mi ?`,
      confirmLabel: "Evet, Dahil Et",
      isDangerous: false,
      data: null,
    });
  };

  const requestBulkUpdate = () => {
    const action = getNextStatusAction();
    if (!action) return;
    setConfirmation({
      isOpen: true,
      type: "BULK_UPDATE",
      title: "Durum Güncellemesi",
      description: `Seçilen ${selectedIds.length} adet siparişi bir sonraki aşamaya taşıyoruz.`,
      confirmLabel: "Evet, Onayla",
      isDangerous: false,
      data: { nextStatus: action.next },
    });
  };

  const requestSingleUpdate = (id: string, newStatus: OrderStatus) => {
    const statusLabel = getStatusLabel(newStatus);
    setConfirmation({
      isOpen: true,
      type: "SINGLE_UPDATE",
      title: "Aşama Değişikliği",
      description: `Bu siparişi "${statusLabel}" durumuna getirmek istediğine emin misin?`,
      confirmLabel: "Evet, Değiştir",
      isDangerous: false,
      data: { id, nextStatus: newStatus },
    });
    setActiveMenuId(null);
  };

  const handleConfirmAction = async () => {
    if (!confirmation.type) return;
    setIsUpdating(true);
    try {
      if (confirmation.type === "SINGLE_CANCEL" && confirmation.data?.id) {
        await updateOrderStatus([confirmation.data.id], "CANCELLED");
      } else if (confirmation.type === "BULK_CANCEL") {
        await updateOrderStatus(selectedIds, "CANCELLED");
        setSelectedIds([]);
      } else if (confirmation.type === "BULK_RESTORE") {
        await updateOrderStatus(selectedIds, "PENDING");
        setSelectedIds([]);
      } else if (
        confirmation.type === "BULK_UPDATE" &&
        confirmation.data?.nextStatus
      ) {
        await updateOrderStatus(selectedIds, confirmation.data.nextStatus);
        setSelectedIds([]);
      } else if (
        confirmation.type === "SINGLE_UPDATE" &&
        confirmation.data?.id &&
        confirmation.data?.nextStatus
      ) {
        await updateOrderStatus(
          [confirmation.data.id],
          confirmation.data.nextStatus
        );
      }
      router.refresh();
      setConfirmation({ ...confirmation, isOpen: false });
    } catch (error) {
      console.error(error);
      alert("Hata oluştu! Lütfen tekrar deneyin.");
    } finally {
      setIsUpdating(false);
    }
  };

  const nextAction = getNextStatusAction();

  return (
    <>
      <div
        className={`space-y-8 pb-36 transition-all duration-300 ${confirmation.isOpen ? "blur-sm pointer-events-none" : ""}`}
      >
        <div className="sticky top-0 z-20 bg-[#F9FAFB]/90 backdrop-blur-md pt-4 border-b border-gray-200">
          <nav className="flex space-x-2 overflow-x-auto no-scrollbar px-2 pb-0">
            {TABS.map((tab) => {
              const isActive = currentTab === tab.id;
              const count = counts[tab.id] || 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`group relative pb-4 px-4 font-medium text-sm flex items-center gap-3 transition-all ${isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <span className="text-base tracking-tight">{tab.label}</span>
                  <span
                    className={`py-0.5 px-2.5 rounded-full text-xs font-bold transition-colors ${isActive ? tab.countColor : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"}`}
                  >
                    {count}
                  </span>
                  {isActive && (
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full ${tab.color.split(" ")[0].replace("text", "bg")}`}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <Layers size={14} className="text-indigo-600" />
            <span>
              Toplam{" "}
              <strong className="text-gray-900 font-bold">
                {orders.length}
              </strong>{" "}
              adet siparişiniz var.
            </span>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full p-2 pl-6 flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedIds.length} seçildi
              </span>
              <div className="h-6 w-px bg-gray-300"></div>
              {currentTab !== "CANCELLED" && currentTab !== "DELIVERED" && (
                <button
                  onClick={requestBulkCancel}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2"
                >
                  <Ban size={16} /> İptal
                </button>
              )}
              {currentTab === "CANCELLED" && (
                <button
                  onClick={requestBulkRestore}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2"
                >
                  <RefreshCcw size={16} /> Geri Yükle
                </button>
              )}
              {nextAction && (
                <button
                  onClick={requestBulkUpdate}
                  className={`${nextAction.color} text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-transform active:scale-95`}
                >
                  {isUpdating ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  {nextAction.label}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-visible">
          {orders.length === 0 ? (
            <div className="py-32 text-center">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">
                Henüz sipariş yok.
              </h3>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-5 w-14 text-center">
                    <button onClick={toggleSelectAll}>
                      {selectedIds.length === orders.length ? (
                        <CheckSquare size={20} className="text-indigo-600" />
                      ) : (
                        <Square size={20} />
                      )}
                    </button>
                  </th>
                  <th className="p-5 pl-2">Sipariş Özeti</th>
                  <th className="p-5 text-center w-32">Adet</th>
                  <th className="p-5">Müşteri</th>
                  <th className="p-5 text-right">Tutar</th>
                  <th className="p-5 text-right">Tarih</th>
                  <th className="p-5 w-14"></th>
                  <th className="p-5 w-14 text-center pr-6">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const isSelected = selectedIds.includes(order.id);
                  const isExpanded = expandedIds.includes(order.id);
                  const isMenuOpen = activeMenuId === order.id;
                  const nextStatus = getNextStatus(order.status);
                  const prevStatus = getPrevStatus(order.status);

                  return (
                    <Fragment key={order.id}>
                      <tr
                        className={`group transition-all hover:bg-gray-50 ${isSelected ? "bg-indigo-50/40" : "bg-white"}`}
                      >
                        <td className="p-5 text-center">
                          <button onClick={() => toggleSelect(order.id)}>
                            {isSelected ? (
                              <CheckSquare
                                size={20}
                                className="text-indigo-600"
                              />
                            ) : (
                              <Square size={20} />
                            )}
                          </button>
                        </td>
                        <td
                          className="p-5 pl-2 cursor-pointer"
                          onClick={(e) => toggleDetails(order.id, e)}
                        >
                          <div className="flex flex-col gap-2">
                            <span className="font-mono text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded border shadow-sm w-fit">
                              #
                              <Highlight
                                text={order.id.slice(-6).toUpperCase()}
                                query={searchQuery}
                              />
                            </span>
                            <span className="font-bold text-gray-900">
                              <Highlight
                                text={
                                  order.items[0]?.product.name ||
                                  "Silinmiş Ürün"
                                }
                                query={searchQuery}
                              />{" "}
                              {order.items.length > 1 && (
                                <span className="text-gray-400 font-normal">
                                  ...
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-sm font-bold text-gray-700">
                            {order.totalQuantity}
                          </span>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                              {order.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-gray-900">
                                <Highlight
                                  text={order.customerName}
                                  query={searchQuery}
                                />
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {order.userId ? "Kayıtlı" : "Misafir"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-right font-bold text-gray-900 tabular-nums text-base">
                          {new Intl.NumberFormat("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                          }).format(order.total)}
                        </td>
                        <td className="p-5 text-right text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md w-fit ml-auto mr-5">
                          {order.createdAt}
                        </td>
                        <td className="p-5 text-center">
                          <button
                            onClick={(e) => toggleDetails(order.id, e)}
                            className={`p-2 rounded-full transition-all ${isExpanded ? "bg-indigo-100 text-indigo-600 rotate-180" : "text-gray-400"}`}
                          >
                            <ChevronDown size={20} />
                          </button>
                        </td>
                        <td className="p-5 text-center pr-6 relative">
                          <button
                            onClick={(e) => toggleMenu(order.id, e)}
                            className={`p-2 rounded-full transition-colors ${isMenuOpen ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-100 text-gray-400"}`}
                          >
                            <MoreVertical size={20} />
                          </button>
                          {isMenuOpen && (
                            <div
                              ref={menuRef}
                              className="absolute right-10 top-10 z-50 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-in fade-in zoom-in-95 origin-top-right"
                            >
                              <div className="text-[10px] font-bold text-gray-400 p-2 uppercase tracking-widest pl-4">
                                İşlemler
                              </div>
                              {nextStatus && (
                                <button
                                  onClick={() =>
                                    requestSingleUpdate(order.id, nextStatus)
                                  }
                                  className="w-full flex items-center gap-3 p-3 text-sm font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors text-left group/btn"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover/btn:bg-indigo-100 transition-colors">
                                    {nextStatus === "SHIPPED" && (
                                      <Truck size={16} />
                                    )}
                                    {nextStatus === "DELIVERED" && (
                                      <CheckCircle2 size={16} />
                                    )}
                                    {nextStatus === "PROCESSING" && (
                                      <Box size={16} />
                                    )}
                                  </div>
                                  <span>Sonraki Aşama</span>
                                </button>
                              )}
                              {prevStatus && (
                                <button
                                  onClick={() =>
                                    requestSingleUpdate(order.id, prevStatus)
                                  }
                                  className="w-full flex items-center gap-3 p-3 text-sm font-semibold text-gray-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors text-left group/btn"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover/btn:bg-amber-100 transition-colors">
                                    <Undo2 size={16} />
                                  </div>
                                  <span>Önceki Aşama</span>
                                </button>
                              )}
                              <div className="h-px bg-gray-100 my-1 mx-2" />
                              <button
                                onClick={() => requestSingleCancel(order.id)}
                                className="w-full flex items-center gap-3 p-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                              >
                                <Ban size={16} /> Siparişi İptal Et
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-gray-50/50 shadow-inner">
                          <td colSpan={8} className="p-8 border-b">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-top-4">
                              <div className="lg:col-span-8 space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                  <Package size={14} /> Sipariş Ürünleri
                                </h4>
                                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                  {order.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex gap-6 p-5 border-b last:border-0"
                                    >
                                      <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border">
                                        {item.product.images[0]?.url && (
                                          <Image
                                            src={item.product.images[0].url}
                                            alt="img"
                                            fill
                                            className="object-cover"
                                          />
                                        )}
                                      </div>
                                      <div className="flex flex-col justify-center flex-1">
                                        <span className="text-base font-bold text-gray-900">
                                          <Highlight
                                            text={item.product.name}
                                            query={searchQuery}
                                          />
                                        </span>
                                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded w-fit">
                                          <Fingerprint size={10} /> {item.id}
                                        </div>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="text-sm font-bold bg-gray-100 px-4 py-2 rounded-xl border">
                                          x{item.quantity}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="lg:col-span-4 space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                  <User size={14} /> Müşteri & Teslimat
                                </h4>
                                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
                                  {order.userId && (
                                    <Link
                                      href={`/admin/users/${order.userId}`}
                                      className="flex items-center gap-3 p-3 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
                                    >
                                      <ExternalLink size={14} /> Müşteri
                                      Profiline Git
                                    </Link>
                                  )}
                                  <div className="flex gap-4">
                                    <div className="p-2 bg-gray-50 rounded-lg h-fit">
                                      <Mail
                                        size={16}
                                        className="text-gray-500"
                                      />
                                    </div>
                                    <div className="flex flex-col text-xs">
                                      <span className="font-bold text-gray-400 uppercase">
                                        E-posta
                                      </span>
                                      <span className="font-medium text-gray-900 break-all">
                                        {order.customerEmail || "-"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex gap-4">
                                    <div className="p-2 bg-gray-50 rounded-lg h-fit">
                                      <Phone
                                        size={16}
                                        className="text-gray-500"
                                      />
                                    </div>
                                    <div className="flex flex-col text-xs">
                                      <span className="font-bold text-gray-400 uppercase">
                                        Telefon
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        {order.customerPhone || "-"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex gap-4">
                                    <div className="p-2 bg-gray-50 rounded-lg h-fit">
                                      <MapPin
                                        size={16}
                                        className="text-gray-500"
                                      />
                                    </div>
                                    <div className="flex flex-col text-xs">
                                      <span className="font-bold text-gray-400 uppercase">
                                        Adres
                                      </span>
                                      <span className="font-medium text-gray-900 leading-relaxed">
                                        {order.address || "-"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {confirmation.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95 origin-center">
            <div
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg ${confirmation.isDangerous ? "bg-red-50 text-red-500 shadow-red-100" : "bg-indigo-50 text-indigo-500 shadow-indigo-100"}`}
            >
              {confirmation.isDangerous ? (
                <AlertTriangle size={40} />
              ) : (
                <Info size={40} />
              )}
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              {confirmation.title}
            </h3>
            <p className="text-gray-500 mb-8 px-4 leading-relaxed">
              {confirmation.description}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() =>
                  setConfirmation({ ...confirmation, isOpen: false })
                }
                disabled={isUpdating}
                className="py-4 font-bold text-gray-700 bg-white hover:bg-gray-50 rounded-2xl border-2 border-gray-100 transition-all active:scale-95"
              >
                Vazgeç
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isUpdating}
                className={`py-4 rounded-2xl text-white font-bold transition-all active:scale-95 flex items-center justify-center ${confirmation.isDangerous ? "bg-red-600 hover:bg-red-700 shadow-red-200" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"}`}
              >
                {isUpdating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  confirmation.confirmLabel
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
