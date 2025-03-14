"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shadcn-ui/button";
import { motion } from "framer-motion";
import { Container } from "@/components/shared";
import {
  OrderSummary,
  ContactInfo,
  DeliveryForm,
  TotalAmount,
  PaymentMethods,
  OrderWishes,
} from "@/components/checkout";
import { FormProvider, useForm } from "react-hook-form";
import {
  CheckoutFormValues,
  orderSchema,
} from "@/constants/checkoutFormSchema";
import { createOrder } from "@/app/actions";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "cash">(
    "transfer"
  );
  const [submitting, setSubmitting] = useState(false);
  const loading = useCartStore((state) => state.loading);
  const fullPrice = useCartStore((state) => state.fullPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      deliveryAddress: "",
      wishes: "",
      comment: "",
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      if (fullPrice === 0) {
        toast.error("Корзина пустая, не удалось создать заказ", {
          position: "top-center",
        });
        throw new Error("Корзина пустая, не удалось создать заказ");
      }

      setSubmitting(true);
      const paymentUrl = await createOrder(data);

      await clearCart();

      router.push(paymentUrl);
    } catch (error) {
      console.error("Ошибка при создании заказа", error);
      toast.error("Не удалось создать заказ!", { position: "top-center" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="min-h-screen bg-white text-black py-8 px-4 md:px-8 overflow-visible">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
        <div className="md:w-3/5 space-y-6">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="orderForm">
              <ContactInfo />
              <DeliveryForm />
              <OrderWishes />
              <OrderSummary />
            </form>
          </FormProvider>
        </div>
        <div className="md:w-2/5 space-y-6 sticky top-4 self-start">
          <h1 className="text-xl font-semibold border-b pb-3">
            Оплата и подтверждение
          </h1>

          <TotalAmount />
          <PaymentMethods
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              loading={loading}
              className="w-full bg-black text-white py-3 rounded-lg"
              type="submit"
              form="orderForm"
              disabled={loading}
            >
              {submitting ? "Оформление..." : "Подтвердить заказ"}
            </Button>
          </motion.div>
        </div>
      </div>
    </Container>
  );
}
