'use client';

import { useCart } from '@/context/cart';
import Link from 'next/link';
export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav>
      <Link href="/">KervanPazar</Link>
      <Link href="/cart">🛒 {totalItems > 0 && <span>{totalItems}</span>}</Link>
    </nav>
  );
}
