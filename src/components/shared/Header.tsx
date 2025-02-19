import { cn } from "@/lib";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navigation, Container } from ".";
import { Menu } from "lucide-react";
import { CartButtonWithPrice } from ".";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <header className={cn("mx-4 xl:mx-0 mt-5", className)}>
      <Container className="flex justify-between items-center py-4 bg-gray70">
        {/* Логотип сайта */}
        <Link href={"/"} className="select-none">
          <Image
            className="pointer-events-none select-none"
            src="/logo.svg"
            alt="logo"
            width={96}
            height={96}
          />
        </Link>

        {/* Корзина и навигация */}
        <div className="flex justify-between items-center gap-5">
          <Navigation className="hidden md:flex gap-5" />
          <CartButtonWithPrice />
          <button className="md:hidden">
            <Menu />
          </button>
        </div>
      </Container>
    </header>
  );
};
