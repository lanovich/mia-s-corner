import { cn } from "@/shared/lib";
import React from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const Container: React.FC<Props> = ({ className, children }) => {
  return <div className={cn(["mx-auto max-w-7xl"], className)}>{children}</div>;
};
