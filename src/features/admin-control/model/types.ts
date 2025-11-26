export interface ProductSizeRow {
  id: number;
  quantity_in_stock: number;
  price: number;
  product_id: number;
  products: ProductInfo | null;
}

export interface ProductInfo {
  id: number;
  title: string;
  compound: string;
  category_id: number;
  category_slug: string;
}

export interface CategoryQuantityResult {
  categoryId: number;
  categorySlug: string;
  categoryName: string;
  totalPrice: number;
  totalQuantity: number;
}

export interface ProductSummary {
  id: number;
  title: string;
  compound: string;
  quantity: number;
}

export interface FinalResult {
  categories: CategoryQuantityResult[];
  products: ProductSummary[];
  totalAllProductsPrice: number;
  totalOfTotals: number;
}

export interface TotalsResponse {
  totalStockQuantity: number;
  totalAllProductsPrice: number;
  categories: CategoryTotals[];
}

export interface CategoryTotals {
  categoryName: string;
  totalQuantity: number;
  totalPrice: number;
}
