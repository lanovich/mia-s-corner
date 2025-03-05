"use client";

import Link from "next/link";
import React from "react";

interface Props {
  href: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const CustomLink: React.FC<Props> = ({ href, children, onClick }) => {
  return (
    <Link href={href} className="custom-border" onClick={onClick}>
      {children}
    </Link>
  );
};
