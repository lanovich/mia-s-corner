import { cn } from "@/lib";
import React from "react";

interface Props {
  className?: string;
  fullPrice: number;
  cartDiscount: number;
  productTotalPrice: number;
}

export const InfoAboutCartPrice: React.FC<Props> = ({
  className,
  fullPrice,
  productTotalPrice,
  cartDiscount,
}) => {
  return (
    <div className={cn("pt-4 border-t", className)}>

      {/* Скидка и доставка */}
      <div className="pb-4 border-b">
        <div>
          <span className="text-sm">Стоимость товаров: </span>
          <span className="font-bold">{productTotalPrice} ₽</span>
        </div>
        <div>
          <span className="text-sm">Скидка: </span>
          <span className="font-bold">{cartDiscount} ₽</span>
        </div>
      </div>
      {/* Итоговая сумма
       */}
      <div className=" pt-4 flex justify-between text-lg font-medium">
        <span>Итого:</span>
        <span className="font-bold">{fullPrice} ₽</span>
      </div>
    </div>
  );
};
