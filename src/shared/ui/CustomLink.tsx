"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn, usePendingNavigation } from "@/shared/lib";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  customBorder?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const CustomLink: React.FC<Props> = ({
  href,
  children,
  customBorder,
  onClick,
  className,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const { isPending, navigate } = usePendingNavigation();

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (onClick) onClick(e);
    if (isActive || isPending) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    navigate(href);
  };

  return (
    <Link
      href={href}
      className={cn(
        customBorder ? "custom-border pl-0.5" : "",
        isActive ? "pointer-events-none" : "",
        isPending ? "opacity-70 pointer-events-none" : "",
        className
      )}
      onClick={handleClick}
      aria-disabled={isActive || isPending}
    >
      {children}
    </Link>
  );
};
