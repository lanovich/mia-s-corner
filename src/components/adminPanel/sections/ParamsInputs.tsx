import React from "react";
import { InputField } from "..";
import { cn } from "@/lib";
import { Box, Clock, Ruler } from "lucide-react";
import { SizeDetails } from "@/types/SizeDetails";
import { CategoryProduct } from "@/types/CategoryProduct";

interface Props {
  className?: string;
  changedFields: Record<string, boolean>;
  currentSizeDetails: SizeDetails;
  productDataInSelectedCategory: CategoryProduct;
  handleInputChange: (field: keyof SizeDetails, value: any) => void;
}

export const ParamsInputs: React.FC<Props> = ({
  className,
  handleInputChange,
  changedFields,
  currentSizeDetails,
  productDataInSelectedCategory,
}) => {
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      <InputField
        label="Количество на складе"
        value={String(currentSizeDetails.quantity)}
        onChange={(value) => handleInputChange("quantity", value)}
        icon={<Box className="h-4 w-4" />}
        unit="шт"
        isChanged={changedFields.quantity}
      />

      <InputField
        label="Размер | Объем | Количество в наборе"
        value={currentSizeDetails.size}
        onChange={(value) => handleInputChange("size", value)}
        placeholder="Например: 40x60"
        icon={<Ruler className="h-4 w-4" />}
        unit={productDataInSelectedCategory.product.measure?.toString()}
        isChanged={changedFields.size}
      />

      <InputField
        label="Срок службы"
        value={currentSizeDetails.timeOfExploitation}
        onChange={(value) => handleInputChange("timeOfExploitation", value)}
        placeholder="Например: 5 лет"
        icon={<Clock className="h-4 w-4" />}
        unit="часов"
        isChanged={changedFields.timeOfExploitation}
      />
    </div>
  );
};
