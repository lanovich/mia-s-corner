import { ShopCarousel } from "./ShopCarousel";
import { getCategoriesWithProducts } from "@/lib/cache";

export async function Shop() {
  const categoriesWithProducts = await getCategoriesWithProducts();

  return <ShopCarousel categoriesWithProducts={categoriesWithProducts} />;
}
