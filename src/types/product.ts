import {
  Product,
  Category,
  ProductImage,
  ProductVariant,
  Prisma,
} from "@prisma/client";

/**
 * İlişkili Ürün Tipi
 * 
 * Prisma'dan çekilen ham Ürün verisinin, ilişkili tablolarla (Category, Image, Variant)
 * birleştirilmiş halini temsil eder. Frontend'de ürün detaylarını göstermek için kullanılır.
 */
export type ProductWithRelations = Product & {
  categories: Category[];
  images: ProductImage[];
  variants: (ProductVariant & {
    size: { name: string };
    color: { name: string; value: string };
  })[];
};

/**
 * Ürün Form Değerleri
 * 
 * Ürün ekleme/düzenleme formlarında kullanılan veri yapısı.
 * - Prisma'nın otomatik ürettiği alanları (id, createdAt vb.) hariç tutar.
 * - Resim, Kategori ve Varyant gibi ilişkisel verileri form formatına uygun hale getirir.
 */
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
