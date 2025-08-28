import { cn } from "@/lib";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navigation, Container } from "@/shared/ui";
import { BurgerMenu } from "./";
import { CartButtonWithPrice } from "@/entities/cart/ui";

interface Props {
  className?: string;
  hideCartButton?: boolean;
}

export const Header: React.FC<Props> = async ({
  hideCartButton,
  className,
}) => {
  return (
    <header className={cn("mx-4 xl:mx-0", className)}>
      <Container className="flex justify-between items-center py-4 bg-gray70 h-20">
        {/* Логотип сайта */}
        <Link href={"/"} className="select-none w-24 h-full">
          <Image
            className="pointer-events-none select-none object-contain w-24 h-[100%]"
            style={{ width: "auto", height: "auto" }}
            src="/logo.svg"
            alt="logo"
            width={96}
            height={96}
          />
        </Link>

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
