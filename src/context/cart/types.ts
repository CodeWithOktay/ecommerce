// src/context/cart/types.ts

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
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export type CartAction =
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | {
      type: 'UPDATE_QUANTITY';
      payload: { productId: string; quantity: number };
    }
  | { type: 'CLEAR_CART' };

export interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}
