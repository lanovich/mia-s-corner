import { categoriesApi } from "@/entities/category/api";
import { ShopCarousel } from "./ShopCarousel";

export async function Shop() {
  const categoriesWithProducts =
    await categoriesApi.fetchCategoriesWithProducts();

  return <ShopCarousel categoriesWithProducts={categoriesWithProducts} />;
}
