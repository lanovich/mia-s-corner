"use client";
import { useRouter } from "next/navigation";
import { CustomLink } from "./CustomLink";
import { LINKS } from "@/shared/model";

interface Props {
  className?: string;
  onLinkClick?: () => void;
}

export const Navigation = ({ className, onLinkClick }: Props) => {
  const router = useRouter();

  const onClickRandom: React.MouseEventHandler<HTMLAnchorElement> = async (
    e
  ) => {
    e.preventDefault();
    onLinkClick?.();

    const res = await fetch("/api/products/random-product");
    const redirectUrl = res.url;
    router.push(redirectUrl);
  };

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
      <CustomLink skipNavigation onClick={onClickRandom} customBorder>
        Случайный товар
      </CustomLink>
    </div>
  );
};
