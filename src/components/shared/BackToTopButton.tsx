'use client';

import { ArrowUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Başa Dön Butonu Bileşeni
 *
 * Kullanıcı sayfayı aşağı kaydırdığında görünen, tıklandığında
 * sayfanın en üstüne hızlıca dönmeyi sağlayan floating buton.
 */
export function BackToTopButton() {
  // Butonun görünürlük durumu state'i
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Scroll olayını dinleyen useEffect
   * Kullanıcı 300px'den fazla kaydırdığında butonu gösterir
   */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Scroll event listener'ı ekle
    window.addEventListener('scroll', handleScroll);

    // Cleanup: Component unmount olduğunda event listener'ı kaldır
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Buton görünür değilse null döndür (render etme)
  if (!isVisible) return null;

  return (
    <Link
      href={'#top'}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in"
      aria-label="Başa Dön"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      <span>Başa Dön</span> <ArrowUp size={24} />
    </Link>
  );
}
