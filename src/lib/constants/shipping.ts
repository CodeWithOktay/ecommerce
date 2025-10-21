// data/shippingData.ts
import { ReturnPolicy, ShippingMethod } from '@/types/shipping';

export const shippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standart Kargo',
    description: '3-5 iş günü içinde teslimat',
    price: 19.9,
    deliveryTime: '3-5 iş günü',
    freeShippingThreshold: 299,
  },
  {
    id: 'express',
    name: 'Express Kargo',
    description: '1-2 iş günü içinde teslimat',
    price: 39.9,
    deliveryTime: '1-2 iş günü',
  },
  {
    id: 'free',
    name: 'Ücretsiz Kargo',
    description: '299 TL ve üzeri alışverişlerde',
    price: 0,
    deliveryTime: '3-5 iş günü',
    freeShippingThreshold: 299,
  },
];

export const returnPolicies: ReturnPolicy[] = [
  {
    id: 'standard',
    title: '14 Gün İade Garantisi',
    description: 'Aldığınız ürünleri 14 gün içinde iade edebilirsiniz',
    duration: 14,
    conditions: [
      'Ürün orijinal ambalajında olmalı',
      'Etiketler çıkarılmamış olmalı',
      'Kullanılmamış olmalı',
      'Fatura aslı ile birlikte iade edilmeli',
    ],
  },
  {
    id: 'defective',
    title: 'Defolu Ürün Değişimi',
    description: 'Defolu gelen ürünlerde 30 gün değişim hakkı',
    duration: 30,
    conditions: [
      'Ürün fabrika hatası içermeli',
      'Teslimat tarihinden itibaren 30 gün geçmemiş olmalı',
      'Ürün kullanılmamış olmalı',
    ],
  },
];
