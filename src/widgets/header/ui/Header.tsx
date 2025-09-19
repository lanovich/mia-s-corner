"use client";

import { cn } from "@/shared/lib";
import Image from "next/image";
import { Navigation, Container, CustomLink } from "@/shared/ui";
import { BurgerMenu, HeaderSearch } from "./";
import { CartButtonWithPrice } from "@/entities/cart/ui";
import { SearchOverlay } from "@/features/product-search/ui";

interface Props {
  className?: string;
  hideCartButton?: boolean;
}

export const Header = ({ hideCartButton, className }: Props) => {
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

        <div className="hidden sm:flex sm:w-[400px] md:hidden lg:flex lg:w-[300px] xl:w-[500px] gap-2">
          <HeaderSearch />
        </div>

        {/* Корзина и навигация */}
        <div className="flex justify-between items-center gap-2 sm:gap-5">
          <SearchOverlay className="flex sm:hidden md:flex lg:hidden" />

          <Navigation className="hidden md:flex gap-5" />
          {hideCartButton ?? <CartButtonWithPrice className="hidden md:flex" />}
          <BurgerMenu />
        </div>
      </Container>
    </header>
  );
};
