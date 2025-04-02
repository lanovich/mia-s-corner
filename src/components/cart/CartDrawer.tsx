"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadcn-ui/sheet";
import { Button } from "../shadcn-ui/button";
import { ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { CartDrawerItem } from ".";
import { InfoAboutCartPrice } from "./ui";
import { calcFullPrice } from "../../lib/calcFullPrice";

interface Props {
  children?: React.ReactNode;
}

export const CartDrawer: React.FC<Props> = ({ children }) => {
  const { cart, fullPrice, productTotalAmount } = useCartStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCheckout = () => {
    startTransition(() => {
      router.push("/checkout");
    });
  };

  const formatCartItemsText = (count: number) => {
    if (count === 1) return `${count} наименование`;
    if (count >= 2 && count <= 4) return `${count} наименования`;
    return `${count} наименований`;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col px-6 py-4">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>
            В корзине{" "}
            <span className="font-bold">
              {formatCartItemsText(cart.length)}
            </span>
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            Проверьте список товаров перед оформлением заказа.
          </SheetDescription>
        </SheetHeader>

        {/* Список товаров */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.map((cartItem: CartItem, index) => (
            <CartDrawerItem key={index} cartItem={cartItem} />
          ))}
        </div>

        {/* Итоговая сумма */}
        <InfoAboutCartPrice
          fullPrice={fullPrice}
          cartDiscount={calcFullPrice(productTotalAmount).discount}
          productTotalPrice={productTotalAmount}
        />

        {/* Кнопка оформления заказа */}
        <SheetFooter className="mt-auto">
          <Button
            onClick={handleCheckout}
            loading={isPending}
            className="w-full h-12 flex items-center justify-center gap-2"
            disabled={!cart.length}
          >
            Оформить заказ
            <ArrowRight className="w-5" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
