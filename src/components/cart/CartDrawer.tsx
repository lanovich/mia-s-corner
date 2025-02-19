"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadcn-ui/sheet";
import Link from "next/link";
import { Button } from "../shadcn-ui/button";
import { ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { CartDrawerItem } from ".";
import { CartItem } from "@/store/useCartStore";

interface Props {
  children?: React.ReactNode;
}

export const CartDrawer: React.FC<Props> = ({ children }) => {
  const { cart, totalAmount } = useCartStore();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col px-6 py-4">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>
            В корзине{" "}
            <span className="font-bold">{cart.length} наименования</span>
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            Проверьте список товаров перед оформлением заказа.
          </SheetDescription>
        </SheetHeader>

        {/* Список товаров */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.map((cartItem: CartItem) => (
            <CartDrawerItem
              key={cartItem.product.id}
              cartItem={cartItem}
            />
          ))}
        </div>

        {/* Итоговая сумма */}
        <div className="pt-4 border-t">
          <div className="flex justify-between text-lg font-medium">
            <span>Итого:</span>
            <span className="font-bold">{totalAmount} ₽</span>
          </div>
        </div>

        {/* Кнопка оформления заказа */}
        <SheetFooter className="mt-auto">
          <Link href="/checkout" className="w-full">
            <Button className="w-full h-12 flex items-center justify-center gap-2">
              Оформить заказ
              <ArrowRight className="w-5" />
            </Button>
          </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
