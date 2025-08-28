import { useCartStore } from "@/store/useCartStore";
import { calcFullPrice } from "@/lib/calcFullPrice";
import { PriceCounter } from "./PriceCounter";
import { Skeleton } from "@/shared/shadcn-ui";
import { useDeliveryStore } from "@/store/useDeliveryStore";

export const TotalAmount = () => {
  const productTotalAmount = useCartStore((state) => state.productTotalAmount);
  const discount = calcFullPrice(productTotalAmount).discount;
  const fullPrice = useCartStore((state) => state.fullPrice);
  const loading = useCartStore((state) => state.loading);
  const { deliveryPrice } = useDeliveryStore();

  return (
    <div className="border border-gray-300 p-4 rounded-lg">
      {/* Стоимость товаров */}
      <PriceCounter
        type="products"
        amount={productTotalAmount}
        loading={loading}
      />
      {/* Скидка */}
      {discount > 0 && (
        <PriceCounter type="discount" amount={discount} loading={loading} />
      )}
      {/* Стоимость доставки */}
      <PriceCounter type="delivery" amount={deliveryPrice} loading={loading} />
      <div className="flex justify-between text-2xl font-semibold border-t pt-3 mt-3">
        <span>Итого:</span>
        {loading ? (
          <Skeleton className="w-32" />
        ) : (
          <span>{fullPrice + deliveryPrice} ₽</span>
        )}
      </div>
    </div>
  );
};
