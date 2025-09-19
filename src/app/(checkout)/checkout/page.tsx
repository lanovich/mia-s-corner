"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/shared/ui";
import {
  OrderSummary,
  ContactInfo,
  DeliveryForm,
  TotalAmount,
  PaymentMethods,
  OrderWishes,
  DeliveryMethods,
  SelfPickup,
  PostalDelivery,
} from "@/entities/order/ui";
import { FormProvider, useForm } from "react-hook-form";
import {
  CheckoutFormValues,
  schema,
} from "@/entities/order/model/checkoutFormSchema";
import { toast } from "sonner";
import { useCartStore } from "@/entities/cart/model/useCartStore";
import { useDeliveryStore } from "@/entities/yandexDelivery/model/useDeliveryStore";
import { Button } from "@/shared/shadcn-ui";
import { orderApi } from "@/entities/order/api";

export default function CheckoutPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "cash">(
    "transfer"
  );
  const { isLoading, fullPrice, clearCart } = useCartStore();
  const {
    deliveryPrice,
    setDeliveryPrice,
    openSubmit,
    selectedDeliveryMethod,
  } = useDeliveryStore();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      deliveryMethod: "fastDelivery",
      name: "",
      phone: "",
      email: "",

      city: "",
      street: "",
      building: "",
      porch: "",
      sfloor: "",
      sflat: "",
      comment: "",

      wishes: "",
    },
  });
  const { setValue } = form;

  useEffect(() => {
    return setValue("deliveryMethod", selectedDeliveryMethod);
  }, [selectedDeliveryMethod, setValue]);

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      if (fullPrice === 0) {
        toast.error("Корзина пустая, не удалось создать заказ", {
          position: "top-center",
        });
        throw new Error("Корзина пустая, не удалось создать заказ");
      }

      setSubmitting(true);

      const { paymentUrl, success, error } = await orderApi.createOrder(
        data,
        deliveryPrice
      );

      if (!success || !paymentUrl) {
        toast.error("Не удалось получить платежную ссылку");
        throw new Error(error || "Не удалось получить платежную ссылку");
      }

      console.log("Платежная ссылка получена:", paymentUrl);
      router.push(paymentUrl);

      await clearCart();
      setDeliveryPrice(0);

      router.push(paymentUrl);
    } catch (error) {
      console.error("Ошибка при создании заказа", error);
      toast.error("Не удалось создать заказ!", {
        position: "top-center",
        description:
          error instanceof Error ? error.message : "Попробуйте еще раз",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="min-h-screxen max-w-5xl bg-white text-black py-8 px-4 overflow-visible">
      <div className="mx-auto flex flex-col md:flex-row gap-10">
        <div className="md:w-3/5 space-y-6">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="orderForm">
              <div className="space-y-6">
                <ContactInfo className="p-2 bg-white rounded-lg shadow-sm" />
                <DeliveryMethods className="p-2 bg-white rounded-lg shadow-sm" />
                {selectedDeliveryMethod === "selfPickup" ? (
                  <SelfPickup className="p-2 bg-white rounded-lg shadow-sm" />
                ) : selectedDeliveryMethod === "fastDelivery" ? (
                  <DeliveryForm className="p-2 bg-white rounded-lg shadow-sm" />
                ) : (
                  <PostalDelivery className="p-2 bg-white rounded-lg shadow-sm" />
                )}
                <OrderWishes className="p-2 bg-white rounded-lg shadow-sm" />
                <OrderSummary className="p-2 bg-white rounded-lg shadow-sm" />
              </div>
            </form>
          </FormProvider>
        </div>
        <div className="w-full md:w-2/5 space-y-6 sticky top-16 self-start">
          <h1 className="text-xl font-semibold border-b pb-3">
            Оплата и подтверждение
          </h1>

          <TotalAmount />
          <PaymentMethods
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800 leading-snug">
              <span className="font-semibold text-blue-800">
                Если вы столкнулись с ошибкой при оформлении
              </span>
              <ol className="list-decimal list-inside space-y-1.5 mt-1.5 pl-1 marker:text-blue-800">
                <li className="pl-1">Нажмите "Очистить корзину"</li>
                <li className="pl-1">Добавьте товары заново</li>
                <li className="pl-1">Повторите попытку оформления</li>
              </ol>
              <div className="mt-2 text-blue-800">
                Cообщите нам в
                <a
                  href="https://t.me/mias_corner_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 ml-1 font-bold"
                >
                  поддержку
                </a>
                — это поможет сделать сервис лучше.
              </div>
            </div>
          </div>

          <div>
            <Button
              loading={isLoading}
              className="w-full bg-black text-white rounded-lg transition-all duration-150 hover:scale-105 active:scale-95"
              type="submit"
              form="orderForm"
              disabled={!openSubmit}
            >
              {submitting ? "Оформление..." : "Подтвердить заказ"}
            </Button>
            {selectedDeliveryMethod === "postalDelivery" && !openSubmit && (
              <p className="text-xs text-red-600 mt-1 ml-2">
                Выберите пункт выдачи, чтобы подтвердить заказ
              </p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
