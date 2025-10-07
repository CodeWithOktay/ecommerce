import { CartItem } from '@/types';

const CART_KEY = 'ecommerce-cart';
const isDevelopment = process.env.NODE_ENV;

const devLog = (message: string, data?: any) => {
  if (isDevelopment) {
    if (data) {
      console.log(`${message}`, data);
    } else {
      console.log(`${message}`);
    }
  }
};

const devError = (message: string, error?: any) => {
  if (isDevelopment) {
    console.error(`${message}`, error);
  }
};

export const clearCartFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CART_KEY);
    devLog("Sepet localStorage'dan temizlendi.");
  } catch (error) {
    devError('Sepet silinirken hata oluştu', error);
  } 
};

export const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) {
      devLog('Kayıtlı sepet bulunamadı');
      return [];
    }
    const parsedData = JSON.parse(stored);
    if (!Array.isArray(parsedData)) {
      devError('Sepet verisi array değil, temizleniyor...', parsedData);
      clearCartFromStorage();
      return [];
    }

    const isValidCart = parsedData.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        item.product &&
        typeof item.product.id === 'string' &&
        typeof item.product.name === 'string' &&
        typeof item.product.price === 'number' &&
        typeof item.product.quantity === 'number'
    );

    if (!isValidCart) {
      devError('Sepet verisi bozuk, temizleniyor...', parsedData);
      clearCartFromStorage();
      return [];
    }
    devLog('Sepet başarıyla yüklendi!', parsedData);
    return parsedData as CartItem[];
  } catch (error) {
    devError('Sepet yüklemede hata oluştu!', error);
    clearCartFromStorage();
    return [];
  }
};

export const saveCartToStorage = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;

  try {
    if (!Array.isArray(cart)) {
      devError('Kaydedilmek istenen sepet array değil!', cart);
      return;
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    devLog('Sepet localStorage’a kaydedildi!', cart);
  } catch (err) {
    devError('Sepet kaydedilirken hata oluştu!', err);
  }
};

export const getStorageInfo = () => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CART_KEY);
    return {
      exists: stored !== null,
      length: stored ? stored.length : 0,
      data: stored ? JSON.parse(stored) : null,
    };
  } catch (error) {
    return { error: 'Bozuk veri' };
  }
};
