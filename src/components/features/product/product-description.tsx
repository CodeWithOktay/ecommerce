"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  text: string | null;
}

/**
 * Ürün Açıklama Bileşeni
 * 
 * Uzun açıklamaları otomatik olarak kısaltır (Truncate).
 * "Daha Fazla Göster" butonu ile tamamını açar.
 */
export default function ProductDescription({ text }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const content = text || "Açıklama bulunmuyor.";
  // Kaç karakterden sonra kesilsin?
  const truncateLength = 200; 
  const isLongText = content.length > truncateLength;

  const displayContent = isExpanded 
    ? content 
    : (isLongText ? content.slice(0, truncateLength) + "..." : content);

  return (
    <div className="relative">
      <p className="text-gray-600 leading-relaxed transition-all duration-300">
        {displayContent}
      </p>

      {isLongText && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          {isExpanded ? (
            <>
              Daha Az Göster <ChevronUp size={16} />
            </>
          ) : (
            <>
              Daha Fazla Göster <ChevronDown size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}