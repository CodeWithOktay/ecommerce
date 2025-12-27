// src/hooks/use-search-store.ts
import { create } from "zustand";
import { searchProductsInDb } from "@/lib/actions/product";
import { ProductWithImages } from "@/types/common";
import { Decimal } from "@prisma/client/runtime/library";

interface SearchState {
  products: ProductWithImages[];
  isLoading: boolean;
  search: (query: string) => Promise<void>;
}

// PrismaProduct interface'ini biraz daha esnek tutalım ki
// veritabanından eksik veri gelirse patlamayalım.
interface PrismaProduct {
  id: string;
  name: string;
  description: string;
  price: Decimal | number | string | null;
  salePrice: Decimal | number | string | null;
  stock?: number | null; // <-- BURASI: stock eksik gelebilir diye opsiyonel yaptık
  rating?: number;
  is_featured?: boolean;
  isActive: boolean;
  isArchived: boolean;
  defaultColor: string | null;
  defaultSize: string | null;
  categoryId: string;
  subcategoryId?: string;
  subcategoryName?: string;
  brandId?: string;
  brand?: string | { name: string };
  images: Array<{
    id: string;
    url: string;
    isMain: boolean;
  }>;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

// Helper function to transform Prisma product to our Product type
const transformToProduct = (
  prismaProduct: PrismaProduct
): ProductWithImages => {
  // Convert Decimal to number for the frontend
  const price =
    prismaProduct.price instanceof Decimal
      ? Number(prismaProduct.price)
      : Number(prismaProduct.price || 0);

  const old_price =
    prismaProduct.salePrice instanceof Decimal
      ? Number(prismaProduct.salePrice)
      : prismaProduct.salePrice !== null &&
          prismaProduct.salePrice !== undefined
        ? Number(prismaProduct.salePrice)
        : undefined;

  // Create the base product that includes only the fields defined in ProductWithImages
  const baseProduct: ProductWithImages = {
    id: prismaProduct.id,
    name: prismaProduct.name,
    description: prismaProduct.description,
    // --- KRİTİK DÜZELTME ---
    // Stock undefined veya null ise 0 olarak ata. Bu satır hatayı çözer.
    stock: prismaProduct.stock ?? 0,
    // -----------------------
    price: price,
    salePrice: prismaProduct.salePrice ? Number(prismaProduct.salePrice) : null,
    isActive: prismaProduct.isActive,
    isArchived: prismaProduct.isArchived,
    categoryId: prismaProduct.categoryId,
    brandId: prismaProduct.brandId || null,
    defaultColor: prismaProduct.defaultColor,
    defaultSize: prismaProduct.defaultSize,
    images: prismaProduct.images || [],
    createdAt:
      prismaProduct.createdAt instanceof Date
        ? prismaProduct.createdAt
        : new Date(prismaProduct.createdAt),
    updatedAt: prismaProduct.updatedAt
      ? prismaProduct.updatedAt instanceof Date
        ? prismaProduct.updatedAt
        : new Date(prismaProduct.updatedAt)
      : prismaProduct.createdAt instanceof Date
        ? prismaProduct.createdAt
        : new Date(prismaProduct.createdAt),
  };

  // Return as ProductWithImages which extends Product
  return {
    ...baseProduct,
    isActive: prismaProduct.isActive ?? true,
    isArchived: prismaProduct.isArchived ?? false,
    defaultColor: prismaProduct.defaultColor || null,
    defaultSize: prismaProduct.defaultSize || null,
    salePrice: old_price || null,
    categoryId: prismaProduct.categoryId || "",
  };
};

export const useSearchStore = create<SearchState>((set) => ({
  products: [],
  isLoading: false,

  search: async (query) => {
    // Arama boşsa temizle ve çık
    if (!query.trim()) {
      set({ products: [], isLoading: false });
      return;
    }

    set({ isLoading: true });

    try {
      // Get raw results from the database
      const rawResults = await searchProductsInDb(query);
      // Transform each product using our helper function
      const transformedProducts = rawResults.map((product) =>
        transformToProduct(product as unknown as PrismaProduct)
      ) as unknown as ProductWithImages[];

      set({
        products: transformedProducts,
        isLoading: false,
      });
    } catch (error) {
      console.error("Store arama hatası:", error);
      set({ products: [], isLoading: false });
    }
  },
}));
