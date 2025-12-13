"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/actions/category-actions";
import { deleteBrandFromCategory } from "@/lib/actions/delete-brand-from-category";
import { Category, Attribute, Brand } from "@prisma/client";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Save,
  X,
  Loader2,
  FolderTree,
  Layers,
  Tag,
  Briefcase,
  ChevronRight,
  AlertCircle,
  AlertTriangle, // İkon eklendi
} from "lucide-react";
import toast from "react-hot-toast";
import { CategoryBrandForm } from "@/components/forms/Category-brand-form";

type CategoryWithDetails = Category & {
  parent: Category | null;
  attributes: Attribute[];
  brands: Brand[];
};

interface Props {
  categories: CategoryWithDetails[];
}

export default function CategoryManager({ categories }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [attributes, setAttributes] = useState<string[]>([]);
  const [tempAttr, setTempAttr] = useState("");

  // --- İŞLEVLER ---
  const resetForm = () => {
    setEditingId(null);
    setName("");
    setParentId("");
    setAttributes([]);
    setTempAttr("");
  };

  const handleEditClick = (cat: CategoryWithDetails) => {
    setEditingId(cat.id);
    setName(cat.name);
    setParentId(cat.parentId || "");
    setAttributes(cat.attributes.map((a) => a.name));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddAttribute = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!tempAttr.trim()) return;
    if (attributes.includes(tempAttr.trim())) {
      toast.error("Bu özellik zaten ekli!");
      return;
    }
    setAttributes([...attributes, tempAttr.trim()]);
    setTempAttr("");
  };

  const handleRemoveAttribute = (attrToRemove: string) => {
    setAttributes(attributes.filter((a) => a !== attrToRemove));
  };

  // 👇 GÜNCELLENDİ: Custom Toast ile Marka Çıkarma
  const handleRemoveBrand = (brandId: string) => {
    if (!editingId) return;

    toast(
      (t) => (
        <div className="flex flex-col gap-3 min-w-[250px]">
          <div className="flex items-center gap-2 font-medium text-gray-800">
            <AlertTriangle className="text-amber-500" size={20} />
            <span>Markayı Silecek misin?</span> 
          </div>
          <div className="text-xs text-gray-500">
            Bu işlem markayı bu kategoriden siler.
          </div>
          <div className="flex gap-2 justify-end mt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Vazgeç
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                // Asıl işlem burada başlıyor
                const loadId = toast.loading("Marka çıkarılıyor...");
                const result = await deleteBrandFromCategory(
                  editingId,
                  brandId
                );

                if (result.success) {
                  toast.success(result.message, { id: loadId });
                  router.refresh();
                } else {
                  toast.error(result.message, { id: loadId, duration: 4000 });
                }
              }}
              className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm"
            >
              Evet, Çıkar
            </button>
          </div>
        </div>
      ),
      { duration: 5000, position: "top-center" }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    startTransition(async () => {
      let result;
      if (editingId) {
        result = await updateCategory(
          editingId,
          name,
          parentId || undefined,
          attributes
        );
      } else {
        result = await createCategory(name, parentId || undefined, attributes);
      }

      if (result.success) {
        toast.success(result.message || "İşlem başarılı! 🚀");
        resetForm();
        router.refresh();
      } else {
        toast.error(result.message || "Bir hata oluştu.");
      }
    });
  };

  // 👇 GÜNCELLENDİ: Custom Toast ile Kategori Silme
  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 min-w-[300px]">
          <div className="flex items-start gap-3">
            <div className="bg-red-100 p-2 rounded-full text-red-600">
              <Trash2 size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">
                Kategoriyi Sil?
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Bu işlem geri alınamaz. Alt kategoriler ve ilişkili veriler
                etkilenebilir.
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-gray-100 mt-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                // Silme işlemi
                startTransition(async () => {
                  const result = await deleteCategory(id);
                  if (result.success) {
                    toast.success("Kategori başarıyla silindi");
                    router.refresh();
                  } else {
                    toast.error(result.message || "Silinemedi");
                  }
                });
              }}
              className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              Evet, Sil
            </button>
          </div>
        </div>
      ),
      { duration: 8000, position: "top-center", style: { padding: "16px" } }
    );
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentEditingCategory = categories.find((c) => c.id === editingId);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gray-50/50 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Kategori Yönetimi
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            Mağazandaki ürün hiyerarşisini ve filtreleme özelliklerini buradan
            yönet.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <span className="bg-white border px-3 py-1 rounded-full text-xs font-medium text-gray-600 shadow-sm">
            Toplam: {categories.length} Kategori
          </span>
        </div>
      </div>

      {/* --- EDİTÖR BÖLÜMÜ --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
        {editingId && (
          <div className="bg-amber-50 border-b border-amber-100 px-6 py-2 flex justify-between items-center">
            <div className="flex items-center gap-2 text-amber-800 text-sm font-medium">
              <AlertCircle size={16} />
              <span>
                Şu an düzenleme modundasın:{" "}
                <strong>{currentEditingCategory?.name}</strong>
              </span>
            </div>
            <button
              onClick={resetForm}
              className="text-xs bg-white border border-amber-200 text-amber-700 px-3 py-1 rounded-md hover:bg-amber-50 transition-colors"
            >
              Vazgeç ve Yeni Ekle
            </button>
          </div>
        )}

        <div className="p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* SOL KOLON */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                <FolderTree className="text-indigo-600" size={20} />
                Temel Bilgiler
              </h3>

              <div className="space-y-4">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Kategori Adı
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Örn: Akıllı Telefonlar"
                    disabled={isPending}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Üst Kategori
                  </label>
                  <div className="relative">
                    <select
                      value={parentId}
                      onChange={(e) => setParentId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                      disabled={isPending}
                    >
                      <option value="">-- Ana Kategori (Root) --</option>
                      {categories
                        .filter((c) => c.id !== editingId)
                        .map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                    <ChevronRight
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SAĞ KOLON */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <Layers size={16} className="text-indigo-500" /> Filtre
                  Özellikleri
                </h3>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={tempAttr}
                    onChange={(e) => setTempAttr(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddAttribute(e)
                    }
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                    placeholder="Örn: Renk, Beden, Hafıza..."
                    disabled={isPending}
                  />
                  <button
                    onClick={() => handleAddAttribute()}
                    type="button"
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 active:scale-95 transition-transform"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {attributes.map((attr, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 bg-white text-gray-700 px-3 py-1.5 rounded-full text-sm border shadow-sm group hover:border-red-200 transition-colors"
                    >
                      {attr}
                      <button
                        onClick={() => handleRemoveAttribute(attr)}
                        type="button"
                        className="text-gray-400 group-hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {attributes.length === 0 && (
                    <span className="text-sm text-gray-400 italic py-2">
                      Henüz özellik eklenmedi.
                    </span>
                  )}
                </div>
              </div>

              {editingId && (
                <div className="bg-indigo-50/30 rounded-xl border border-indigo-100 p-5 animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
                    <Briefcase size={16} className="text-indigo-600" /> Marka
                    Yönetimi
                  </h3>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {currentEditingCategory?.brands?.map((b) => (
                      <span
                        key={b.id}
                        className="group bg-white text-indigo-700 px-2.5 py-1 rounded text-xs border border-indigo-100 font-medium shadow-sm flex items-center gap-2"
                      >
                        {b.name}
                        {/* Custom Toast ile Silme */}
                        <button
                          onClick={() => handleRemoveBrand(b.id)}
                          className="text-indigo-300 hover:text-red-600 transition-colors p-0.5 rounded-full hover:bg-red-50"
                          title="Bu kategoriden çıkar"
                          type="button"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                    {(!currentEditingCategory?.brands ||
                      currentEditingCategory.brands.length === 0) && (
                      <span className="text-sm text-gray-400 italic">
                        Bu kategoriye bağlı marka yok.
                      </span>
                    )}
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                    <CategoryBrandForm categoryId={editingId} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Footer */}
        <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex justify-end items-center gap-4">
          {editingId && (
            <span className="text-sm text-gray-500">
              Değişiklikleri kaydetmeyi unutma!
            </span>
          )}
          <button
            onClick={handleSubmit}
            disabled={isPending || !name}
            className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg shadow-gray-200 active:scale-95"
          >
            {isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {editingId ? "Kategoriyi Güncelle" : "Kategoriyi Oluştur"}
          </button>
        </div>
      </div>

      {/* --- LİSTELEME BÖLÜMÜ --- */}
      <div className="space-y-4">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Kategori ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 text-base"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Kategori İsmi</th>
                  <th className="px-6 py-4 font-semibold">Tür</th>
                  <th className="px-6 py-4 font-semibold">Özellikler</th>
                  <th className="px-6 py-4 font-semibold">Markalar</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="group hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2.5 rounded-lg shadow-sm ${cat.parentId ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}
                        >
                          {cat.parentId ? (
                            <Tag size={18} />
                          ) : (
                            <FolderTree size={18} />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {cat.name}
                          </div>
                          {cat.parent && (
                            <div className="text-xs text-gray-400 mt-0.5">
                              {cat.parent.name} altı
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {cat.parentId ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                          Alt Kategori
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          Ana Kategori
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {cat.attributes.slice(0, 2).map((a) => (
                          <span
                            key={a.id}
                            className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200"
                          >
                            {a.name}
                          </span>
                        ))}
                        {cat.attributes.length > 2 && (
                          <span className="text-[10px] text-gray-400 flex items-center">
                            +{cat.attributes.length - 2}
                          </span>
                        )}
                        {cat.attributes.length === 0 && (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                        {cat.brands?.length || 0} Marka
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(cat)}
                          className="p-2 text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm rounded-lg border border-transparent hover:border-gray-200 transition-all"
                          title="Düzenle"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-gray-400 hover:bg-white hover:text-red-600 hover:shadow-sm rounded-lg border border-transparent hover:border-gray-200 transition-all"
                          title="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
