import { Banknote, BadgePercent, Package } from "lucide-react";
import { Skeleton } from "@/shared/shadcn-ui";

interface PriceCounterProps {
  type: "products" | "discount" | "delivery";
  amount: number;
  loading: boolean;
}

export function PriceCounter({ type, amount, loading }: PriceCounterProps) {
  const iconMap = {
    products: <Banknote size={16} className="mt-1 mr-1" />,
    discount: <BadgePercent size={16} className="mt-1 mr-1 text-red-500" />,
    delivery: <Package size={16} className="mt-1 mr-1 text-gray-500" />,
  };

  const labelMap = {
    products: "Стоимость товаров:",
    discount: "Скидка:",
    delivery: "Стоимость доставки:",
  };

  const textColor =
    type === "discount"
      ? "text-red-500"
      : type === "delivery"
      ? "text-gray-500"
      : "text-black";

  return (
    <div className={`flex justify-between text-base ${textColor}`}>
      {iconMap[type]}
      <span>{labelMap[type]}</span>
      <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
      {loading ? (
        <Skeleton className="w-10 h-5" />
      ) : (
        <span>{`${amount} ₽`}</span>
      )}
    </div>
  );
}
