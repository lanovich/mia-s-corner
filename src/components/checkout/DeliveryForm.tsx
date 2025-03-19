"use client";
import { FormInput } from "./FormInput";
import { AddressInput } from "../shared/AddressInput";
import { FormTextarea } from "./FormTextarea";
import { cn } from "@/lib";

interface Props {
  className?: string;
}

export const DeliveryForm: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("mb-4", className)}>
      <h2 className="text-lg font-semibold pb-3">Доставка</h2>
      <div className="space-y-2">
        <FormInput
          placeholder="Введите адрес для доставки (город, улица, дом)"
          name="deliveryAddress"
          customInput={AddressInput}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormInput placeholder="Подъезд" name="entrance" type="number" />
          <FormInput placeholder="Этаж" name="floor" type="number" />
          <FormInput placeholder="Квартира" name="apartment" type="number" />
        </div>

        <FormTextarea placeholder="Комментарий доставщику" name="comment" />
      </div>
    </div>
  );
};
