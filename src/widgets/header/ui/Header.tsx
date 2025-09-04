import { cn } from "@/shared/lib";
import React from "react";
import Image from "next/image";
import { Navigation, Container, CustomLink } from "@/shared/ui";
import { BurgerMenu } from "./";
import { CartButtonWithPrice } from "@/entities/cart/ui";

interface Props {
  className?: string;
  hideCartButton?: boolean;
}

export const Header: React.FC<Props> = ({ hideCartButton, className }) => {

  return (
    <header className={cn("mx-4 xl:mx-0", className)}>
      <Container className="flex justify-between items-center bg-gray70 h-20">
        {/* Логотип сайта */}
        <CustomLink href="/" className="relative w-24 h-full select-none">
          <Image
            src="/logo.svg"
            alt="logo"
            fill
            sizes="96px"
            priority
            className="pointer-events-none select-none object-contain"
          />
        </CustomLink>

        {/* Корзина и навигация */}
        <div className="flex justify-between items-center gap-5">
          <Navigation className="hidden md:flex gap-5" />
          {hideCartButton ?? <CartButtonWithPrice className="hidden md:flex" />}
          <BurgerMenu />
        </div>
      </Container>
    </header>
  );
};
