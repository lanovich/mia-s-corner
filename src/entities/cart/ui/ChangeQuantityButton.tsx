import { Button } from "@/shared/shadcn-ui";
import { Minus, Plus } from "lucide-react";
import React from "react";

interface Props {
  className?: string;
  type: "increase" | "decrease";
  quantity: number;
  maxQuantity?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
}

export const ChangeQuantityButton: React.FC<Props> = ({
  className,
  type,
  quantity,
  maxQuantity = 20,
  onIncrease,
  onDecrease,
}) => {
  const isDisabled =
    (type === "decrease" && quantity === 1) ||
    (type === "increase" && quantity === maxQuantity);

  const handleClick = () => {
    if (type === "increase" && onIncrease && quantity < maxQuantity) {
      onIncrease();
    } else if (type === "decrease" && onDecrease && quantity > 1) {
      onDecrease();
    }
  };

  return (
    <Button onClick={handleClick} disabled={isDisabled} className={className}>
      {type === "increase" ? <Plus /> : <Minus />}
    </Button>
  );
};
