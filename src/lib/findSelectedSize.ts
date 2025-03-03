export function findSelectedSize(product: Product, sizeId: number) {
  return product.sizes.find((size) => size.id === sizeId) || null;
}
