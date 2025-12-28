import { prisma } from "@/lib/db"; // Veya "@/lib/prisma" - hangisini kullanıyorsan
import ProductForm from "@/components/features/admin/products/product-form";
import { notFound } from "next/navigation";
import {
  Product,
  ProductAttributeValue,
  ProductVariant as PrismaProductVariant,
  ProductImage as PrismaProductImage,
} from "@prisma/client";

// --- TİP TANIMLAMALARI ---

type ProductWithRelations = Product & {
  attributeValues: ProductAttributeValue[];
  variants: (PrismaProductVariant & {
    // Schema'ya göre size/color string ama kodunda obje kontrolü vardı,
    // Garanti olsun diye ikisini de destekleyen tip yazdım.
    color?: { name: string; value: string } | string | null;
    size?: { name: string } | string | null;
  })[];
  images: PrismaProductImage[];
  stock?: number;
};

// Formun beklediği veri tipi
type ProductData = Omit<Product, "price" | "salePrice"> & {
  price: number;
  salePrice: number | null;
  attributeValues: ProductAttributeValue[];
  variants?: FormattedVariant[];
  images?: FormattedImage[];
  stock?: number;
};

// Next.js 15 İÇİN KRİTİK DÜZELTME: params artık bir PROMISE!
interface PageProps {
  params: Promise<{ id: string }>; // Dosya adın [id] olduğu için burası 'id' olmalı
}

interface FormattedVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  salePrice: number | null;
  image?: string | null;
  productId?: string;
}

interface FormattedImage {
  id: string;
  url: string;
  isMain: boolean;
}

export default async function EditProductPage({ params }: PageProps) {
  // 🟢 1. ADIM: params'ı await ile çözümlüyoruz
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  // 🟢 2. ADIM: Veriyi çekiyoruz
  const product = await prisma.product.findUnique({
    where: { id: id }, // Burada 'id' kullanıyoruz
    include: {
      images: true,
      variants: true,
      attributeValues: {
        include: {
          attribute: true, // Attribute isimlerini de çekmek gerekebilir
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Tip güvenliği için cast işlemi
  const typedProduct = product as unknown as ProductWithRelations;

  // 🟢 3. ADIM: Veriyi formatlıyoruz
  const formattedProduct: ProductData = {
    ...typedProduct,
    // Decimal to Number dönüşümleri (Formlar decimal sevmez)
    price: Number(typedProduct.price) || 0,
    salePrice: typedProduct.salePrice ? Number(typedProduct.salePrice) : null,
    stock: typedProduct.stock ?? 0,
    attributeValues: typedProduct.attributeValues || [],

    // Varyantları formatla
    variants: (typedProduct.variants || []).map((v) => ({
      id: v.id,
      // Eğer veritabanında obje ise ismini al, string ise direkt kendisini al
      size: v.size
        ? typeof v.size === "object" && v.size !== null
          ? (v.size as { name: string }).name
          : String(v.size)
        : "",
      color: v.color
        ? typeof v.color === "object" && v.color !== null
          ? (v.color as { name: string; value: string }).name
          : String(v.color)
        : "",
      stock: v.stock ?? 0,
      price: v.price ? Number(v.price) : 0,
      salePrice: v.salePrice ? Number(v.salePrice) : null,
      image: v.image || null,
      productId: v.productId,
    })),

    // Resimleri formatla
    images: (typedProduct.images || []).map((img) => ({
      id: img.id,
      url: img.url,
      isMain: img.isMain || false,
    })),
  };

  // Kategorileri ve markaları çek
  const categories = await prisma.category.findMany({
    include: {
      children: {
        include: {
          attributes: true,
          brands: true,
        },
      },
      brands: true,
      attributes: true,
    },
  });

  const brands = await prisma.brand.findMany();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ProductForm
        categories={categories}
        brands={brands}
        initialData={formattedProduct}
      />
    </div>
  );
}
