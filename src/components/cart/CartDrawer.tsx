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
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/shadcn-ui/drawer";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { Button } from "../shadcn-ui/button";
import { ArrowRight, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { CartDrawerItem } from ".";
import { InfoAboutCartPrice } from "./ui";
import { calcFullPrice } from "../../lib/calcFullPrice";

interface Props {
  children?: React.ReactNode;
}

export const CartDrawer: React.FC<Props> = ({ children }) => {
  const { cart, fullPrice, productTotalAmount, clearCart } = useCartStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleCheckout = () => {
    startTransition(() => {
      router.push("/checkout");
    });
  };

  const handleClearCart = () => {
    clearCart();
  };

  const formatCartItemsText = (count: number) => {
    if (count === 1) return `${count} наименование`;
    if (count >= 2 && count <= 4) return `${count} наименования`;
    return `${count} наименований`;
  };

  const content = (
    <>
      <SheetHeader className="border-b pb-2">
        <SheetTitle>
          В корзине{" "}
          <span className="font-bold">{formatCartItemsText(cart.length)}</span>
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
      {cart.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearCart}
          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-fit w-fit mx-auto pt-2"
        >
          <Trash2 className="h-4 w-4" />
          Очистить корзину
        </Button>
      )}
    </>
  );

  return isDesktop ? (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col px-4 py-4 w-full max-w-md">
        {content}
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="flex flex-col px-4 py-4 h-[85%]">
        {content}
      </DrawerContent>
    </Drawer>
  );
};
