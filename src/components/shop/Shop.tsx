import { ShopCarousel } from "./ShopCarousel";
import { getCategoriesWithProducts } from "@/lib/cache";

export default async function Shop() {
  const categoriesWithProducts = await getCategoriesWithProducts();

  return <ShopCarousel categoriesWithProducts={categoriesWithProducts} />;
}
