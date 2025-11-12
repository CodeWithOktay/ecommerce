import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Props interface'i - arama çubuğu bileşeninin alacağı props'lar
interface SearchBarProps {
  onSearch?: (query: string) => void; // Opsiyonel: Arama yapıldığında çağrılacak callback fonksiyonu
}

/**
 * Arama Çubuğu Bileşeni
 * 
 * Ürün, marka ve kategori araması yapmak için kullanılan arama çubuğu.
 * Form submit edildiğinde search sayfasına yönlendirir.
 * Responsive tasarım ile mobil ve desktop uyumludur.
 */
export function SearchBar({ onSearch }: SearchBarProps) {
  // Arama input değeri state'i
  const [value, setValue] = useState('');
  // Next.js router'ı - sayfa yönlendirmesi için
  const router = useRouter();

  /**
   * Form submit işleyicisi
   * @param e - Form event'i
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Sayfa yenilenmesini engelle
    
    // Boş arama kontrolü
    if (!value.trim()) return;
    
    // Arama sayfasına yönlendir
    router.push(`/search?query=${encodeURIComponent(value)}`);
    
    // Opsiyonel callback fonksiyonunu çağır
    onSearch?.(value);
    
    // Input'u temizle (yorum satırı - isteğe bağlı)
    // setValue('');
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative w-full sm:w-96" // Responsive genişlik
    >
      {/* ✅ Arama İkonu - input'un solunda */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search 
          className="h-5 w-10 text-gray-400" 
          size={20} 
          aria-hidden="true" // Ekran okuyucular için gizle
        />
      </div>
      
      {/* ✅ Arama Input'u */}
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)} // Input değişikliklerini takip et
        placeholder="Ürün, marka veya kategori ara..."
        className="block w-full rounded-full border border-gray-200 bg-gray-100 py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 transition-colors focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
        aria-label="Arama yap" // Erişilebilirlik için etiket
      />
    </form>
  );
}