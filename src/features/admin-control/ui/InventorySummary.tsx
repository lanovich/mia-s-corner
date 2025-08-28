import { QuantityCard } from "./QuantityCard";

interface InventorySummaryProps {
  totals: {
    categories: {
      categoryName: string;
      totalQuantity: number;
      totalPrice: number;
    }[];
    totalOfTotals: number;
    totalAllProductsPrice: number;
  };
}

export const InventorySummary = ({ totals }: InventorySummaryProps) => (
  <div className="w-full mb-5">
    <p className="text-gray-500 text-sm mb-2">Количество товара:</p>
    <div className="flex flex-row gap-4 flex-wrap">
      <QuantityCard
        label="Всего"
        value={totals.totalOfTotals}
        endSymbol="шт"
        className="min-w-[180px]"
      />
      {totals.categories.map((total, index) => (
        <QuantityCard
          key={`${total.categoryName}-${index}`}
          label={total.categoryName}
          endSymbol="шт"
          value={total.totalQuantity}
          className="min-w-[180px]"
        />
      ))}
    </div>
    <div className="w-full mb-5">
      <p className="text-gray-500 text-sm mt-2">Общая стоимость: </p>
      <div className="w-full mb-2 flex flex-row gap-4 flex-wrap">
        <QuantityCard
          label={"Всего "}
          value={totals.totalAllProductsPrice}
          endSymbol="₽"
          className="min-w-[180px]"
        />
        {totals.categories.map((total, index) => (
          <QuantityCard
            key={`${total.categoryName}-${index}`}
            label={total.categoryName}
            endSymbol="₽"
            value={total.totalPrice}
            className="min-w-[180px]"
          />
        ))}
      </div>
    </div>
  </div>
);
