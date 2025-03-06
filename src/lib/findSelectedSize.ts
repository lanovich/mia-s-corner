export function findSelectedSize(product: Product, sizeId: number) {
  if (!product.sizes) {
    return null
  }
  return product.sizes.find((size) => size.id === sizeId) || null;
}
