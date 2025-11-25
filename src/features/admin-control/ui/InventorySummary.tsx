import { TotalsResponse } from "../model";
import { QuantityCard } from "./QuantityCard";

export interface InventorySummaryProps {
  totals: TotalsResponse | null;
}

export const InventorySummary = ({ totals }: InventorySummaryProps) => {
  if (!totals) return <div>Не смогли получить статистику</div>;

  return (
    <div className="w-full mb-5">
      <p className="text-gray-500 text-sm mb-2">Количество товара:</p>
      <div className="flex flex-row gap-4 flex-wrap">
        <QuantityCard
          label="Всего"
          value={totals.totalStockQuantity}
          endSymbol="шт"
          className="min-w-[180px]"
        />
        {totals.categories.map((categoryTotal, index) => (
          <QuantityCard
            key={`${categoryTotal.categoryName}-${index}`}
            label={categoryTotal.categoryName}
            endSymbol="шт"
            value={categoryTotal.totalQuantity}
            className="min-w-[180px]"
          />
        ))}
      </div>
      <div className="w-full mb-5">
        <p className="text-gray-500 text-sm mt-2">Общая стоимость: </p>
        <div className="w-full mb-2 flex flex-row gap-4 flex-wrap">
          <QuantityCard
            label="Всего"
            value={totals.totalAllProductsPrice}
            endSymbol="₽"
            className="min-w-[180px]"
          />
          {totals.categories.map((categoryTotal, index) => (
            <QuantityCard
              key={`${categoryTotal.categoryName}-${index}`}
              label={categoryTotal.categoryName}
              endSymbol="₽"
              value={categoryTotal.totalPrice}
              className="min-w-[180px]"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
