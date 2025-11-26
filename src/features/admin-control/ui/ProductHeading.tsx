import React from "react";
import { ProductOption } from "./SelectProductField";
import { Product } from "@/entities/product/model";
import { cn } from "@/shared/lib";

interface Props {
  className?: string;
  selectedProductData: Product | null;
  selectedOption: ProductOption | null;
}

export const ProductHeading: React.FC<Props> = ({
  className,
  selectedProductData,
  selectedOption,
}) => {
  const title =
    selectedProductData?.title || selectedOption?.title || "Продукт";
  const category = selectedProductData?.category.name || "Без категории";
  const scent = selectedOption?.scentName
    ? `(${selectedOption.scentName})`
    : "";
  const quantity = selectedOption?.quantity ?? 0;

  return (
    <div className={cn(className, "flex justify-between")}>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-md mb-2 justify-between">
          {category} {scent && <span>{scent} </span>}
        </span>
      </div>
      <div className="text-sm text-gray-500 items-center flex">
        <span>Количество: {quantity}</span>
      </div>
    </div>
  );
};
