import Link from "next/link";
import React from "react";

interface Props {
  href: string;
  children: React.ReactNode;
}

export const CustomLink: React.FC<Props> = ({ href, children }) => {
  return (
    <Link href={href} className="custom-border">
      {children}
    </Link>
  );
};
