// src/hooks/use-search-store.ts
import { create } from "zustand";
import { searchProductsInDb } from "@/lib/actions/search";
import { ProductWithImages } from "@/types/common";

interface SearchState {
  products: ProductWithImages[];
  isLoading: boolean;
  search: (query: string) => Promise<void>;
}

// Define specific type for the response from search action
interface SearchResultItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  // rating and is_featured are not on Product model
  isActive: boolean;
  isArchived: boolean;
  defaultColor: string | null;
  defaultSize: string | null;
  categoryId: string;
  // subcategoryId is not on Product model (only categoryId)
  brandId: string | null;
  images: {
    id: string;
    url: string;
    isMain: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Helper function to transform SearchResultItem to ProductWithImages
const transformToProduct = (
  item: SearchResultItem
): ProductWithImages => {
  
  const baseProduct: ProductWithImages = {
    id: item.id,
    name: item.name,
    description: item.description,
    stock: item.stock ?? 0,
    price: item.price,
    salePrice: item.salePrice,
    isActive: item.isActive,
    isArchived: item.isArchived,
    categoryId: item.categoryId,
    brandId: item.brandId || null,
    defaultColor: item.defaultColor,
    defaultSize: item.defaultSize,
    images: item.images || [],
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  };

  return baseProduct;
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
        transformToProduct(product)
      );

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
