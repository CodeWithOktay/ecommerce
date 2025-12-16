// src/hooks/use-search-store.ts
import { create } from "zustand";
import { searchProductsInDb } from "@/lib/actions/product-actions";

// Ürün tipini kabaca tanımlayalım (veya Prisma tiplerini kullanabilirsin)
interface SearchState {
  products: any[]; // Buraya detaylı Product tipi de verebilirsin
  isLoading: boolean;
  search: (query: string) => Promise<void>;
}

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
      // Server action'ı çağır
      const results = await searchProductsInDb(query);
      set({ products: results, isLoading: false });
    } catch (error) {
      console.error("Store arama hatası:", error);
      set({ products: [], isLoading: false });
    }
  },
}));
