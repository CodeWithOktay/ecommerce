// src/context/cart/types.ts

/**
 * Ürün Interface'i
 * E-ticaret sistemindeki ürünlerin temel yapısını tanımlar
 */
export interface Product {
  id: string; // Benzersiz ürün ID'si
  name: string; // Ürün adı
  category_id: string; // Ana kategori ID'si
  subcategory_id?: string; // Alt kategori ID'si (opsiyonel)
  subcategory_name?: string; // Alt kategori adı (opsiyonel)
  price: number; // Mevcut fiyat
  old_price?: number; // Eski fiyat (indirimli ürünler için)
  image_url: string; // Ürün görsel URL'i
  description: string; // Ürün açıklaması
  stock?: number; // Stok adedi
  brand?: string; // Marka ismi
  rating?: number; // 0–5 arası kullanıcı puanlaması
  is_featured: boolean; // Öne çıkan ürün mü?
  created_at: string; // Ürün yüklenme tarihi (ISO string)
  updated_at?: string; // Ürün güncelleme tarihi (ISO string)
}

/**
 * Sepet Öğesi Interface'i
 * Sepetteki her bir ürün ve miktar bilgisini tutar
 */
export interface CartItem {
  product: Product; // Ürün bilgisi
  quantity: number; // Sepetteki adet
}

/**
 * Sepet State Interface'i
 * Sepetin genel durumunu temsil eder
 */
export interface CartState {
  items: CartItem[]; // Sepetteki tüm öğeler
  totalItems: number; // Toplam ürün adedi (tüm quantity'lerin toplamı)
  totalPrice: number; // Toplam fiyat (tüm ürünlerin price * quantity toplamı)
}

/**
 * Sepet Action Types
 * Reducer'da kullanılacak action türleri
 */
export type CartAction =
  // LocalStorage'dan sepeti yükleme
  | { type: 'LOAD_CART'; payload: CartItem[] }
  // Sepete yeni ürün ekleme veya miktar artırma
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  // Sepetten ürün çıkarma
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  // Ürün miktarını güncelleme
  | {
      type: 'UPDATE_QUANTITY';
      payload: { productId: string; quantity: number };
    }
  // Sepeti tamamen temizleme
  | { type: 'CLEAR_CART' };

/**
 * Cart Context Interface'i
 * useCart hook'u tarafından sağlanacak değerler ve fonksiyonlar
 */
export interface CartContextType {
  // State değerleri
  cart: CartItem[]; // Sepet öğeleri
  totalItems: number; // Toplam ürün adedi
  totalPrice: number; // Toplam fiyat

  // Action fonksiyonları
  addToCart: (product: Product, quantity?: number) => void; // Sepete ekle
  removeFromCart: (productId: string) => void; // Sepetten çıkar
  updateQuantity: (productId: string, quantity: number) => void; // Miktar güncelle
  clearCart: () => void; // Sepeti temizle
}
