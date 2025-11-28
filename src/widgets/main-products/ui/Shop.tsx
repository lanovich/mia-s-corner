import { apiFetchServer } from "@/shared/api/apiFetchServer";
import { API } from "@/shared/api";
import { ShopCarousel } from "./ShopCarousel";
import { GroupedShortProducts } from "@/entities/product/model";

export const dynamic = "force-dynamic";

export async function Shop() {
  const groupedProducts = await apiFetchServer<GroupedShortProducts[]>(
    API.products.getGroupedProducts,
    {
      revalidate: 3600,
      fallback: [],
    }
  );

  if (!Array.isArray(groupedProducts) || groupedProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 text-center text-gray-700">
        <h2 className="text-xl font-semibold mb-2">Товары недоступны</h2>
        <p>
          К сожалению, сейчас мы не можем показать товары. Попробуйте обновить
          страницу позже.
        </p>
      </div>
    );
  }

  return <ShopCarousel groupedProducts={groupedProducts} />;
}
