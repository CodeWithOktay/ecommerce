"use client";

import { useState, useTransition, useEffect } from "react";
import { Category, Brand, Attribute } from "@prisma/client";
import { 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  deleteBrandFromCategory 
} from "@/lib/actions/category";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CategoryForm } from "./components/category-form";
import { CategoryList } from "./components/category-list";
import { Modal } from "@/components/ui/modal";
import { Plus, LayoutDashboard } from "lucide-react";
import { AlertCircle, Trash2 } from "lucide-react";

type CategoryWithDetails = Category & {
  parent: Category | null;
  attributes: Attribute[];
  brands: Brand[];
};

interface CategoryManagerProps {
  categories: CategoryWithDetails[];
}

/**
 * Kategori Yönetimi Bileşeni
 * 
 * Kategorilerin listelenmesi, eklenmesi, düzenlenmesi ve silinmesi işlemlerini yönetir.
 * - Server Action'lar (`createCategory`, `updateCategory` vb.) ile iletişim kurar.
 * - `useTransition` ile asenkron işlemler sırasında UI'ı bloklamadan loading durumu sağlar.
 * - Modal tabanlı form yapısı kullanır.
 */
export default function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [attributes, setAttributes] = useState<string[]>([]);
  const [tempAttr, setTempAttr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Handler to open modal for creation
  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // 1. EKLEME / GÜNCELLEME İŞLEMİ
  // Hem yeni kategori oluşturma hem de mevcut kategoriyi düzenleme burada yapılır.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    startTransition(async () => {
      try {
        if (editingId) {
          await updateCategory(editingId, name, parentId || undefined, attributes);
          toast.success("Kategori başarıyla güncellendi");
        } else {
          await createCategory(name, parentId || undefined, attributes);
          toast.success("Kategori başarıyla oluşturuldu");
        }
        resetForm();
        setIsModalOpen(false); // Close modal on success
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Bir hata oluştu");
      }
    });
  };

  // 2. KATEGORİ SİLME
  // Kullanıcıdan onay aldıktan sonra silme işlemini gerçekleştirir.
  const confirmDelete = (id: string) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
               <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Kategoriyi silmek istiyor musunuz?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Bu işlem geri alınamaz ve kategoriye bağlı tüm veriler silinir.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              handleDelete(id);
            }}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 hover:bg-red-50 transition-colors"
          >
            Sil
          </button>
        </div>
      </div>
    ));
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteCategory(id);
        toast.success("Kategori silindi");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Silinirken hata oluştu");
      }
    });
  };

  // 3. REMOVE ATTRIBUTES (Client-side mainly, unless functionality changes)
  const handleRemoveAttribute = (attr: string) => {
    setAttributes((prev) => prev.filter((a) => a !== attr));
  };

  const handleAddAttribute = (e?: React.FormEvent, directValue?: string) => {
    if (e) e.preventDefault();
    const val = directValue || tempAttr;
    if (val.trim() && !attributes.includes(val.trim())) {
      setAttributes([...attributes, val.trim()]);
      if (!directValue) setTempAttr(""); // Only clear if we used the input
    }
  };

  // 4. KATEGORİDEN MARKA ÇIKARMA
  // Bir kategoriden ilişkilendirilmiş markayı kaldırır.
  const handleRemoveBrand = (brandId: string) => {
    if (!editingId) return;

    toast.custom((t) => (
       <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
               <Trash2 className="h-10 w-10 text-amber-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Markayı çıkarmak istiyor musunuz?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Bu markayı bu kategoriden kaldırmak üzeresiniz.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
           <div className="flex flex-col w-full">
               <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    executeRemoveBrand(editingId, brandId);
                  }}
                  className="w-full border-b border-gray-200 p-3 text-sm font-medium text-amber-600 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                >
                  Evet, Çıkar
                </button>
                <button
                   onClick={() => toast.dismiss(t.id)}
                   className="w-full p-3 text-sm font-medium text-gray-600 hover:text-gray-500 hover:bg-gray-50 transition-colors rounded-br-lg"
                >
                   İptal
                </button>
           </div>
        </div>
      </div>
    ));
  };

  const executeRemoveBrand = async (catId: string, brandId: string) => {
      try {
        await deleteBrandFromCategory(catId, brandId);
        toast.success("Marka kategoriden çıkarıldı");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Marka çıkarılamadı");
      }
  };

  // 5. EDIT MODE
  const startEdit = (cat: CategoryWithDetails) => {
    setEditingId(cat.id);
    setName(cat.name);
    setParentId(cat.parentId || "");
    setAttributes(cat.attributes.map((a) => a.name));
    setIsModalOpen(true); // Open modal for editing
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setParentId("");
    setAttributes([]);
    setTempAttr("");
  };

  const handleModalClose = () => {
     setIsModalOpen(false);
     setTimeout(() => resetForm(), 300); // Reset after animation
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 flex items-center gap-3">
            <LayoutDashboard className="text-indigo-600" size={32} />
            Kategori Yönetimi
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl font-light">
            Mağazandaki ürün hiyerarşisini, filtre özelliklerini ve marka
            eşleştirmelerini buradan yönetebilirsin.
          </p>
        </div>
        <div className="flex flex-col items-end gap-4">
           <div className="flex flex-col items-end">
               <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Toplam Kategori</span>
               <span className="text-4xl font-bold text-gray-900">{categories.length}</span>
           </div>
           
           <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-gray-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={20} />
            Yeni Kategori Ekle
          </button>
        </div>
      </div>

      {/* Modal for Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingId ? "Kategoriyi Düzenle" : "Yeni Kategori Oluştur"}
        size="2xl"
        noPadding
      >
          <CategoryForm
            editingId={editingId}
            name={name}
            setName={setName}
            parentId={parentId}
            setParentId={(newId) => {
              setParentId(newId);
              if (newId) {
                const parentCat = categories.find((c) => c.id === newId);
                if (parentCat && parentCat.attributes.length > 0) {
                  const parentAttrs = parentCat.attributes.map((a) => a.name);
                  setAttributes((prev) => {
                    const unique = new Set([...prev, ...parentAttrs]);
                    return Array.from(unique);
                  });
                  toast.success(`${parentCat.name} özellikleri eklendi`, {
                    icon: "✨",
                    position: "bottom-center",
                    duration: 2000
                  });
                }
              }
            }}
            attributes={attributes}
            tempAttr={tempAttr}
            setTempAttr={setTempAttr}
            isPending={isPending}
            categories={categories}
            currentEditingCategory={categories.find((c) => c.id === editingId)}
            handleSubmit={handleSubmit}
            resetForm={handleModalClose} // Cancel closes modal
            handleAddAttribute={handleAddAttribute}
            handleRemoveAttribute={handleRemoveAttribute}
            handleRemoveBrand={handleRemoveBrand}
          />
      </Modal>

      {/* List (Full Width) */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <CategoryList
          categories={categories}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onDelete={confirmDelete}
          onEdit={startEdit}
        />
      </div>
    </div>
  );
}
