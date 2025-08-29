import { CATEGORY_SLUG_MAP } from "@/entities/category/model";
import {
  CategoryQuantityResult,
  FinalResult,
  ProductInfo,
  ProductSizeRow,
  ProductSummary,
} from "@/features/admin-control/model";

const buildMaps = (productSizes: ProductSizeRow[]) => {
  const categoriesMap = new Map<number, CategoryQuantityResult>();
  const productsMap = new Map<string, ProductSummary>();

  productSizes.forEach((item) => {
    if (!item.products) return;

    updateCategoryMap(categoriesMap, item);
    updateProductMap(productsMap, item);
  });

  return { categoriesMap, productsMap };
};

export const processProductData = (
  productSizes: ProductSizeRow[]
): FinalResult => {
  const { categoriesMap, productsMap } = buildMaps(productSizes);
  const categories = Array.from(categoriesMap.values());
  const products = Array.from(productsMap.values());

  const totalOfTotals = calculateTotalQuantity(categories);

  const totalAllProductsPrice = calculateAllProductsPrice(productSizes);

  return { categories, products, totalOfTotals, totalAllProductsPrice };
};

const updateCategoryMap = (
  map: Map<number, CategoryQuantityResult>,
  item: ProductSizeRow
) => {
  const product = item.products!;
  const categoryKey = product.category_id;

  const currentCategory = map.get(categoryKey) || createNewCategory(product);
  currentCategory.totalQuantity += item.quantity_in_stock;
  currentCategory.totalPrice += item.price * item.quantity_in_stock;

  map.set(categoryKey, currentCategory);
};

const createNewCategory = (product: ProductInfo): CategoryQuantityResult => ({
  categoryId: product.category_id,
  categorySlug: product.category_slug,
  categoryName:
    CATEGORY_SLUG_MAP[product.category_slug] || product.category_slug,
  totalQuantity: 0,
  totalPrice: 0,
});

const updateProductMap = (
  map: Map<string, ProductSummary>,
  item: ProductSizeRow
) => {
  const product = item.products!;
  const productKey = product.title.toLowerCase().trim();

  const currentProduct = map.get(productKey) || createNewProduct(product);
  currentProduct.quantity += item.quantity_in_stock;

  currentProduct.id = product.id;

  map.set(productKey, currentProduct);
};

const createNewProduct = (product: ProductInfo): ProductSummary => ({
  id: product.id,
  title: product.title,
  compound: product.compound,
  quantity: 0,
});

const calculateTotalQuantity = (
  categories: CategoryQuantityResult[]
): number => {
  return categories.reduce((sum, item) => sum + item.totalQuantity, 0);
};

const calculateAllProductsPrice = (products: ProductSizeRow[]): number => {
  return products.reduce(
    (sum, item) => sum + item.price * item.quantity_in_stock,
    0
  );
};

export const getEmptyResult = (): FinalResult => ({
  categories: [],
  products: [],
  totalOfTotals: 0,
  totalAllProductsPrice: 0,
});
