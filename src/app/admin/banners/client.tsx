"use client";

import { useState } from "react";
import { Banner } from "@prisma/client";
import { Trash2, Plus, Image as ImageIcon, Pencil, X } from "lucide-react";
// updateBanner'ı import etmeyi unutma
import {
  createBanner,
  deleteBanner,
  toggleBannerStatus,
  updateBanner,
} from "@/lib/actions/banner";
import toast from "react-hot-toast";
import Image from "next/image";

interface Props {
  initialBanners: Banner[];
}

export default function BannerClient({ initialBanners }: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🟢 DÜZENLEME STATE'İ
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // URL Düzeltici
  const fixImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    let cleanUrl = url.replace(/^public\//, "");
    if (!cleanUrl.startsWith("/")) cleanUrl = "/" + cleanUrl;
    return cleanUrl;
  };

  // 🟢 FORM GÖNDERME (Hem Ekleme Hem Güncelleme)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Resim yolunu düzelt
    const rawImage = formData.get("imageUrl") as string;
    if (rawImage) formData.set("imageUrl", fixImageUrl(rawImage));

    let res;

    // Eğer düzenleme modundaysak UPDATE, değilse CREATE fonksiyonunu çağır
    if (editingBanner) {
      formData.append("id", editingBanner.id); // ID'yi ekle
      res = await updateBanner(formData);
    } else {
      res = await createBanner(formData);
    }

    if (res.success) {
      toast.success(res.message);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  // Formu ve State'i Temizle
  const resetForm = () => {
    setIsFormOpen(false);
    setEditingBanner(null);
  };

  // Düzenle Butonuna Basınca
  const handleEditClick = (banner: Banner) => {
    setEditingBanner(banner);
    setIsFormOpen(true);
    // Sayfanın en üstüne (forma) kaydır
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğine emin misin?")) return;
    const res = await deleteBanner(id);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const res = await toggleBannerStatus(id, currentStatus);
    if (res.success) toast.success("Durum güncellendi");
  };

  return (
    <div className="space-y-6">
      {/* EKLE / KAPAT BUTONU */}
      <div className="flex justify-end">
        {!isFormOpen ? (
          <button
            onClick={() => {
              setEditingBanner(null); // Temizle ki yeni kayıt olsun
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all font-medium"
          >
            <Plus size={18} /> Yeni Banner Ekle
          </button>
        ) : (
          <button
            onClick={resetForm}
            className="flex items-center gap-2 bg-gray-100 text-gray-600 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-all font-medium"
          >
            <X size={18} /> İptal
          </button>
        )}
      </div>

      {/* --- FORM (DİNAMİK) --- */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-gray-900">
              {editingBanner ? "Banner Düzenle" : "Yeni Banner Ekle"}
            </h3>
            {editingBanner && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                Düzenleme Modu
              </span>
            )}
          </div>

          {/* Key vererek React'in formu resetlemesini sağlıyoruz */}
          <form
            key={editingBanner ? editingBanner.id : "new"}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık
                </label>
                <input
                  required
                  name="title"
                  type="text"
                  defaultValue={editingBanner?.title}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sıralama
                </label>
                <input
                  name="order"
                  type="number"
                  defaultValue={editingBanner?.order || 0}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resim Yolu
                </label>
                <div className="flex gap-2">
                  <span className="p-2 bg-gray-100 border border-r-0 rounded-l-lg text-gray-500">
                    <ImageIcon size={20} />
                  </span>
                  <input
                    required
                    name="imageUrl"
                    type="text"
                    defaultValue={editingBanner?.imageUrl}
                    placeholder="/banners/resim.png"
                    className="w-full p-2 border rounded-r-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <input
                  name="description"
                  type="text"
                  defaultValue={editingBanner?.description || ""}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link
                </label>
                <input
                  name="link"
                  type="text"
                  defaultValue={editingBanner?.link || ""}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="flex items-center h-full pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    name="isActive"
                    type="checkbox"
                    defaultChecked={
                      editingBanner ? editingBanner.isActive : true
                    }
                    className="w-5 h-5 text-indigo-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    Yayınla
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-all"
              >
                İptal
              </button>
              <button
                disabled={loading}
                type="submit"
                className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-8 py-2.5 rounded-lg font-bold hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50"
              >
                {loading
                  ? "İşleniyor..."
                  : editingBanner
                    ? "Güncelle"
                    : "Kaydet"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- TABLO --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                Görsel
              </th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                Bilgi
              </th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">
                Sıra
              </th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">
                Durum
              </th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialBanners.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Kayıt yok.
                </td>
              </tr>
            ) : (
              initialBanners.map((banner) => (
                <tr
                  key={banner.id}
                  className={`hover:bg-gray-50/50 transition-colors ${editingBanner?.id === banner.id ? "bg-indigo-50/50" : ""}`}
                >
                  <td className="p-4">
                    <div className="relative w-24 h-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      <Image
                        src={fixImageUrl(banner.imageUrl)}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">
                      {banner.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]">
                      {banner.imageUrl}
                    </div>
                  </td>
                  <td className="p-4 text-center font-mono text-sm">
                    {banner.order}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggle(banner.id, banner.isActive)}
                    >
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold border ${banner.isActive ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}
                      >
                        {banner.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* 🟢 DÜZENLEME BUTONU */}
                      <button
                        onClick={() => handleEditClick(banner)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
