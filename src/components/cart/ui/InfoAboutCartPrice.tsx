import { cn } from "@/lib";
import React from "react";

interface Props {
  className?: string;
  totalAmount: number;
  cartDiscount: number;
  deliveryPrice: number;
}

export const InfoAboutCartPrice: React.FC<Props> = ({
  className,
  totalAmount,
  cartDiscount,
  deliveryPrice,
}) => {
  return (
    <div className={cn("pt-4 border-t", className)}>

      {/* Скидка и доставка */}
      <div className="pb-4 border-b">
        <div>
          <span className="text-sm">Скидка: </span>
          <span className="font-bold">{cartDiscount} ₽</span>
        </div>
        <div>
          <span className="text-sm">Доставка: </span>
          <span className="font-bold">{deliveryPrice} ₽</span>
        </div>
      </div>
      {/* Итоговая сумма
       */}
      <div className=" pt-4 flex justify-between text-lg font-medium">
        <span>Итого:</span>
        <span className="font-bold">{totalAmount} ₽</span>
      </div>
    </div>
  );
};
