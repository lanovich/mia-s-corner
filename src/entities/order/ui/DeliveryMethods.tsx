import { cn } from "@/shared/lib";
import {
  DeliveryMethod,
  useDeliveryStore,
} from "@/entities/yandexDelivery/model/useDeliveryStore";
import React from "react";
import { RadioButton } from "@/shared/ui";

interface Props {
  className?: string;
}

export const DeliveryMethods: React.FC<Props> = ({ className }) => {
  const {
    selectedDeliveryMethod,
    setselectedDeliveryMethod,
    setDeliveryPrice,
  } = useDeliveryStore();

  const handleToggleDeliveryPrice = (method: DeliveryMethod, price: number) => {
    setselectedDeliveryMethod(method);
    setDeliveryPrice(price);
  };

  return (
    <div className={cn("mt-3", className)}>
      <h2 className="text-lg font-semibold border-b pb-3">
        Как вы хотите получить заказ?
      </h2>
      <div className="space-y-2 mt-4">
        <RadioButton
          value="selfPickup"
          checked={selectedDeliveryMethod === "selfPickup"}
          onChange={() => handleToggleDeliveryPrice("selfPickup", 0)}
          label="Самовывоз из Кудрово — сразу после готовности"
          price="0 ₽"
        />
        <RadioButton
          value="fastDelivery"
          checked={selectedDeliveryMethod === "fastDelivery"}
          onChange={() => handleToggleDeliveryPrice("fastDelivery", 0)}
          label="Курьер по СПб и ЛО — в течение дня"
          price="от 199 ₽"
        />
        <RadioButton
          value="postalDelivery"
          checked={selectedDeliveryMethod === "postalDelivery"}
          onChange={() => handleToggleDeliveryPrice("postalDelivery", 179)}
          label="Пункт выдачи Яндекс Маркет — от 1 до 7 дней"
          price="179 ₽"
        />
      </div>
      <p className="text-xs text-gray-700 mt-3 ml-2">
        Сроки доставки указаны с момента готовности заказа. Если товар есть в
        наличии, он будет передан в доставку в тот же день. Максимальное время
        изготовления заказа — 3 дня.
      </p>
    </div>
  );
};
