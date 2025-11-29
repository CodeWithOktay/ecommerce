// types/shipping.ts

/**
 * Kargo Yöntemi Interface'i
 * E-ticaret sisteminde kullanılan kargo seçeneklerini tanımlar
 */
export interface ShippingMethod {
  id: string; // Benzersiz kargo yöntemi ID'si (örnek: 'standard', 'express', 'free')
  name: string; // Kargo yöntemi adı (örnek: 'Standart Kargo', 'Express Kargo')
  description: string; // Kargo yöntemi açıklaması (örnek: '3-5 iş günü içinde teslimat')
  price: number; // Kargo ücreti (TL cinsinden)
  deliveryTime: string; // Tahmini teslimat süresi (örnek: '3-5 iş günü')
  freeShippingThreshold?: number; // Ücretsiz kargo eşik değeri (TL cinsinden, opsiyonel)
}

/**
 * İade Politikası Interface'i
 * Ürün iade ve değişim koşullarını tanımlar
 */
export interface ReturnPolicy {
  id: string; // Benzersiz iade politikası ID'si (örnek: 'standard', 'defective')
  title: string; // İade politikası başlığı (örnek: '14 Gün İade Garantisi')
  description: string; // İade politikası açıklaması
  duration: number; // İade süresi (gün cinsinden)
  conditions: string[]; // İade koşulları listesi
}
