import { CATEGORY_SLUG_MAP } from "@/constants/categorySlugMap";
import { supabase } from "./supabase";

interface ProductCategory {
  category_id: number;
  category_slug: string;
}

interface ProductSizeRow {
  id: number;
  quantity_in_stock: number;
  product_id: number;
  products: {
    id: number;
    title: string;
    compound: string;
    category_id: number;
    category_slug: string;
  } | null;
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
  const { data, error } = await supabase
    .from("product_sizes")
    .select(`
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
    `)
    .returns<ProductSizeRow[]>();

  if (error) {
    console.error(`❌ Ошибка загрузки количества товаров:`, error);
    return { 
      categories: [], 
      products: [],
      totalOfTotals: 0 
    };
  }

  const categoriesMap = new Map<number, CategoryQuantityResult>();
  const productsMap = new Map<number, ProductSummary>();

  data.forEach((item) => {
    if (!item.products) return;

    const product = item.products;
    
    const categoryKey = product.category_id;
    const currentCategory = categoriesMap.get(categoryKey) || {
      categoryId: product.category_id,
      categorySlug: product.category_slug,
      categoryName: CATEGORY_SLUG_MAP[product.category_slug] || product.category_slug,
      totalQuantity: 0
    };
    currentCategory.totalQuantity += item.quantity_in_stock;
    categoriesMap.set(categoryKey, currentCategory);

    const productKey = product.id;
    const currentProduct = productsMap.get(productKey) || {
      id: product.id,
      title: product.title,
      compound: product.compound,
      quantity: 0
    };
    currentProduct.quantity += item.quantity_in_stock;
    productsMap.set(productKey, currentProduct);
  });

  const categories = Array.from(categoriesMap.values());
  const products = Array.from(productsMap.values());
  
  const totalOfTotals = categories.reduce(
    (sum, item) => sum + item.totalQuantity,
    0
  );

  return {
    categories,
    products,
    totalOfTotals,
  };
};