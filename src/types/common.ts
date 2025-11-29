// ✅ types.ts — Geliştirilmiş Sürüm

// 🛒 Ürün Tipi
export interface Product {
  id: string;
  name: string;
  category_id: string;
  subcategory_id?: string;
  subcategory_name?: string;
  price: number;
  old_price?: number;
  image_url: string;
  description: string;
  stock?: number; // stok adedi eklendi
  brand?: string; // marka ismi eklendi
  rating?: number; // 0–5 arası puanlama
  is_featured: boolean;
  created_at: string; // ürün yüklenme tarihi
  updated_at?: string; // ürün güncelleme tarihi
}

// 🧩 Ürün Kartı Props (UI bileşenleri için)
export interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

// 🛍️ Sepet Yapısı
export interface CartItem {
  product: Product;
  quantity: number;
}

// ⚙️ Sepet Aksiyonları
export type CartAction =
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

// 🧠 Sepet State
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// 🧰 Context Tipi
export interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => { totalItems: number; totalPrice: number };
}

// 🗂️ Kategori Tipleri
export interface Category {
  id: string;
  name: string;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
}

// 📦 Sayfa Parametreleri
export interface IdProps {
  params: { id: string };
}

export interface SlugProps {
  params: { slug: string };
}
