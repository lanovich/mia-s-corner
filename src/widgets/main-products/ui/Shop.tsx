import { ShopCarousel } from "./ShopCarousel";
import { getCategoriesWithProducts } from "@/shared/api/queries";

export async function Shop() {
  const categoriesWithProducts = await getCategoriesWithProducts();

  return <ShopCarousel categoriesWithProducts={categoriesWithProducts} />;
}
