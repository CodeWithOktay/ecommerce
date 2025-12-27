"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "@prisma/client";

interface HeroSliderProps {
  banners: Banner[];
}

export default function HeroSlider({ banners = [] }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrent((current) =>
        current === banners.length - 1 ? 0 : current + 1
      );
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrent(current === banners.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? banners.length - 1 : current - 1);
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-2xl shadow-xl group">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Arka Plan Resmi */}
          <div className="relative w-full h-full">
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              priority={index === 0}
              className="object-cover" // Resim her yeri kaplasın
            />
          </div>

          {/* Yazı İçeriği - SADECE BUTON KALDI */}
          <div className="absolute inset-0 flex items-end justify-start px-8 md:px-16 pb-12 md:pb-16">
            <div className="max-w-xl text-white space-y-4">
              {/* Sadece Link Varsa Buton Göster */}
              {banner.link && (
                <Link
                  href={banner.link}
                  className="inline-block px-8 py-3 bg-white text-[#764BA2] font-bold rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all transform duration-300"
                >
                  Şimdi Keşfet
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* OK TUŞLARI */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  current === idx
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
