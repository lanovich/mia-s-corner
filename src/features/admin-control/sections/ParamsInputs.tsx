import React from "react";
import { InputField } from "../ui";
import { cn } from "@/shared/lib";
import { Box, Clock } from "lucide-react";
import { Product, ProductSize } from "@/entities/product/model";

interface Props {
  className?: string;
  currentSizeDetails: ProductSize;
  selectedProductData: Product;
  handleInputChange: (field: keyof ProductSize | "props", value: any) => void;
}

export const ParamsInputs: React.FC<Props> = ({
  className,
  handleInputChange,
  currentSizeDetails,
}) => {
  const timeOfExploitation = currentSizeDetails.props?.timeOfExploitation || "";

  const handleTimeChange = (value: string | number) => {
    handleInputChange("props", {
      ...currentSizeDetails.props,
      timeOfExploitation: Number(value),
    });
  };

  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      <InputField
        label="Количество на складе"
        value={String(currentSizeDetails.stock)}
        onChange={(value) => handleInputChange("stock", Number(value))}
        icon={<Box className="h-4 w-4" />}
        unit="шт"
        isChanged={false}
      />

      <InputField
        label="Срок службы"
        value={timeOfExploitation}
        onChange={handleTimeChange}
        placeholder="Например: 5 лет"
        icon={<Clock className="h-4 w-4" />}
        unit="часов"
        isChanged={false}
      />
    </div>
  );
};
