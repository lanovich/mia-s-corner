import { UseFormRegister, FieldErrors } from "react-hook-form";
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

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const DeliveryForm = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold border-b pb-3 mt-3">Доставка</h2>
      <div className="mt-3 space-y-2">
        {/* <AddressInput /> */}
        <FormInput placeholder="Введите адрес для доставки" name="deliveryAddress" />
        <FormInput placeholder="Этаж" name="floor" type="number" />
        <FormInput placeholder="Комментарий к заказу" name="comment" />
      </div>
      <div className="mt-4 flex justify-end"></div>
    </div>
  );
};
