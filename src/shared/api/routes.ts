import { withQuery } from "./withQuery";

const BASE_API_URL = "/api";

const ADMIN_BASE = `${BASE_API_URL}/admin`;
const CART_BASE = `${BASE_API_URL}/cart`;
const CATEGORIES_BASE = `${BASE_API_URL}/categories`;
const HISTORIES_BASE = `${BASE_API_URL}/histories`;
const CHECKOUT_BASE = `${BASE_API_URL}/checkout`;
const ORDER_BASE = `${BASE_API_URL}/order`;
const PRODUCTS_BASE = `${BASE_API_URL}/products`;
const SIZES_BASE = `${BASE_API_URL}/sizes`;

export const API = {
  admin: {
    getProductSummary: `${ADMIN_BASE}/products`,
    updateProductSize: `${ADMIN_BASE}/product-sizes/update`,
    addProductSize: `${ADMIN_BASE}/product-sizes/add`,
    updateDescription: `${ADMIN_BASE}/products/update-description`,
    totals: `${ADMIN_BASE}/totals`,
    options: `${ADMIN_BASE}/options`,
    groupedFullProducts: `${ADMIN_BASE}/products/grouped-full-products`,
    productById: (id: number) => `${ADMIN_BASE}/products/${id}` as const,
  },
  cart: {
    add: `${CART_BASE}/add`,
    clear: `${CART_BASE}/clear`,
    decrease: `${CART_BASE}/decrease`,
    getItem: (productSizeId: number) =>
      `${CART_BASE}/item/${productSizeId}` as const,
    remove: `${CART_BASE}/remove`,
    getToken: `${CART_BASE}/token`,
    updatePrice: `${CART_BASE}/update-price`,
  },
  categories: {
    getCategories: `${CATEGORIES_BASE}`,
    getCategoriesWithProducts: `${CATEGORIES_BASE}/with-products`,
    getCategoryBySlug: (slug: string) => `${CATEGORIES_BASE}/${slug}` as const,
  },
  histories: {
    getHistories: `${HISTORIES_BASE}`,
    getHistoryById: (id: string) => `${HISTORIES_BASE}/${id}` as const,
  },
  checkout: {
    callback: `${CHECKOUT_BASE}/callback`,
    getDeliveryPrice: `${CHECKOUT_BASE}/get-delivery-price`,
  },
  order: {
    create: `${ORDER_BASE}/create`,
  },
  products: {
    getProducts: `${PRODUCTS_BASE}`,
    getGroupedProducts: `${PRODUCTS_BASE}/grouped`,
    getProductsByCategory: (categoryId: number) =>
      `${PRODUCTS_BASE}/by-category/${categoryId}` as const,
    getProductsByHistory: (historyId: string) =>
      `${PRODUCTS_BASE}/by-history/${historyId}` as const,
    getProduct: (categorySlug: string, productSlug: string) =>
      `${PRODUCTS_BASE}/${categorySlug}/${productSlug}` as const,
    getSimilarProducts: (historyId: number, productId: number): string =>
      withQuery(`${PRODUCTS_BASE}/similar-products`, { historyId, productId }),
    searchProduct: (query: string, category?: string): string =>
      withQuery(`${PRODUCTS_BASE}/search`, { query, category }),
  },
  sizes: {
    getSizesByCategory: (categoryName: string): string =>
      `${SIZES_BASE}/${categoryName}`,
    getSizes: `${SIZES_BASE}`,
  },
} as const;
