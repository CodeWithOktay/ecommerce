"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation"; // yönlendirme için
import {
  CartItem,
  CartAction,
  CartState,
  CartContextType,
  Product,
} from "../types";

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

function calcTotals(items: CartItem[]) {
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  return { totalItems, totalPrice };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.items.find(
        (i) => i.product.id === action.payload.id
      );
      const updatedItems = existing
        ? state.items.map((i) =>
            i.product.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...state.items, { product: action.payload, quantity: 1 }];
      return { ...state, items: updatedItems, ...calcTotals(updatedItems) };
    }
    case "REMOVE_FROM_CART":
      const filtered = state.items.filter(
        (i) => i.product.id !== action.payload
      );
      return { ...state, items: filtered, ...calcTotals(filtered) };
    case "UPDATE_QUANTITY":
      const updatedQty = state.items.map((i) =>
        i.product.id === action.payload.productId
          ? { ...i, quantity: action.payload.quantity }
          : i
      );
      return { ...state, items: updatedQty, ...calcTotals(updatedQty) };
    case "CLEAR_CART":
      return initialState;
    case "LOAD_CART":
      return { ...state, items: action.payload, ...calcTotals(action.payload) };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const router = useRouter(); // yönlendirme

  // localStorage'dan yükle
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) dispatch({ type: "LOAD_CART", payload: JSON.parse(stored) });
  }, []);

  // localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  // Toast otomatik temizleme
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const value = useMemo<CartContextType>(
    () => ({
      cart: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
      addToCart: (product: Product, quantity: number = 1) => {
        for (let i = 0; i < quantity; i++) {
          dispatch({ type: "ADD_TO_CART", payload: product });
        }
        setToastMessage(`Ürünüz sepete eklendi!`);
      },
      removeFromCart: (id: string) =>
        dispatch({ type: "REMOVE_FROM_CART", payload: id }),
      updateQuantity: (id: string, qty: number) =>
        dispatch({
          type: "UPDATE_QUANTITY",
          payload: { productId: id, quantity: qty },
        }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
      getCartTotal: () => ({
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }),
    }),
    [state]
  );

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* ✅ Sağ üst modern toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in">
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-green-200 shadow-xl px-5 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold">
              ✓
            </div>
            <div className="flex flex-col">
              <p className="text-gray-800 font-semibold">{toastMessage}</p>
              <button
                onClick={() => router.push("/cart")}
                className="mt-1 text-sm text-green-600 hover:underline font-medium"
              >
                Sepete Git
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
