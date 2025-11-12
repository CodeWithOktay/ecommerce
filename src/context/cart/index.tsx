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

// Context oluştur - başlangıçta undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Sepet Provider Bileşeni
 * 
 * Uygulamanın sepet state'ini yöneten context provider.
 * LocalStorage entegrasyonu, toast bildirimleri ve state yönetimi sağlar.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  // useReducer ile sepet state'ini yönet
  const [state, dispatch] = useReducer(cartReducer, initialState);

  /**
   * Component mount olduğunda localStorage'dan sepeti yükle
   * Sadece bir kere çalışması için boş dependency array
   */
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) dispatch({ type: 'LOAD_CART', payload: JSON.parse(stored) });
  }, []);

  /**
   * Sepet değiştiğinde localStorage'a kaydet
   * state.items değiştiğinde tetiklenir
   */
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  /**
   * Context value'sunu memoize et - performans optimizasyonu
   * Sepet işlemleri ve state değerlerini içerir
   */
  const value = useMemo<CartContextType>(
    () => ({
      // State değerleri
      cart: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
      
      // Sepete ekleme fonksiyonu
      addToCart: (product: Product, quantity: number = 1) => {
        // Reducer'a ekleme action'ı gönder
        dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });

        // Başarılı toast bildirimi göster
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
            duration: 3000, // 3 saniye göster
            position: 'top-right', // Sağ üst köşe
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
      
      // Sepetten çıkarma fonksiyonu
      removeFromCart: (productId: string) =>
        dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } }),
      
      // Miktar güncelleme fonksiyonu
      updateQuantity: (productId: string, quantity: number) =>
        dispatch({
          type: 'UPDATE_QUANTITY',
          payload: { productId, quantity },
        }),
      
      // Sepeti temizleme fonksiyonu
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    }),
    [state] // state değiştiğinde yeniden hesapla
  );

  // Context provider'ı render et
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Sepet Context Hook'u
 * 
 * CartContext'i kullanmak için custom hook.
 * Provider dışında kullanılırsa hata fırlatır.
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}