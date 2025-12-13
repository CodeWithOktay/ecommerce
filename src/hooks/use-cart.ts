import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

// 1. Tipleri Tanımlayalım
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (data: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeAll: () => void;
  // Hesaplanan değerler (Component içinde selector ile de yapılabilir ama burası pratik)
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// 2. Store'u Oluşturalım
const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],

      // Ürün Ekleme
      addItem: (data: Product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          // Ürün zaten varsa miktarını artır
          set({
            items: currentItems.map((item) =>
              item.id === data.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
          toast.success("Ürün miktarı güncellendi.");
        } else {
          // Ürün yoksa yeni ekle
          set({ items: [...get().items, { ...data, quantity }] });
          toast.success(`${data.name} sepete eklendi!`);
        }
      },

      // Ürün Silme
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.error("Ürün sepetten çıkarıldı.");
      },

      // Miktar Güncelleme (Artır/Azalt)
      updateQuantity: (id: string, quantity: number) => {
        if (quantity < 1) return; // 1'in altına düşmesin

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      // Sepeti Temizle (Sipariş sonrası)
      removeAll: () => set({ items: [] }),

      // Toplam Adet (Badge için)
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Toplam Tutar (Checkout için)
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: "kervan-cart-storage", // LocalStorage anahtar adı
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
