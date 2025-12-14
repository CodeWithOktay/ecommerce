"use client";

import {
  Brand,
  Category,
  Product,
  Attribute,
  ProductAttributeValue,
} from "@prisma/client";
import { useState, useTransition, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Save,
  ArrowLeft,
  Loader2,
  Upload,
  X,
  Layers,
  TurkishLira,
  Package,
  Type,
  Star,
  ImageIcon,
  BadgePercent,
  Plus,
  Trash2,
  GitFork,
  ListChecks,
  Check,
  ChevronsUpDown,
  Search,
} from "lucide-react";
import { toBase64 } from "@/lib/utils/utils";
import {
  createProductWithImages,
  updateProductWithImages,
} from "@/lib/actions/product-actions";
import toast from "react-hot-toast";

// --- TİP TANIMLAMALARI ---
type CategoryWithChildren = Category & {
  brands: Brand[]; // 🟢 Markalar burada da var
  children: (Category & { attributes: Attribute[]; brands: Brand[] })[]; // 🟢 Ve burada
  attributes: Attribute[];
};

type ProductData = Omit<Product, "price" | "salePrice"> & {
  price: number;
  salePrice: number | null;
  attributeValues: ProductAttributeValue[];
  variants?: any[];
  images?: any[];
};

interface ImageFile {
  id: string;
  file?: File;
  previewUrl: string;
  isMain: boolean;
}
interface VariantRow {
  id: string;
  size: string;
  color: string;
  stock: number;
  priceDiff: number;
}

interface Props {
  categories: CategoryWithChildren[];
  brands: Brand[]; // Bu tüm liste (Yedek olarak kalsın ama kullanmayacağız)
  initialData?: ProductData | null;
}

// 🔥 ARAMALI SEÇİM KUTUSU BİLEŞENİ
function SearchableSelect({
  label,
  options,
  value,
  onChange,
  disabled = false,
  placeholder = "Seçiniz...",
}: {
  label?: string;
  options: { id: string; name: string }[];
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedName = options.find((o) => o.id === value)?.name;
  const filteredOptions = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          {label}
        </label>
      )}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:border-indigo-400"
        } ${isOpen ? "ring-2 ring-indigo-100 border-indigo-500" : ""}`}
      >
        <span
          className={`text-sm truncate ${!selectedName ? "text-gray-400" : "text-gray-900"}`}
        >
          {selectedName || placeholder}
        </span>
        <ChevronsUpDown size={16} className="text-gray-400 shrink-0" />
      </div>
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                autoFocus
                type="text"
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-indigo-50 transition-colors ${value === opt.id ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-700"}`}
                >
                  {opt.name}
                  {value === opt.id && (
                    <Check size={14} className="text-indigo-600" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-gray-400 text-center">
                Sonuç bulunamadı.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- ANA COMPONENT ---
export default function ProductForm({
  categories,
  brands,
  initialData,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. ANA FORM STATE ---
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    brandId: initialData?.brandId || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    salePrice: initialData?.salePrice || 0,
    stock: initialData?.stock || 0,
    categoryId: initialData?.categoryId || "",
    isActive: initialData?.isActive ?? true,
    isArchived: initialData?.isArchived ?? false,
  });

  // --- 2. KATEGORİ & ATTRIBUTE MANTIĞI ---
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [activeAttributes, setActiveAttributes] = useState<Attribute[]>([]);
  const [attributeValues, setAttributeValues] = useState<
    Record<string, string>
  >({});

  // --- 3. DİĞER STATELER ---
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([]);

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    if (initialData) {
      if (initialData.categoryId) {
        const parent = categories.find((p) =>
          p.children.some((c) => c.id === initialData.categoryId)
        );
        if (parent) {
          setSelectedParentId(parent.id);
          const child = parent.children.find(
            (c) => c.id === initialData.categoryId
          );
          if (child) setActiveAttributes(child.attributes);
        } else {
          const isMain = categories.find(
            (p) => p.id === initialData.categoryId
          );
          if (isMain) {
            setSelectedParentId(isMain.id);
            setActiveAttributes(isMain.attributes);
          }
        }
      }
      if (initialData.attributeValues) {
        const values: Record<string, string> = {};
        initialData.attributeValues.forEach((av) => {
          values[av.attributeId] = av.value;
        });
        setAttributeValues(values);
      }
      if (initialData.variants && initialData.variants.length > 0) {
        setVariants(
          initialData.variants.map((v: any) => ({
            id: v.id,
            size: v.size || "",
            color: v.color || "",
            stock: v.stock,
            priceDiff: Number(v.price) || 0,
          }))
        );
      }
      if (initialData.images && initialData.images.length > 0) {
        setSelectedImages(
          initialData.images.map((img: any) => ({
            id: img.id,
            previewUrl: img.url,
            isMain: img.isMain,
            file: undefined,
          }))
        );
      }
    }
  }, [initialData, categories]);

  // Kategori Değişim Handler'ı
  const handleCategoryChange = (catId: string) => {
    setFormData({ ...formData, categoryId: catId, brandId: "" }); // Kategori değişince markayı sıfırla
    const parent = categories.find((p) => p.id === selectedParentId);
    const child = parent?.children.find((c) => c.id === catId);
    if (child) setActiveAttributes(child.attributes);
    else setActiveAttributes([]);
  };

  // --- 🟢 YENİ: MARKA FİLTRELEME MANTIĞI ---
  const filteredBrands = useMemo(() => {
    if (!selectedParentId) return [];

    const parent = categories.find((c) => c.id === selectedParentId);

    const child = parent?.children.find((c) => c.id === formData.categoryId);

    const parentBrands = parent?.brands || [];
    const childBrands = child?.brands || [];

    const combined = [...parentBrands, ...childBrands];

    const uniqueBrands = Array.from(
      new Map(combined.map((item) => [item.id, item])).values()
    );

    return uniqueBrands;
  }, [categories, selectedParentId, formData.categoryId]);

  const parentCategories = useMemo(
    () => categories.filter((c) => c.parentId === null),
    [categories]
  );
  const subCategories = useMemo(
    () => categories.find((c) => c.id === selectedParentId)?.children || [],
    [categories, selectedParentId]
  );

  // --- HANDLERS ---
  const addVariant = () =>
    setVariants([
      ...variants,
      { id: crypto.randomUUID(), size: "", color: "", stock: 0, priceDiff: 0 },
    ]);
  const removeVariant = (id: string) =>
    setVariants(variants.filter((v) => v.id !== id));
  const updateVariant = (
    id: string,
    field: keyof VariantRow,
    value: string | number
  ) =>
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newImages: ImageFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      const base64 = await toBase64(file);
      newImages.push({
        id: crypto.randomUUID(),
        file: file,
        previewUrl: base64,
        isMain: selectedImages.length === 0 && i === 0,
      });
    }
    setSelectedImages([...selectedImages, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleSetMain = (id: string) =>
    setSelectedImages((prev) =>
      prev.map((img) => ({ ...img, isMain: img.id === id }))
    );
  const handleRemoveImage = (id: string) => {
    setSelectedImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (prev.find((img) => img.id === id)?.isMain && filtered.length > 0)
        filtered[0].isMain = true;
      return filtered;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || formData.price <= 0) {
      toast.error("Zorunlu alanları doldurunuz.");
      return;
    }
    if (selectedImages.length === 0) {
      toast.error("Görsel yüklemelisiniz.");
      return;
    }

    startTransition(async () => {
      const attributesPayload = Object.entries(attributeValues).map(
        ([attrId, val]) => ({ attributeId: attrId, value: val })
      );
      const variantsPayload = variants.map((v) => ({
        name: `${v.color} - ${v.size}`,
        size: v.size,
        color: v.color,
        stock: Number(v.stock),
        price: Number(v.priceDiff),
      }));
      const totalStock =
        variants.length > 0
          ? variants.reduce((acc, curr) => acc + Number(curr.stock), 0)
          : formData.stock;

      const payload = {
        ...formData,
        stock: totalStock,
        salePrice:
          formData.salePrice && formData.salePrice > 0
            ? formData.salePrice
            : null,
        images: selectedImages.map((img) => ({
          base64Data: img.previewUrl,
          isMain: img.isMain,
        })),
        variants: variantsPayload,
        attributeValues: attributesPayload,
      };
      let result;
      if (initialData) {
        // Eğer düzenleme modundaysak (initialData varsa) -> GÜNCELLEME ÇAĞIR
        result = await updateProductWithImages(initialData.id, payload);
      } else {
        // Eğer yeni ürünse -> OLUŞTURMA ÇAĞIR
        result = await createProductWithImages(payload);
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto pb-40">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {initialData ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </h1>
            <p className="text-sm text-gray-500">
              Ürün detaylarını, varyantlarını ve özelliklerini gir.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}{" "}
            Kaydet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- SOL KOLON --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* TEMEL BİLGİLER */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Type size={18} className="text-gray-400" /> Temel Bilgiler
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Örn: iPhone 15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* DİNAMİK ÖZELLİKLER */}
          {activeAttributes.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ListChecks size={18} className="text-indigo-500" /> Ürün
                Özellikleri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeAttributes.map((attr) => (
                  <div key={attr.id}>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      {attr.name}
                    </label>
                    <input
                      type="text"
                      value={attributeValues[attr.id] || ""}
                      onChange={(e) =>
                        setAttributeValues({
                          ...attributeValues,
                          [attr.id]: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder={`${attr.name} girin...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GÖRSELLER */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon size={18} className="text-gray-400" /> Görseller
            </h3>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*"
              className="hidden"
            />
            <div className="grid grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 transition-all"
              >
                <Upload size={24} /> <span className="text-xs mt-1">Ekle</span>
              </button>
              {selectedImages.map((img) => (
                <div
                  key={img.id}
                  className={`relative group rounded-lg overflow-hidden border-2 aspect-square ${img.isMain ? "border-indigo-600" : "border-gray-200"}`}
                >
                  <Image
                    src={img.previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleSetMain(img.id)}
                    className="absolute top-1 left-1 p-1 bg-white rounded-full shadow hover:text-indigo-600 transition-colors"
                  >
                    <Star
                      size={12}
                      fill={img.isMain ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-1 right-1 p-1 bg-white rounded-full shadow text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <X size={12} />
                  </button>
                  {img.isMain && (
                    <div className="absolute bottom-0 inset-x-0 bg-indigo-600/90 text-white text-[10px] text-center py-1">
                      Kapak
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* VARYANTLAR */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <GitFork size={18} className="text-gray-400" /> Ürün Varyantları
              </h3>
              <button
                type="button"
                onClick={addVariant}
                className="text-sm flex items-center gap-1 text-indigo-600 font-medium hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus size={16} /> Varyant Ekle
              </button>
            </div>
            {variants.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">
                  Varyant (Renk/Beden) yok.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Tek tip ürün olarak kaydedilecektir.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                      <th className="px-3 py-2">Renk</th>
                      <th className="px-3 py-2">Beden</th>
                      <th className="px-3 py-2">Stok</th>
                      <th className="px-3 py-2">Fiyat Farkı</th>
                      <th className="px-3 py-2 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {variants.map((variant) => (
                      <tr key={variant.id}>
                        <td className="p-2">
                          <input
                            placeholder="Renk"
                            value={variant.color}
                            onChange={(e) =>
                              updateVariant(variant.id, "color", e.target.value)
                            }
                            className="w-full border rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            placeholder="Beden"
                            value={variant.size}
                            onChange={(e) =>
                              updateVariant(variant.id, "size", e.target.value)
                            }
                            className="w-full border rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) =>
                              updateVariant(variant.id, "stock", e.target.value)
                            }
                            className="w-20 border rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={variant.priceDiff}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "priceDiff",
                                e.target.value
                              )
                            }
                            className="w-24 border rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                          />
                        </td>
                        <td className="p-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeVariant(variant.id)}
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* --- SAĞ KOLON --- */}
        <div className="space-y-8">
          {/* ORGANİZASYON */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Layers size={18} className="text-gray-400" /> Organizasyon
            </h3>
            <div className="space-y-4">
              <SearchableSelect
                label="1. Ana Kategori"
                options={parentCategories}
                value={selectedParentId}
                onChange={(val) => {
                  setSelectedParentId(val);
                  setFormData({ ...formData, categoryId: "", brandId: "" }); // Markayı da sıfırla
                  setActiveAttributes([]);
                }}
                placeholder="Ana Kategori Ara..."
              />
              <SearchableSelect
                label="2. Alt Kategori"
                options={subCategories}
                value={formData.categoryId}
                onChange={handleCategoryChange}
                disabled={!selectedParentId}
                placeholder={
                  selectedParentId
                    ? "Alt Kategori Ara..."
                    : "Önce Ana Kategori Seç"
                }
              />
              <hr className="border-gray-100" />

              {/* 🟢 GÜNCELLENEN MARKA SEÇİMİ */}
              <SearchableSelect
                label="Marka"
                options={filteredBrands} // 👈 SADECE FİLTRELENEN MARKALAR
                value={formData.brandId}
                onChange={(val) => setFormData({ ...formData, brandId: val })}
                disabled={!selectedParentId}
                placeholder={
                  !selectedParentId
                    ? "Önce Kategori Seçiniz"
                    : filteredBrands.length === 0
                      ? "Bu kategoride marka yok"
                      : "Marka Ara..."
                }
              />
            </div>
          </div>

          {/* FİYAT & STOK */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">
              Satış Bilgileri
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <TurkishLira size={14} /> Fiyat
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={Number.isNaN(formData.price) ? "" : formData.price}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setFormData({
                        ...formData,
                        price: isNaN(val) ? 0 : val,
                      });
                    }}
                    className="w-full px-4 py-2 rounded-lg border outline-none font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-600 mb-1 flex items-center gap-1">
                    <BadgePercent size={14} /> İndirimli Fiyat
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      formData.salePrice === null || formData.salePrice === 0
                        ? ""
                        : formData.salePrice
                    }
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setFormData({
                        ...formData,
                        salePrice: isNaN(val) ? 0 : val,
                      });
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-red-200 text-red-600 outline-none font-mono focus:ring-2 focus:ring-red-500"
                    placeholder="Opsiyonel"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Package size={14} /> Genel Stok
                </label>
                <input
                  type="number"
                  min="0"
                  value={
                    variants.length > 0
                      ? variants.reduce((a, b) => a + Number(b.stock), 0)
                      : formData.stock
                  }
                  onChange={(e) =>
                    variants.length === 0 &&
                    setFormData({
                      ...formData,
                      stock: parseInt(e.target.value),
                    })
                  }
                  disabled={variants.length > 0}
                  className="w-full px-4 py-2 rounded-lg border bg-gray-50 disabled:bg-gray-100 outline-none font-mono focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* DURUM */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Aktif</span>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-5 h-5 accent-indigo-600"
              />
            </div>
            <hr className="border-gray-100 my-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Arşivle</span>
              <input
                type="checkbox"
                checked={formData.isArchived}
                onChange={(e) =>
                  setFormData({ ...formData, isArchived: e.target.checked })
                }
                className="w-5 h-5 accent-gray-600"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
