import { Product } from "@/entities/product/model";

export function findSelectedSize(product: Product, sizeId: number) {
  if (!product.product_sizes) {
    return null;
  }
  return product.product_sizes.find((size) => size.size_id === sizeId) || null;
}
