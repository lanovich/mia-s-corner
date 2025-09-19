"use client";
import { getDeliveryPrice } from "@/entities/yandexDelivery/api/getDeliveryPrice";
import { Button } from "@/shared/shadcn-ui";
import { FormInput, FormTextarea } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useMemo } from "react";
import { useDeliveryStore } from "@/entities/yandexDelivery/model/useDeliveryStore";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  className?: string;
}

export const DeliveryForm: React.FC<Props> = ({ className }) => {
  const { setDeliveryPrice, deliveryPrice, setOpenSubmit, openSubmit } =
    useDeliveryStore();
  const { watch } = useFormContext();

  const city = watch("city");
  const street = watch("street");
  const building = watch("building");
  const porch = watch("porch");
  const sfloor = watch("sfloor");
  const sflat = watch("sflat");

  const isAllFieldsFilled = useMemo(() => {
    return city && street && building;
  }, [city, street, building, porch, sfloor, sflat]);

  const handleGetDeliveryPrice = async () => {
    const deliveryData = await getDeliveryPrice({
      city,
      street,
      building,
    });

    if (deliveryData) {
      const deliveryPrice = Number(deliveryData.price.total_price);
      toast.success(`Стоимость доставки до вас: ${deliveryPrice} ₽`, {
        position: "top-center",
      });
      setDeliveryPrice(deliveryPrice);

      setOpenSubmit(true);
    } else {
      toast.error(
        "Мы не смогли вас найти 😓, проверьте данные и повторите попытку",
        { position: "top-center" }
      );
      setOpenSubmit(false);
    }
  };

  const handleResetAddress = () => {
    setDeliveryPrice(0);
    setOpenSubmit(false);
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
          defaultValue=""
          disabled={openSubmit}
        />

        {/* Улица */}
        <FormInput placeholder="Улица" name="street" disabled={openSubmit} />

        {/* Номер здания */}
        <FormInput placeholder="Дом" name="building" disabled={openSubmit} />

        {/* Подъезд, этаж, квартира */}
        <div className="grid grid-cols-3 gap-4">
          <FormInput placeholder="Подъезд" name="porch" type="number" />
          <FormInput placeholder="Этаж" name="sfloor" type="number" />
          <FormInput placeholder="Квартира" name="sflat" type="number" />
        </div>

        {/* Комментарий */}
        <FormTextarea
          placeholder="Комментарий для курьера (если у Вас частный дом, то укажите это здесь)"
          name="comment"
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
