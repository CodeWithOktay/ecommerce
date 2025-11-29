import { CartItem } from '@/types';

// LocalStorage anahtarını tanımla
const CART_KEY = 'ecommerce-cart';

// Geliştirme ortamı kontrolü
const isDevelopment = process.env.NODE_ENV;

// Geliştirme ortamında loglama fonksiyonları
const devLog = (message: string, data?: unknown) => {
  if (isDevelopment) {
    if (data) {
      console.log(`${message}`, data);
    } else {
      console.log(`${message}`);
    }
  }
};

const devError = (message: string, error?: unknown) => {
  if (isDevelopment) {
    console.error(`${message}`, error);
  }
};

/**
 * Sepeti localStorage'dan tamamen temizler
 * @returns {void}
 */
export const clearCartFromStorage = (): void => {
  // SSR (Server-Side Rendering) kontrolü
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CART_KEY);
    devLog("Sepet localStorage'dan temizlendi.");
  } catch (error) {
    devError('Sepet silinirken hata oluştu', error);
  }
};

/**
 * localStorage'dan sepet verisini yükler ve validasyon yapar
 * @returns {CartItem[]} - Geçerli sepet öğeleri veya boş array
 */
export const loadCartFromStorage = (): CartItem[] => {
  // SSR kontrolü - sunucu tarafında çalışmaz
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    // localStorage'dan veriyi al
    const stored = localStorage.getItem(CART_KEY);

    // Veri yoksa boş array döndür
    if (!stored) {
      devLog('Kayıtlı sepet bulunamadı');
      return [];
    }

    // JSON parse et
    const parsedData = JSON.parse(stored);

    // Array kontrolü
    if (!Array.isArray(parsedData)) {
      devError('Sepet verisi array değil, temizleniyor...', parsedData);
      clearCartFromStorage(); // Bozuk veriyi temizle
      return [];
    }

    // Her bir öğenin geçerlilik kontrolü
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

    // Geçersiz veri durumunda temizle
    if (!isValidCart) {
      devError('Sepet verisi bozuk, temizleniyor...', parsedData);
      clearCartFromStorage();
      return [];
    }

    devLog('Sepet başarıyla yüklendi!', parsedData);
    return parsedData as CartItem[];
  } catch (error) {
    devError('Sepet yüklemede hata oluştu!', error);
    clearCartFromStorage(); // Hata durumunda temizle
    return [];
  }
};

/**
 * Sepet verisini localStorage'a kaydeder
 * @param {CartItem[]} cart - Kaydedilecek sepet verisi
 * @returns {void}
 */
export const saveCartToStorage = (cart: CartItem[]): void => {
  // SSR kontrolü
  if (typeof window === 'undefined') return;

  try {
    // Girdi validasyonu
    if (!Array.isArray(cart)) {
      devError('Kaydedilmek istenen sepet array değil!', cart);
      return;
    }

    // localStorage'a kaydet
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    devLog("Sepet localStorage'a kaydedildi!", cart);
  } catch (err) {
    devError('Sepet kaydedilirken hata oluştu!', err);
  }
};

/**
 * localStorage'daki sepet bilgilerini getirir (debug amaçlı)
 * @returns {object | null} - Sepet bilgileri veya hata objesi
 */
export const getStorageInfo = () => {
  // SSR kontrolü
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CART_KEY);
    return {
      exists: stored !== null, // Sepet var mı?
      length: stored ? stored.length : 0, // Veri boyutu
      data: stored ? JSON.parse(stored) : null, // Parse edilmiş veri
    };
  } catch (error) {
    return { error: 'Bozuk veri' }; // Hata durumu
  }
};
