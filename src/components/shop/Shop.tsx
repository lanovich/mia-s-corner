import { ShopCarousel } from "./ShopCarousel";
import { getCategoriesWithProducts } from "./lib";

export default async function Shop() {
  const categories = await getCategoriesWithProducts();

  return <ShopCarousel cats={categories} />;
}
