import { cn } from "@/lib";
import React from "react";
import { InputField } from "../ui";
import { BadgePercent, Tag } from "lucide-react";
import { SizeDetails } from "@/entities/product/model";

interface Props {
  className?: string;
  changedFields: Record<string, boolean>,
  currentSizeDetails: SizeDetails;
  handleInputChange: (field: keyof SizeDetails, value: any) => void
}

export const PriceInputs: React.FC<Props> = ({
  className,
  handleInputChange,
  changedFields,
  currentSizeDetails,
}) => {
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      <InputField
        label="Текущая цена"
        value={currentSizeDetails.price.toString()}
        onChange={(value) => handleInputChange("price", value)}
        placeholder="0.00"
        icon={<Tag className="h-4 w-4" />}
        unit="₽"
        isChanged={changedFields.price}
      />
      <InputField
        label="Старая цена"
        value={currentSizeDetails.oldPrice?.toString() || null}
        onChange={(value) => handleInputChange("oldPrice", value)}
        placeholder="0.00"
        icon={<BadgePercent className="h-4 w-4" />}
        unit="₽"
        isChanged={changedFields.oldPrice}
      />
    </div>
  );
};
