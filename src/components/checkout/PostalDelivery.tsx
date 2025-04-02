"use client";
import { useDeliveryStore } from "@/store/useDeliveryStore";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "./FormTextarea";
import { cn } from "@/lib";

interface Props {
  className?: string;
}

export const PostalDelivery: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("mb-4", className)}>
      <h2 className="text-lg font-semibold pb-3">Адрес пункта выдачи</h2>
      <div className="space-y-2">
        {/* Город */}
        <FormInput
          placeholder="Город"
          name="city"
          defaultValue="Санкт-Петербург"
        />

        {/* Улица */}
        <FormInput placeholder="Улица" name="street" />

        {/* Номер здания */}
        <FormInput placeholder="Дом" name="building" />
      </div>
    </div>
  );
};
