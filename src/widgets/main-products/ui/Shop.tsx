import { getCategoriesWithProducts } from "@/entities/category/api";
import { ShopCarousel } from "./ShopCarousel";

export async function Shop() {
  const categoriesWithProducts = await getCategoriesWithProducts();

  return <ShopCarousel categoriesWithProducts={categoriesWithProducts} />;
}
