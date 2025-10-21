// types/shipping.ts
export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryTime: string;
  freeShippingThreshold?: number;
}

export interface ReturnPolicy {
  id: string;
  title: string;
  description: string;
  duration: number;
  conditions: string[];
}
