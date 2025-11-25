import { productsApi } from "@/entities/product/api";
import { ShopCarousel } from "./ShopCarousel";

export async function Shop() {
  const groupedProducts = await productsApi.fetchAllGroupedProducts();

  return <ShopCarousel groupedProducts={groupedProducts} />;
}
