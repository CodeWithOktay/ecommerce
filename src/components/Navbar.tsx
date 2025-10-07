'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav>
      <Link href="/">TrendSepet</Link>
      <Link href="/cart">🛒 {totalItems > 0 && <span>{totalItems}</span>}</Link>
    </nav>
  );
}
