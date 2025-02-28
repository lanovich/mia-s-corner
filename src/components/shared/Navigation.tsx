import React from "react";
import { CustomLink } from "./CustomLink";
import { LINKS } from "@/constants";

interface Props {
  className?: string;
}

export const Navigation: React.FC<Props> = ({ className }) => {
  return (
    <>
      <div className={className}>
        <CustomLink href={`${LINKS.CATALOG}/1`}>Каталог</CustomLink>
        <CustomLink href={"about"}>О нас</CustomLink>
        <CustomLink href={`${LINKS.CATALOG}/1/22`}>Случайно</CustomLink>
        <CustomLink href={"contacts"}>Контакты</CustomLink>
      </div>
    </>
  );
};
