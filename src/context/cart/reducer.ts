import { CartAction, CartItem, CartState } from './types';

/**
 * Başlangıç state'i - boş sepet
 */
export const initialState: CartState = {
  items: [], // Sepet öğeleri
  totalItems: 0, // Toplam ürün adedi
  totalPrice: 0, // Toplam fiyat
};

/**
 * Toplamları hesaplayan yardımcı fonksiyon
 * @param items - Sepet öğeleri dizisi
 * @returns { totalItems, totalPrice } - Hesaplanan toplamlar
 */
const calculateTotals = (items: CartItem[]) => {
  // Tüm öğelerin quantity değerlerini topla
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Tüm öğelerin (fiyat * adet) değerlerini topla
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  return { totalItems, totalPrice };
};

/**
 * Sepet Reducer Fonksiyonu
 *
 * Sepet state'ini yöneten reducer fonksiyonu.
 * Farklı action type'larına göre state güncellemeleri yapar.
 */
export const cartReducer = (
  state: CartState, // Mevcut state
  action: CartAction // Dispatch edilen action
): CartState => {
  switch (action.type) {
    /**
     * Sepete Ekleme İşlemi
     * - Ürün zaten sepette varsa miktarını artırır
     * - Ürün sepette yoksa yeni öğe olarak ekler
     */
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      // Ürünün sepette olup olmadığını kontrol et
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );
      let newItems: CartItem[];

      if (existingItem) {
        // Var olan ürün: miktarı güncelle
        newItems = state.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Yeni ürün: sepete ekle
        newItems = [...state.items, { product, quantity }];
      }

      // Yeni state'i hesapla ve döndür
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems), // Toplamları yeniden hesapla
      };
    }

    /**
     * Sepetten Çıkarma İşlemi
     * - Belirtilen productId'ye sahip ürünü sepetten kaldırır
     */
    case 'REMOVE_FROM_CART': {
      const { productId } = action.payload;
      // productId'ye sahip ürünü filtrele
      const newItems = state.items.filter(
        (item) => item.product.id !== productId
      );
      return { ...state, items: newItems, ...calculateTotals(newItems) };
    }

    /**
     * Miktar Güncelleme İşlemi
     * - Belirtilen ürünün miktarını günceller
     */
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;

      // productId'ye sahip ürünün miktarını güncelle
      const newItems = state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      return { ...state, items: newItems, ...calculateTotals(newItems) };
    }

    /**
     * Sepeti Temizleme İşlemi
     * - Tüm sepet öğelerini kaldırır, başlangıç state'ine döner
     */
    case 'CLEAR_CART': {
      return initialState;
    }

    /**
     * Sepeti Yükleme İşlemi
     * - localStorage'dan gelen sepet verisini state'e yükler
     */
    case 'LOAD_CART': {
      return {
        ...state,
        items: action.payload,
        ...calculateTotals(action.payload), // Yüklenen veri için toplamları hesapla
      };
    }

    /**
     * Bilinmeyen Action Type'ı
     * - State'i değiştirmeden mevcut state'i döndür
     */
    default:
      return state;
  }
};
