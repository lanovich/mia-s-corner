import { cn } from "@/shared/lib";
import React from "react";
import { InputField } from "../ui";
import { BadgePercent, Tag } from "lucide-react";
import { ProductSize } from "@/entities/product/model";

interface Props {
  className?: string;
  changedFields: Record<string, boolean>;
  currentSizeDetails: ProductSize;
  handleInputChange: (field: keyof ProductSize, value: number | null) => void;
}

export const PriceInputs: React.FC<Props> = ({
  className,
  handleInputChange,
  changedFields,
  currentSizeDetails,
}) => {
  const parseNumber = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  };

  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      <InputField
        label="Текущая цена"
        value={currentSizeDetails.price?.toString() || ""}
        onChange={(value) => handleInputChange("price", parseNumber(value))}
        placeholder="0.00"
        icon={<Tag className="h-4 w-4" />}
        unit="₽"
        isChanged={changedFields.price}
      />
      <InputField
        label="Старая цена"
        value={currentSizeDetails.oldPrice?.toString() || ""}
        onChange={(value) => handleInputChange("oldPrice", parseNumber(value))}
        placeholder="0.00"
        icon={<BadgePercent className="h-4 w-4" />}
        unit="₽"
        isChanged={changedFields.oldPrice}
      />
    </div>
  );
};
