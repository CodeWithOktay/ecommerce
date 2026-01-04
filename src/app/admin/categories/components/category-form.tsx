"use client";

import {
  FolderTree,
  Layers,
  Plus,
  Save,
  X,
  Briefcase,
  AlertCircle,
  Loader2,
  ChevronRight,
  Sparkles,
  Type,
  LayoutGrid,
  Check,
  ArrowRight,
} from "lucide-react";
import { CategoryBrandForm } from "@/components/features/category/category-brand-form";
import { Category, Brand, Attribute } from "@prisma/client";
import { useEffect, useState, useMemo } from "react";

type CategoryWithDetails = Category & {
  parent: Category | null;
  attributes: Attribute[];
  brands: Brand[];
};

interface CategoryFormProps {
  // State
  editingId: string | null;
  name: string;
  setName: (val: string) => void;
  parentId: string;
  setParentId: (val: string) => void;
  attributes: string[];
  tempAttr: string;
  setTempAttr: (val: string) => void;
  isPending: boolean;
  
  // Data
  categories: CategoryWithDetails[];
  currentEditingCategory?: CategoryWithDetails;

  // Handlers
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  handleAddAttribute: (e?: React.FormEvent, directValue?: string) => void;
  handleRemoveAttribute: (attr: string) => void;
  handleRemoveBrand: (brandId: string) => void;
}

export function CategoryForm({
  editingId,
  name,
  setName,
  parentId,
  setParentId,
  attributes,
  tempAttr,
  setTempAttr,
  isPending,
  categories,
  currentEditingCategory,
  handleSubmit,
  resetForm,
  handleAddAttribute,
  handleRemoveAttribute,
  handleRemoveBrand,
}: CategoryFormProps) {
  
  // Local state for UI selection
  const [categoryType, setCategoryType] = useState<"main" | "sub">("main");
  
  // State for Cascading Selector
  const [activeRootId, setActiveRootId] = useState<string | null>(null);

  // Derived selections
  const rootCategories = useMemo(() => categories.filter(c => !c.parentId && c.id !== editingId), [categories, editingId]);
  
  // Subcategories of the active root (to be shown in step 2)
  const availableSubCategories = useMemo(() => {
    if (!activeRootId) return [];
    return categories.filter(c => c.parentId === activeRootId && c.id !== editingId);
  }, [categories, activeRootId, editingId]);

  // Sync state when editing or parentId changes
  useEffect(() => {
    if (parentId) {
      setCategoryType("sub");
      // Find the root parent of the selected parent to populate activeRootId correctly
      // Case 1: The parent is a Root (parentId points to a root category)
      const directParent = categories.find(c => c.id === parentId);
      if (directParent) {
         if (!directParent.parentId) {
             setActiveRootId(directParent.id); // Parent IS the root
         } else {
             // Parent is a sub-category, so its parent is the root (supporting 2 levels deep for now in logic, usually deeper in recursion but UI is 2-step)
             setActiveRootId(directParent.parentId);
         }
      }
    } else {
      setCategoryType("main");
      setActiveRootId(null);
    }
  }, [parentId, categories]);

  const handleTypeSelect = (type: "main" | "sub") => {
    setCategoryType(type);
    if (type === "main") {
      setParentId(""); 
      setActiveRootId(null);
    }
  };

  const handleRootSelect = (rootId: string) => {
      setActiveRootId(rootId);
      setParentId(rootId); // Default to selected root as parent
  };

  const handleSubSelect = (subId: string) => {
      setParentId(subId);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden relative transition-all duration-300 hover:shadow-2xl">
      {/* Edit Mode Banner */}
      {editingId && (
        <div className="bg-amber-50/90 border-b border-amber-100 px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-amber-800 text-sm font-medium animate-in slide-in-from-top-2">
            <AlertCircle size={18} className="text-amber-600" />
            <span>
              Düzenleniyor:{" "}
              <span className="font-bold underline decoration-amber-300 decoration-2 underline-offset-2">
                {currentEditingCategory?.name}
              </span>
            </span>
          </div>
          <button
            onClick={resetForm}
            className="text-xs bg-white border border-amber-200 text-amber-700 px-4 py-1.5 rounded-full hover:bg-amber-100 transition-colors font-medium shadow-sm hover:shadow"
          >
            Vazgeç
          </button>
        </div>
      )}

      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN: Basic Info */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FolderTree size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Temel Bilgiler
              </h3>
            </div>

            <div className="space-y-6">
               {/* 1. Category Type Selection */}
               <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 block">Kategori Türü</label>
                  <div className="grid grid-cols-2 gap-4">
                     <button
                        type="button"
                        onClick={() => handleTypeSelect("main")}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left group overflow-hidden ${
                           categoryType === "main" 
                             ? "border-indigo-600 bg-indigo-50/50 shadow-md scale-[1.02]" 
                             : "border-gray-100 bg-white hover:border-indigo-200 hover:bg-gray-50"
                        }`}
                     >
                        <div className={`p-2 rounded-lg w-fit mb-3 transition-colors ${
                            categoryType === "main" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                        }`}>
                            <LayoutGrid size={20} />
                        </div>
                        <h4 className={`font-bold text-sm ${categoryType === "main" ? "text-indigo-900" : "text-gray-700"}`}>Ana Kategori</h4>
                        
                        {categoryType === "main" && (
                            <div className="absolute top-2 right-2 text-indigo-600 animate-in zoom-in">
                                <Check size={18} />
                            </div>
                        )}
                     </button>

                     <button
                        type="button"
                        onClick={() => handleTypeSelect("sub")}
                         className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left group overflow-hidden ${
                           categoryType === "sub" 
                             ? "border-purple-600 bg-purple-50/50 shadow-md scale-[1.02]" 
                             : "border-gray-100 bg-white hover:border-purple-200 hover:bg-gray-50"
                        }`}
                     >
                        <div className={`p-2 rounded-lg w-fit mb-3 transition-colors ${
                            categoryType === "sub" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600"
                        }`}>
                            <Type size={20} />
                        </div>
                        <h4 className={`font-bold text-sm ${categoryType === "sub" ? "text-purple-900" : "text-gray-700"}`}>Alt Kategori</h4>

                        {categoryType === "sub" && (
                            <div className="absolute top-2 right-2 text-purple-600 animate-in zoom-in">
                                <Check size={18} />
                            </div>
                        )}
                     </button>
                  </div>
               </div>

              {/* 2. CASCADING PARENT SELECTOR */}
              {categoryType === "sub" && (
                  <div className="space-y-4 animate-in slide-in-from-top-4 fade-in duration-300 p-5 bg-gray-50 rounded-xl border border-gray-200">
                    
                    {/* Step 1: Root Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                            Ana Kategori Seç
                        </label>
                        <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                           {rootCategories.map(root => (
                               <button
                                  key={root.id}
                                  type="button"
                                  onClick={() => handleRootSelect(root.id)}
                                  className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all flex items-center justify-between group ${
                                      activeRootId === root.id 
                                        ? "bg-purple-600 text-white shadow-md shadow-purple-200" 
                                        : "bg-white text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200"
                                  }`}
                               >
                                  <span className="truncate">{root.name}</span>
                                  {activeRootId === root.id && <ChevronRight size={14} className="opacity-80" />}
                               </button>
                           ))}
                        </div>
                    </div>

                    {/* Step 2: Sub Selection (Optional) */}
                    {activeRootId && availableSubCategories.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-gray-200 animate-in slide-in-from-left-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                                Alt Kategori Detayı (Opsiyonel)
                            </label>
                            
                            <div className="grid grid-cols-1 gap-2">
                                {/* Option to stick with Root */}
                                <button
                                    type="button"
                                    onClick={() => handleRootSelect(activeRootId)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all border flex items-center gap-2 ${
                                        parentId === activeRootId
                                         ? "bg-green-50 text-green-700 border-green-200"
                                         : "bg-white text-gray-500 border-dashed border-gray-300 hover:border-gray-400"
                                    }`}
                                >
                                   {parentId === activeRootId ? <Check size={14} /> : <div className="w-3.5" />}
                                   <span>Doğrudan <strong>{rootCategories.find(r => r.id === activeRootId)?.name}</strong> altına ekle</span>
                                </button>

                                {/* Existing Subs */}
                                {availableSubCategories.map(sub => (
                                    <button
                                     key={sub.id}
                                     type="button"
                                     onClick={() => handleSubSelect(sub.id)}
                                     className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all border flex items-center gap-2 ml-4 ${
                                         parentId === sub.id
                                          ? "bg-purple-50 text-purple-700 border-purple-200"
                                          : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
                                     }`}
                                    >
                                       {parentId === sub.id ? <Check size={14} /> : <div className="w-3.5 border-b border-l border-gray-300 h-2 -ml-1 mr-1 rounded-bl" />}
                                       <span>{sub.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                  </div>
              )}

              {/* 3. Name Input */}
              <div className="group space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Type size={14} className="text-gray-400" /> Kategori Adı
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-900"
                  placeholder="Örn: Akıllı Telefonlar"
                  disabled={isPending}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Attributes & Brands */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-6">
            
            {/* Filter Attributes Card */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <div className="p-1.5 bg-pink-50 text-pink-500 rounded-md">
                   <Layers size={16} />
                </div>
                FİLTRE ÖZELLİKLERİ
              </h3>

              {/* Inherited Attributes Section */}
              {parentId && (() => {
                  const parentCat = categories.find(c => c.id === parentId);
                  if (parentCat && parentCat.attributes.length > 0) {
                      const newAttributes = parentCat.attributes.filter(pa => !attributes.includes(pa.name));
                      if (newAttributes.length === 0) return null;
                      
                      return (
                          <div className="mb-6 bg-pink-50/50 p-4 rounded-xl border border-pink-100 animate-in slide-in-from-top-2">
                              <h4 className="text-xs font-semibold text-pink-700 mb-2 flex items-center gap-1.5">
                                  <Sparkles size={12} />
                                  <span>{parentCat.name} Kategorisinden Önerilenler</span>
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                  {newAttributes.map(attr => (
                                      <button
                                          key={attr.id}
                                          type="button"
                                          onClick={() => handleAddAttribute(undefined, attr.name)}
                                          className="px-2.5 py-1.5 bg-white text-pink-600 text-xs font-medium rounded-lg border border-pink-200 hover:bg-pink-100 transition-colors shadow-sm"
                                      >
                                          + {attr.name}
                                      </button>
                                  ))}
                              </div>
                              <p className="text-[10px] text-pink-400 mt-2">
                                  * Özelliği anında eklemek için üzerine tıklayın.
                              </p>
                          </div>
                      )
                  }
                  return null;
              })()}

              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={tempAttr}
                    onChange={(e) => setTempAttr(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddAttribute(e)
                    }
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 bg-white transition-all shadow-sm"
                    placeholder="Örn: Renk, Beden, Hafıza..."
                    disabled={isPending}
                  />
                  <Sparkles size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-300" />
                </div>
                <button
                  onClick={() => handleAddAttribute()}
                  type="button"
                  className="bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 active:scale-95 transition-all shadow-lg shadow-gray-200"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[44px] p-2 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                {attributes.map((attr, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 bg-white text-gray-700 px-3 py-1.5 rounded-lg text-sm border border-gray-100 shadow-sm group hover:border-red-200 hover:shadow-md transition-all cursor-default animate-in zoom-in-50 duration-200"
                  >
                    <span className="font-medium">{attr}</span>
                    <button
                      onClick={() => handleRemoveAttribute(attr)}
                      type="button"
                      className="text-gray-300 group-hover:text-red-500 transition-colors p-0.5 hover:bg-red-50 rounded"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {attributes.length === 0 && (
                  <div className="w-full flex flex-col items-center justify-center text-gray-400 py-4 gap-2">
                    <Layers size={24} className="opacity-20" />
                    <span className="text-xs italic">Henüz özellik eklenmedi.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Brand Management (Only in Edit Mode) */}
            {editingId && (
              <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-2xl border border-indigo-100 p-6 shadow-sm hover:shadow-md transition-shadow animate-in slide-in-from-bottom-4">
                <h3 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md">
                     <Briefcase size={16} />
                  </div>
                  MARKALAR
                </h3>

                <div className="mb-5 flex flex-wrap gap-2">
                  {currentEditingCategory?.brands?.map((b) => (
                    <span
                      key={b.id}
                      className="group bg-white text-indigo-700 px-3 py-1.5 rounded-lg text-xs border border-indigo-100 font-medium shadow-sm flex items-center gap-2 hover:shadow-md transition-all"
                    >
                      {b.name}
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
                    <span className="text-sm text-indigo-400/70 italic px-2">
                      Bu kategoriye bağlı marka yok.
                    </span>
                  )}
                </div>

                <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl" />
                  <CategoryBrandForm categoryId={editingId} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Footer */}
      <div className="bg-gray-50/80 backdrop-blur-sm px-8 py-5 border-t border-gray-100 flex flex-col sm:flex-row justify-end items-center gap-4">
        {editingId && (
          <span className="text-sm text-gray-500 animate-pulse">
             Değişiklikleri kaydetmeyi unutma!
          </span>
        )}
        <button
          onClick={handleSubmit}
          // Button is disabled if name is empty OR (it's a sub category type BUT no parent is selected)
          disabled={isPending || !name || (categoryType === "sub" && !parentId)}
          className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-xl shadow-gray-200 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
        >
          {isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {editingId ? "Değişiklikleri Kaydet" : "Kategoriyi Oluştur"}
        </button>
      </div>
    </div>
  );
}
