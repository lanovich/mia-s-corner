"use client";

import { cn } from "@/lib";
import dynamic from "next/dynamic";
import React from "react";
import "react-dadata/dist/react-dadata.css";
import { ClearButton } from "../checkout";

interface Props {
  onChange?: (value?: string) => void;
  placeholder?: string;
  className?: string;
}

const AddressSuggestions = dynamic(
  () => import("react-dadata").then((mod) => mod.AddressSuggestions),
  { ssr: false }
);

export const AddressInput: React.FC<Props> = ({
  onChange,
  placeholder,
  className,
}) => {

  return (
    <div className={cn("min-h-10", className)}>
      <AddressSuggestions
        hintText="Город, улица, дом, квартира"
        token="b73bf13925fc3aabc30ab8f10d786ee27ff65556"
        onChange={(data) => onChange?.(data?.value)}
        inputProps={{
          placeholder: placeholder || "Введите адрес",
          className: cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          ),
        }}
      />
    </div>
  );
};
