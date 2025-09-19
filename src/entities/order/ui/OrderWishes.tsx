import React from "react";
import { AboutWishesTooltip } from "./AboutWishesTooltip";
import { FormTextarea } from "@/shared/ui";

interface Props {
  className?: string;
}

export const OrderWishes: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <div className="flex border-b pb-3">
        <h2 className="text-lg font-semibold">Пожелания к заказу </h2>
        <AboutWishesTooltip />
      </div>

      <div className="mt-3 space-y-2">
        <FormTextarea
          placeholder="Введите пожелания к заказу"
          className="resize-none"
          rows={7}
          name="wishes"
        />
      </div>
      <div className="mt-4 flex justify-end"></div>
    </div>
  );
};
