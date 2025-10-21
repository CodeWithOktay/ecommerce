'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import toast from 'react-hot-toast';
import { CartContextType, Product } from '../cart/types';
import { cartReducer, initialState } from './reducer';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // localStorage'dan yükle
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) dispatch({ type: 'LOAD_CART', payload: JSON.parse(stored) });
  }, []);

  // localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const value = useMemo<CartContextType>(
    () => ({
      cart: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
      addToCart: (product: Product, quantity: number = 1) => {
        dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });

        // Düzgün renkli toast
        toast.success(
          <div className="text-gray-900">
            <div className="font-semibold text-green-600">✓ {product.name}</div>
            <div className="text-sm text-gray-600 mt-1">Sepete eklendi!</div>
            <button
              onClick={() => (window.location.href = '/cart')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 transition-colors"
            >
              Sepete Git →
            </button>
          </div>,
          {
            duration: 3000,
            position: 'top-right',
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              padding: '16px',
              minWidth: '300px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            },
          }
        );
      },
      removeFromCart: (productId: string) =>
        dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } }),
      updateQuantity: (productId: string, quantity: number) =>
        dispatch({
          type: 'UPDATE_QUANTITY',
          payload: { productId, quantity },
        }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    }),
    [state]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
