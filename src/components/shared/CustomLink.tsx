"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  href: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const CustomLink: React.FC<Props> = ({ href, children, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`custom-border px-1 ${isActive ? "pointer-events-none custom-border" : ""}`}
      onClick={onClick}
      aria-disabled={isActive}
    >
      {children}
    </Link>
  );
};
