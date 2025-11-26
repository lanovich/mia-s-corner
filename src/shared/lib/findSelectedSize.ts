import { Product, ShortProduct } from "@/entities/product/model";

export function findSelectedSize(product: ShortProduct, productSizeId: number) {
  if (!product?.size) return null;

  return product.size.id === productSizeId || null;
}
