/**
 * Alışveriş Sepeti Hook'u (Zustand)
 * 
 * Bu hook, alışveriş sepetinin tüm state yönetimini sağlar.
 * Zustand ile global state yönetimi ve localStorage ile kalıcılık sağlanır.
 * Ürün varyantlarını (renk, beden) destekler.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

/**
 * Ürün Tipi
 * Sepete eklenecek ürünün temel bilgilerini içerir
 */
export interface Product {
  id: string;              // Ürün ID'si
  name: string;            // Ürün adı
  price: number;           // Fiyat
  salePrice?: number;      // İndirimli fiyat (varsa)
  imageUrl?: string;       // Ana resim URL'i
  images?: Array<{
    url: string;
    isMain?: boolean;
  }>;
  stock?: number;          // Stok miktarı
  // Varyant bilgileri
  variantId?: string;      // Varyant ID'si (renk-beden kombinasyonu)
  color?: string;          // Seçilen renk
  size?: string;           // Seçilen beden
}

/**
 * Sepet Öğesi Tipi
 * Product tipini genişleterek miktar ve ürün ID'si ekler
 */
export interface CartItem extends Product {
  quantity: number;        // Sepetteki miktar
  productId: string;       // Orijinal ürün ID'si (detay sayfası linki için)
}

/**
 * Sepet Store Interface
 * Sepet state'i ve metodlarını tanımlar
 */
interface CartStore {
  items: CartItem[];                                          // Sepetteki ürünler
  addItem: (data: Product, quantity?: number) => void;        // Ürün ekle
  removeItem: (id: string) => void;                           // Ürün çıkar
  updateQuantity: (id: string, quantity: number) => void;     // Miktar güncelle
  removeAll: () => void;                                      // Sepeti temizle
  getTotalItems: () => number;                                // Toplam ürün adedi
  getTotalPrice: () => number;                                // Toplam tutar
}


/**
 * Zustand Sepet Store'u
 * localStorage ile kalıcılık sağlanır
 */
const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],

      /**
       * Sepete Ürün Ekler
       * 
       * Aynı ürünün farklı varyantları (renk-beden) ayrı satırlar olarak eklenir.
       * Benzersiz sepet ID'si: variantId varsa "productId-variantId", yoksa "productId"
       * 
       * @param data - Eklenecek ürün bilgisi
       * @param quantity - Eklenecek miktar (varsayılan: 1)
       */
      addItem: (data: Product, quantity = 1) => {
        const currentItems = get().items;

        // Benzersiz sepet ID'si oluştur
        // Örnek: Kırmızı-M ve Kırmızı-L farklı satırlar olur
        const cartItemId = data.variantId
          ? `${data.id}-${data.variantId}`
          : data.id;

        // Bu varyant sepette var mı kontrol et
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
          // Ürün yoksa yeni ekle
          set({
            items: [
              ...get().items,
              {
                ...data,
                id: cartItemId,        // Sepet için benzersiz ID
                productId: data.id,    // Orijinal ürün ID'si (link için)
                quantity,
              },
            ],
          });
          
          toast.custom((t) => (
             <div className={`${
               t.visible ? 'animate-enter' : 'animate-leave'
             } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
               <div className="flex-1 w-0 p-4">
                 <div className="flex items-start">
                   <div className="flex-shrink-0 pt-0.5">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img
                       className="h-10 w-10 rounded-md object-cover"
                       src={data.imageUrl || "/placeholder.svg"}
                       alt=""
                     />
                   </div>
                   <div className="ml-3 flex-1">
                     <p className="text-sm font-medium text-gray-900">
                       Ürününüz sepete eklendi
                     </p>
                     <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                       {data.name}
                     </p>
                     {data.color && (
                         <p className="mt-1 text-xs text-gray-400">
                            {data.color} {data.size && ` - ${data.size}`}
                         </p>
                     )}
                   </div>
                 </div>
               </div>
               <div className="flex border-l border-gray-200">
                 <a
                    href="/cart"
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => toast.dismiss(t.id)}
                 >
                   Sepetime Git
                 </a>
               </div>
             </div>
          ));
        }
      },

      /**
       * Sepetten Ürün Çıkarır
       * 
       * @param id - Çıkarılacak ürünün sepet ID'si
       */
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.error("Ürün sepetten çıkarıldı.");
      },

      /**
       * Ürün Miktarını Günceller
       * 
       * @param id - Güncellenecek ürünün sepet ID'si
       * @param quantity - Yeni miktar (minimum 1)
       */
      updateQuantity: (id: string, quantity: number) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      /**
       * Sepeti Tamamen Temizler
       */
      removeAll: () => set({ items: [] }),

      /**
       * Sepetteki Toplam Ürün Adedini Hesaplar
       * 
       * @returns Toplam ürün adedi
       */
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      /**
       * Sepetteki Toplam Tutarı Hesaplar
       * 
       * @returns Toplam tutar (TL)
       */
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: "kervan-cart-storage",              // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
