"use client";
import { getDeliveryPrice } from "@/lib/getDeliveryPrice";
import { Button } from "../shadcn-ui/button";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "./FormTextarea";
import { cn } from "@/lib";
import { useMemo } from "react";
import { useDeliveryStore } from "@/store/useDeliveryStore";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  className?: string;
}

export const DeliveryForm: React.FC<Props> = ({ className }) => {
  const { setDeliveryPrice, deliveryPrice } = useDeliveryStore();
  const { watch } = useFormContext();

  const city = watch("city");
  const street = watch("street");
  const building = watch("building");
  const porch = watch("porch");
  const sfloor = watch("sfloor");
  const sflat = watch("sflat");

  const isAllFieldsFilled = useMemo(() => {
    return city && street && building && porch && sfloor && sflat;
  }, [city, street, building, porch, sfloor, sflat]);

  const handleGetDeliveryPrice = async () => {
    const deliveryData = await getDeliveryPrice({
      city: city,
      street: street,
      building: building,
      porch: porch,
      sfloor: sfloor,
      sflat: sflat,
    });

    if (deliveryData) {
      const deliveryPrice = Number(deliveryData.price.total_price);
      toast.success(`Стоимость доставки до вас: ${deliveryPrice} ₽`, {
        position: "top-center",
      });
      setDeliveryPrice(deliveryPrice);
    } else {
      toast.error(
        "Мы не смогли вас найти 😓, проверьте данные и повторите попытку",
        { position: "top-center" }
      );
    }
  };

  const handleResetAddress = () => {
    setDeliveryPrice(0);
    toast.info("Адрес сброшен. Вы можете ввести новый адрес.", {
      position: "top-center",
    });
  };

  return (
    <div className={cn("mb-4", className)}>
      <h2 className="text-lg font-semibold pb-3">Адрес для доставки</h2>
      <div className="space-y-2">
        {/* Город */}
        <FormInput
          placeholder="Город (СПб и ЛО)"
          name="city"
          defaultValue="Санкт-Петербург"
          disabled={!!deliveryPrice}
        />

        {/* Улица */}
        <FormInput
          placeholder="Улица"
          name="street"
          disabled={!!deliveryPrice}
        />

        {/* Номер здания */}
        <FormInput
          placeholder="Дом"
          name="building"
          disabled={!!deliveryPrice}
        />

        {/* Подъезд, этаж, квартира */}
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            placeholder="Подъезд"
            name="porch"
            type="number"
            disabled={!!deliveryPrice}
          />
          <FormInput
            placeholder="Этаж"
            name="sfloor"
            type="number"
            disabled={!!deliveryPrice}
          />
          <FormInput
            placeholder="Квартира"
            name="sflat"
            type="number"
            disabled={!!deliveryPrice}
          />
        </div>

        {/* Комментарий */}
        <FormTextarea
          placeholder="Комментарий для курьера (если у Вас частный дом, то укажите это здесь)"
          name="comment"
          disabled={!!deliveryPrice}
        />

        {/* Кнопка */}
        {deliveryPrice ? (
          <Button
            className="rounded-lg"
            type="button"
            onClick={handleResetAddress}
          >
            Изменить адрес
          </Button>
        ) : (
          <Button
            className="rounded-lg"
            type="button"
            onClick={handleGetDeliveryPrice}
            disabled={!isAllFieldsFilled}
          >
            Рассчитать стоимость доставки
          </Button>
        )}
      </div>
    </div>
  );
};
