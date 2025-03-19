import { cn } from "@/lib";
import { useDeliveryStore } from "@/store/useDeliveryStore";
import React from "react";

interface Props {
  className?: string;
}

export const DeliveryMethods: React.FC<Props> = ({ className }) => {
  const { selectedMethod, setSelectedMethod } = useDeliveryStore();

  return (
    <div className={cn("mt-3", className)}>
      <h2 className="text-lg font-semibold border-b pb-3">
        Как вы хотите получить заказ?
      </h2>
      <div className="space-y-4 mt-4">
        <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <input
            type="radio"
            value="selfPickup"
            checked={selectedMethod === "selfPickup"}
            onChange={() => setSelectedMethod("selfPickup")}
            className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">
            Самовывоз из Кудрово — сразу после готовности
          </span>
        </label>
        <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <input
            type="radio"
            value="fastDelivery"
            checked={selectedMethod === "fastDelivery"}
            onChange={() => setSelectedMethod("fastDelivery")}
            className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">
            Курьерская доставка по Санкт-Петербургу и ЛО — в течение дня
          </span>
        </label>
        {/* <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <input
            type="radio"
            value="postalDelivery"
            checked={selectedMethod === "postalDelivery"}
            onChange={() => setSelectedMethod("postalDelivery")}
            className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">
            Доставка почтой по России — от 2 до 7 дней
          </span>
        </label> */}
      </div>
      <p className="text-xs text-gray-700 mt-3 ml-2">
        Сроки доставки указаны с момента готовности заказа. Если товар есть в
        наличии, он будет передан в доставку в тот же день. Максимальное время
        изготовления заказа — 3 дня.
      </p>
    </div>
  );
};
