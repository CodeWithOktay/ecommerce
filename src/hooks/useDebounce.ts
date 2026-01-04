/**
 * Debounce Hook
 * 
 * Hızlı değişen değerleri geciktirerek performans optimizasyonu sağlar.
 * Özellikle arama inputlarında API çağrılarını azaltmak için kullanılır.
 * 
 * @example
 * const searchTerm = "laptop";
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * // debouncedSearch, kullanıcı yazmayı bıraktıktan 500ms sonra güncellenir
 */

import { useState, useEffect } from "react";

/**
 * Debounce Hook
 * 
 * @param value - Geciktirilecek değer
 * @param delay - Gecikme süresi (milisaniye)
 * @returns Geciktirilmiş değer
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Değer değiştiğinde timer başlat
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: Yeni değer gelirse önceki timer'ı iptal et
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
