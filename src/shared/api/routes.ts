const BASE_API_URL = "/api";

export const API_ROUTES = {
  categories: `${BASE_API_URL}/categories`,
  categoriesWithProducts: `${BASE_API_URL}/categories/with-products`,
  categoryBySlug: (slug: string) => `${BASE_API_URL}/categories/${slug}`,

  histories: `${BASE_API_URL}/histories`,
  historyById: (id: string) => `${BASE_API_URL}/histories/${id}`,

  allProducts: `${BASE_API_URL}/products`,
  allGroupedProducts: `${BASE_API_URL}/products/grouped`,
  productsByCategory: (categoryId: number) =>
    `${BASE_API_URL}/products/by-category/${categoryId}`,
  productsByHistory: (historyId: string) =>
    `${BASE_API_URL}/products/by-history/${historyId}`,
  product: (categorySlug: string, productSlug: string) =>
    `${BASE_API_URL}/products/${categorySlug}/${productSlug}`,
  similarProducts: (historyId: number, productId: number) =>
    `${BASE_API_URL}/products/similar-products?historyId=${historyId}&productId=${productId}`,

  addToCart: `${BASE_API_URL}/cart/add`,
  clearCart: `${BASE_API_URL}/cart/clear`,
  decreaseCart: `${BASE_API_URL}/cart/decrease`,
  loadCart: `${BASE_API_URL}/cart/load`,
  cartProduct: (productId: number) =>
    `${BASE_API_URL}/cart/product/${productId}`,
  removeFromCart: `${BASE_API_URL}/cart/remove`,
  userToken: `${BASE_API_URL}/cart/token`,
  updateCartPrice: `${BASE_API_URL}/cart/update-price`,

  adminProductsSummary: `${BASE_API_URL}/admin/products`,
  adminProductSizes: `${BASE_API_URL}/admin/product-sizes`,
  adminProductSizeAdd: `${BASE_API_URL}/admin/product-sizes/add`,
  adminProductUpdateDescription: `${BASE_API_URL}/admin/products/update-description`,
  sizesByCategory: (categoryName: string) =>
    `${BASE_API_URL}/sizes/${categoryName}`,
  sizes: `${BASE_API_URL}/sizes`,
};
