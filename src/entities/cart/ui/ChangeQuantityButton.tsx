"use client";
import { Button } from "@/shared/shadcn-ui";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import { LoadingIndicator } from "@/shared/ui";

interface Props {
  className?: string;
  type: "increase" | "decrease";
  quantity: number;
  maxQuantity?: number;
  onIncrease?: () => Promise<void> | void;
  onDecrease?: () => Promise<void> | void;
}

export const ChangeQuantityButton: React.FC<Props> = ({
  className,
  type,
  quantity,
  maxQuantity = 20,
  onIncrease,
  onDecrease,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const isDisabled =
    (type === "decrease" && quantity === 1) ||
    (type === "increase" && quantity === maxQuantity) ||
    isLoading;

  const handleClick = async () => {
    setIsLoading(true);

    try {
      if (type === "increase" && onIncrease && quantity < maxQuantity) {
        await onIncrease();
      } else if (type === "decrease" && onDecrease && quantity > 1) {
        await onDecrease();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isDisabled} className={className}>
      {isLoading ? (
        <LoadingIndicator isLoading={true} size={16} />
      ) : type === "increase" ? (
        <Plus />
      ) : (
        <Minus />
      )}
    </Button>
  );
};
