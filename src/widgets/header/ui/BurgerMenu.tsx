"use client";

import { Menu, X } from "lucide-react";
import React from "react";
import { useDropDownNavigation } from "@/shared/model";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/shadcn-ui/sheet";
import { CartButtonWithPrice } from "@/entities/cart/ui";
import { Navigation } from "@/shared/ui";

interface Props {
  className?: string;
}

export const BurgerMenu: React.FC<Props> = ({ className }) => {
  const toggleMenu = useDropDownNavigation((state) => state.toggleMenu);
  const isMenuOpened = useDropDownNavigation((state) => state.isMenuOpened);

  return (
    <Sheet open={isMenuOpened} onOpenChange={toggleMenu}>
      <SheetTrigger asChild>
        <button className="md:hidden">{isMenuOpened ? <X /> : <Menu />}</button>
      </SheetTrigger>

      <SheetContent side="top" className="flex flex-col px-6 py-4">
        <SheetHeader>
          <SheetDescription />
          <SheetTitle className="text-2xl font-semibold">Меню</SheetTitle>
        </SheetHeader>
        <Navigation
          className="flex flex-col gap-4 text-2xl mt-4"
          onLinkClick={toggleMenu}
        />
        <CartButtonWithPrice className="w-full" />
      </SheetContent>
    </Sheet>
  );
};
