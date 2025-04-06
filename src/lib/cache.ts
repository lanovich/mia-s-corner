"server-only";
import { unstable_cache } from "next/cache";
import { getCategories as fetchCategories } from "@/lib";
import { getCategoriesWithProducts as fetchCategoriesWithProducts } from "@/lib";
import { getProductsByCategory as fetchProducts } from "@/lib";
import { getProductWithHistory as fetchProductsWithHistories } from "@/lib";
import { getCategoryBySlug as fetchCategoryBySlug } from "@/lib";
import { getRandomSlugs as fetchRandomSlugs } from "@/lib";
import { getSimilarProducts as fetchSimilarProducts } from "@/lib";
import { getHistories as fetchHistories } from "@/lib";
import { getProductsByHistory as fetchProductsByHistory } from "@/lib";
import { getHistoryById as fetchHistoriesById } from "@/lib";

const REVALIDATE_TIME = 1;

export const getCategories = unstable_cache(fetchCategories, ["categories"], {
  revalidate: REVALIDATE_TIME,
});

export const getProductsByCategory = unstable_cache(
  fetchProducts,
  ["products_by_category"],
  {
    revalidate: REVALIDATE_TIME,
  }
);
export const getProductsByHistory = unstable_cache(
  fetchProductsByHistory,
  ["products_by_history"],
  {
    revalidate: REVALIDATE_TIME,
  }
);

export const getCategoriesWithProducts = unstable_cache(
  fetchCategoriesWithProducts,
  ["categories_and_products"],
  {
    revalidate: REVALIDATE_TIME,
  }
);

export const getProductWithHistory = unstable_cache(
  fetchProductsWithHistories,
  ["products_with_histories"],
  {
    revalidate: REVALIDATE_TIME,
  }
);

export const getCategoryBySlug = unstable_cache(
  fetchCategoryBySlug,
  ["category_by_slug"],
  {
    revalidate: REVALIDATE_TIME,
  }
);
export const getHistoryById = unstable_cache(
  fetchHistoriesById,
  ["history_by_id"],
  {
    revalidate: REVALIDATE_TIME,
  }
);

export const getRandomSlugs = unstable_cache(fetchRandomSlugs, ["slugs"], {
  revalidate: REVALIDATE_TIME,
});

export const getSimilarProducts = unstable_cache(
  fetchSimilarProducts,
  ["similarProducts"],
  { revalidate: REVALIDATE_TIME }
);

export const getHistories = unstable_cache(fetchHistories, ["histories"], {
  revalidate: REVALIDATE_TIME,
});
