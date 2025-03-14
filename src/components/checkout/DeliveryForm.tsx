"use client";
import { FormInput } from "./FormInput";
import { AddressInput } from "../shared/AddressInput";

interface FormValues {
  name: string;
  phone: string;
  email: string;
  wishes: string;
  contactInfo: string;
  deliveryAddress: string;
  comment?: string | undefined;
}

export const DeliveryForm = () => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold border-b pb-3 mt-3">Доставка</h2>
      <div className="mt-3 space-y-2">
        <FormInput
          placeholder="Введите адрес для доставки"
          name="deliveryAddress"
          customInput={AddressInput}
        />
        <FormInput placeholder="Этаж" name="floor" type="number" />
        <FormInput placeholder="Комментарий доставщику" name="comment" />
      </div>
    </div>
  );
};
