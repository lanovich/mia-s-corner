import { cn } from "@/lib";
import Link from "next/link";
import React from "react";
import { CustomLink } from "./CustomLink";
import { Menu } from "lucide-react";

interface Props {
  className?: string;
}

export const Navigation: React.FC<Props> = ({ className }) => {
  return (
    <>
      <div className={className}>
        <CustomLink href={"Catalog"}>Каталог</CustomLink>
        <CustomLink href={"Categories"}>Категории</CustomLink>
        <CustomLink href={"About"}>О нас</CustomLink>
        <CustomLink href={"Catalog"}>Дополнительно</CustomLink>
      </div>
    </>
  );
};
