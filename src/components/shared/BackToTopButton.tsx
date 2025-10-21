'use client';

import { ArrowUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <Link
      href={'#top'}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in"
      aria-label="Başa Dön"
    >
      <span>Başa Dön</span> <ArrowUp size={24} />
    </Link>
  );
}
