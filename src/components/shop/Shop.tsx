import { getCategoriesWithProductsAndSmells } from "@/lib/getCategoriesWithProductsAndSmells";
import { ShopCarousel } from "./ShopCarousel";
import { getCategoriesWithProducts } from "@/lib/cache";

export default async function Shop() {
  // TODO: сделать categoriesWithProductsAndSmells и отдавать всё в таком же формате
  const categoriesWithProducts = await getCategoriesWithProducts();
  const categoriesWithProductsAndSmells = await getCategoriesWithProductsAndSmells();

  return <ShopCarousel categories={categoriesWithProducts} />;
}
