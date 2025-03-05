import "server-only";
import { unstable_cache } from "next/cache";
import { getCategories as fetchCategories } from "@/lib";
import { getCategoriesWithProducts as fetchCategoriesWithProducts } from "@/lib";
import { getProductsByCategory as fetchProducts } from "@/lib";
import { getProductWithHistory as fetchProductsWithHistories } from "@/lib";
import { getCategoryBySlug as fetchCategoryBySlug } from "@/lib";
import { getRandomSlugs as fetchRandomSlugs } from "@/lib";
import { getSimilarProducts as fetchSimilarProducts } from "@/lib";

export const getCategories = unstable_cache(fetchCategories, ["categories"], {
  revalidate: 3600,
});

export const getProductsByCategory = unstable_cache(
  fetchProducts,
  ["products"],
  {
    revalidate: 3600,
  }
);

export const getCategoriesWithProducts = unstable_cache(
  fetchCategoriesWithProducts,
  ["categories_and_products"],
  {
    revalidate: 3600,
  }
);

export const getProductWithHistory = unstable_cache(
  fetchProductsWithHistories,
  ["products_with_histories"],
  {
    revalidate: 3600,
  }
);

export const getCategoryBySlug = unstable_cache(
  fetchCategoryBySlug,
  ["category_by_slug"],
  {
    revalidate: 3600,
  }
);

export const getRandomSlugs = unstable_cache(fetchRandomSlugs, ["slugs"], {
  revalidate: 3600,
});

export const getSimilarProducts = unstable_cache(
  fetchSimilarProducts,
  ["similarProducts"],
  { revalidate: 3600 }
);
