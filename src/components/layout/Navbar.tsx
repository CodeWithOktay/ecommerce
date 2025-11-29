'use client';

import { useCart } from '@/context/cart';
import Link from 'next/link';

/**
 * Navbar Bileşeni
 *
 * Basit navigasyon bileşeni - logo ve sepet gösterimi
 * Sepet ürün sayısını context'ten alarak dinamik olarak gösterir
 */
export default function Navbar() {
  // Sepet context'inden toplam ürün adedini al
  const { totalItems } = useCart();

  return (
    <nav>
      {/* Ana sayfaya yönlendiren logo/link */}
      <Link href="/">KervanPazar</Link>

      {/* Sepet sayfasına yönlendiren link */}
      <Link href="/cart">
        {/* Sepet ikonu */}
        🛒
        {/* Sepette ürün varsa sayıyı göster */}
        {totalItems > 0 && <span>{totalItems}</span>}
      </Link>
    </nav>
  );
}
