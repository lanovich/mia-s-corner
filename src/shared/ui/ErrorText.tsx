import { cn } from "@/lib";
import React from "react";

interface Props {
  className?: string;
  text: string;
}

export const ErrorText: React.FC<Props> = ({ className, text }) => {
  return (
    <p className={cn("text-red-600 text-xs min-h-[16px]", className)}>
      {text}
    </p>
  );
};
