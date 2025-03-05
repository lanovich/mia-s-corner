import { CustomLink } from "./CustomLink";
import { LINKS } from "@/constants";

interface Props {
  className?: string;
}

export const Navigation = ({ className }: Props) => {
  return (
    <div className={className}>
      <CustomLink href="/api/random-product">Случайно</CustomLink>
      <CustomLink href={`${LINKS.CATALOG}`}>Каталог</CustomLink>
      <CustomLink href="about">О нас</CustomLink>
      <CustomLink href="contacts">Контакты</CustomLink>
    </div>
  );
};
