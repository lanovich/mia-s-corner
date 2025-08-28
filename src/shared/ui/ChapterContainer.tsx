import { cn } from "@/shared/lib";
import React from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const СhapterContainer: React.FC<Props> = ({ className, children }) => {
  return (
    <div className={cn("max-w-[1380px] mx-auto", className)}>{children}</div>
  );
};
