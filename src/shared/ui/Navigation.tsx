import { CustomLink } from "./CustomLink";
import { LINKS } from "@/shared/model";

interface Props {
  className?: string;
  onLinkClick?: () => void;
}

export const Navigation = ({ className, onLinkClick }: Props) => {
  return (
    <div className={className}>
      <CustomLink href={`${LINKS.CATALOG}`} onClick={onLinkClick} customBorder>
        Каталог
      </CustomLink>
      <CustomLink
        href={`${LINKS.CATALOG}/${LINKS.HISTORIES}/1`}
        onClick={onLinkClick}
        customBorder
      >
        Истории
      </CustomLink>
      <CustomLink
        href={`/${LINKS.CONTACTS}`}
        onClick={onLinkClick}
        customBorder
      >
        Контакты
      </CustomLink>
      <CustomLink href={`/${LINKS.ABOUT}`} onClick={onLinkClick} customBorder>
        О нас
      </CustomLink>
      <CustomLink
        href="/api/products/random-product"
        onClick={onLinkClick}
        customBorder
      >
        Случайный товар
      </CustomLink>
    </div>
  );
};
