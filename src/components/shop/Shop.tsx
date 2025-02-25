import { ShopCarousel } from "./ShopCarousel";
import { getCategoriesWithProducts } from "@/lib/cache";

export default async function Shop() {
  // TODO: сделать categoriesWithProductsAndSmells и отдавать всё в таком же формате
  const categoriesWithProducts = await getCategoriesWithProducts();

  return <ShopCarousel categories={categoriesWithProducts} />;
}
