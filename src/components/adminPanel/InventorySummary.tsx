import { QuantityCard } from "./QuantityCard";

interface InventorySummaryProps {
  totals: {
    categories: {
      categoryName: string;
      totalQuantity: number;
    }[];
    totalOfTotals: number;
  };
}

export const InventorySummary = ({ totals }: InventorySummaryProps) => (
  <div className="w-full mb-5">
    <p className="text-gray-500 text-sm mb-2">Количество товара:</p>
    <div className="flex flex-row gap-4 flex-wrap">
      <QuantityCard
        label="Всего"
        value={totals.totalOfTotals}
        className="min-w-[180px]"
      />
      {totals.categories.map((total, index) => (
        <QuantityCard
          key={`${total.categoryName}-${index}`}
          label={total.categoryName}
          value={total.totalQuantity}
          className="min-w-[180px]"
        />
      ))}
    </div>
  </div>
);
