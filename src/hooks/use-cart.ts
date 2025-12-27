import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

// 1. Tipleri Tanımlayalım
export interface Product {
  id: string; // Bu Product ID'dir
  name: string;
  price: number;
  salePrice?: number; // İndirimli fiyat
  imageUrl?: string;
  images?: Array<{
    url: string;
    isMain?: boolean;
  }>;
  stock?: number;
  // 🟢 YENİ: Varyant verileri eklendi
  variantId?: string;
  color?: string;
  size?: string;
}

export interface CartItem extends Product {
  quantity: number;
  // 🟢 YENİ: Sepet satır ID'si ile Ürün ID'sini ayırıyoruz
  productId: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (data: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeAll: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// 2. Store'u Oluşturalım
const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],

      // 🟢 GÜNCELLENEN EKLEME MANTIĞI
      addItem: (data: Product, quantity = 1) => {
        const currentItems = get().items;

        // 🛠️ KRİTİK NOKTA: Benzersiz Sepet ID'si Oluşturma
        // Eğer varyant varsa ID: "urunID-varyantID" olur, yoksa "urunID" olur.
        // Bu sayede Kırmızı M ile Kırmızı L sepette ayrı satır olur.
        const cartItemId = data.variantId
          ? `${data.id}-${data.variantId}`
          : data.id;

        const existingItem = currentItems.find(
          (item) => item.id === cartItemId
        );

        if (existingItem) {
          // Ürün (veya aynı varyant) zaten varsa miktarını artır
          set({
            items: currentItems.map((item) =>
              item.id === cartItemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
          toast.success("Ürün miktarı güncellendi.");
        } else {
          // Ürün yoksa yeni ekle
          set({
            items: [
              ...get().items,
              {
                ...data,
                id: cartItemId, // Sepet için benzersiz ID
                productId: data.id, // Orijinal ürün ID'si (Link vermek için lazım)
                quantity,
              },
            ],
          });
          toast.success(`${data.name} sepete eklendi!`);
        }
      },

      // Ürün Silme
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.error("Ürün sepetten çıkarıldı.");
      },

      // Miktar Güncelleme
      updateQuantity: (id: string, quantity: number) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      // Sepeti Temizle
      removeAll: () => set({ items: [] }),

      // Toplam Adet
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Toplam Tutar
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: "kervan-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
