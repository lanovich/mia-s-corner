import { useCartStore } from "@/entities/cart/model/useCartStore";
import { calcFullPrice } from "@/shared/lib/calcFullPrice";
import { PriceCounter } from "./PriceCounter";
import { Skeleton } from "@/shared/shadcn-ui";
import { useDeliveryStore } from "@/entities/yandexDelivery/model/useDeliveryStore";

export const TotalAmount = () => {
  const { cart, productTotalAmount, isLoading, fullPrice } = useCartStore();
  const discount = calcFullPrice(productTotalAmount).discount;
  const { deliveryPrice } = useDeliveryStore();

  return (
    <div className="border border-gray-300 p-4 rounded-lg">
      {/* Стоимость товаров */}
      <PriceCounter
        type="products"
        amount={productTotalAmount}
        loading={isLoading}
      />
      {/* Скидка */}
      {discount > 0 && (
        <PriceCounter type="discount" amount={discount} loading={isLoading} />
      )}
      {/* Стоимость доставки */}
      <PriceCounter
        type="delivery"
        amount={deliveryPrice}
        loading={isLoading}
      />
      <div className="flex justify-between text-2xl font-semibold border-t pt-3 mt-3">
        <span>Итого:</span>
        {isLoading ? (
          <Skeleton className="w-32" />
        ) : (
          <span>{fullPrice + deliveryPrice} ₽</span>
        )}
      </div>
    </div>
  );
};
