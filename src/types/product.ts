import {
  Product,
  Category,
  ProductImage,
  ProductVariant,
  Prisma,
} from "@prisma/client";

export type ProductWithRelations = Product & {
  categories: Category[];
  images: ProductImage[];
  variants: (ProductVariant & {
    size: { name: string };
    color: { name: string; value: string };
  })[];
};

export type ProductFormValues = Omit<
  Prisma.ProductCreateInput,
  "id" | "createdAt" | "updatedAt" | "images" | "variants" | "categories"
> & {
  images: { url: string; isMain?: boolean }[];
  categories: string[];
  variants: {
    name: string;
    price: number;
    stock: number;
    sku: string;
    size?: string;
    color?: { name: string; value: string };
  }[];
};
