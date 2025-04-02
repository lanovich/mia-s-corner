import { CATEGORY_SLUG_MAP } from "@/constants/categorySlugMap";
import { supabase } from "./supabase";
interface ProductSizeRow {
  id: number;
  quantity_in_stock: number;
  product_id: number;
  products: Product | null;
}

interface Product {
  id: number;
  title: string;
  compound: string;
  category_id: number;
  category_slug: string;
}

interface CategoryQuantityResult {
  categoryId: number;
  categorySlug: string;
  categoryName: string;
  totalQuantity: number;
}

interface ProductSummary {
  id: number;
  title: string;
  compound: string;
  quantity: number;
}

interface FinalResult {
  categories: CategoryQuantityResult[];
  products: ProductSummary[];
  totalOfTotals: number;
}

export const getTotalProductQuantity = async (): Promise<FinalResult> => {
  try {
    const productSizes = await fetchProductSizes();
    return processProductData(productSizes);
  } catch (error) {
    console.error("❌ Ошибка загрузки количества товаров:", error);
    return getEmptyResult();
  }
};

const fetchProductSizes = async (): Promise<ProductSizeRow[]> => {
  const { data, error } = await supabase
    .from("product_sizes")
    .select(
      `
      id,
      quantity_in_stock,
      product_id,
      products:products!product_id (
        id,
        title,
        compound,
        category_id,
        category_slug
      )
    `
    )
    .returns<ProductSizeRow[]>();

  if (error) throw error;
  return data || [];
};

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

const processProductData = (productSizes: ProductSizeRow[]): FinalResult => {
  const { categoriesMap, productsMap } = buildMaps(productSizes);
  const categories = Array.from(categoriesMap.values());
  const products = Array.from(productsMap.values());

  const totalOfTotals = calculateTotalQuantity(categories);

  return { categories, products, totalOfTotals };
};

const updateCategoryMap = (
  map: Map<number, CategoryQuantityResult>,
  item: ProductSizeRow
) => {
  const product = item.products!;
  const categoryKey = product.category_id;

  const currentCategory = map.get(categoryKey) || createNewCategory(product);
  currentCategory.totalQuantity += item.quantity_in_stock;

  map.set(categoryKey, currentCategory);
};

const createNewCategory = (product: Product): CategoryQuantityResult => ({
  categoryId: product.category_id,
  categorySlug: product.category_slug,
  categoryName:
    CATEGORY_SLUG_MAP[product.category_slug] || product.category_slug,
  totalQuantity: 0,
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

const createNewProduct = (product: Product): ProductSummary => ({
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

const getEmptyResult = (): FinalResult => ({
  categories: [],
  products: [],
  totalOfTotals: 0,
});
