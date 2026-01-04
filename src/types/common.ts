/**
 * Ortak Tip Tanımlamaları
 * 
 * Uygulama genelinde kullanılan temel veri yapılarını (Model) ve
 * React component'leri için ortak props tiplerini içerir.
 * - Product, CartItem, Category gibi temel entity'ler burada tanımlanır.
 * - Context API ve State yönetimi için gerekli arayüzleri sağlar.
 */
// ✅ types.ts — Geliştirilmiş Sürüm
import { Decimal } from "@prisma/client/runtime/library";

// 🛒 Ürün Tipi
export interface Product {
  id: string;
  name: string;
  categoryId: string; // Refactored from category_id
  subCategoryId?: string; // Refactored from subcategory_id
  subCategoryName?: string; // Refactored from subcategory_name
  price: number | Decimal; // Allow both number and Decimal for flexibility
  oldPrice?: number; // Refactored from old_price
  imageUrl: string; // Refactored from image_url
  description: string | null; // Make description nullable to match Prisma type
  stock?: number; // stok adedi eklendi
  brand?: string; // marka ismi eklendi
  brandId?: string | null; // marka ID'si eklendi
  rating?: number; // 0–5 arası puanlama
  isFeatured: boolean; // Refactored from is_featured
  createdAt: string; // Refactored from created_at
  updatedAt?: string; // Refactored from updated_at
  // Added standard properties used in components
  images?: { url: string; isMain: boolean }[];
  slug?: string;
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

export interface ProductWithImages {
  id: string;
  name: string;
  description: string | null;
  stock: number;
  // Using Decimal type from Prisma for accurate decimal handling
  // and allowing string for potential string inputs that will be converted to number
  price: number | string | Decimal;
  salePrice: number | string | Decimal | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  isArchived: boolean;
  brandId: string | null;
  defaultColor: string | null;
  defaultSize: string | null;
  images: {
    id: string;
    url: string;
    isMain: boolean;
  }[];
}
