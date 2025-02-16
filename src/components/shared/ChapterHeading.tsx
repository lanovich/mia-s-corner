import { cn } from "@/lib";
import React from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const ChapterHeading: React.FC<Props> = ({ className, children }) => {
  return (
    <h1
      className={cn(
        ["text-4xl mt-6 font-bold flex items-center justify-center"],
        className
      )}
    >
      {children}
    </h1>
  );
};
