import React from "react";
import { cn } from "@/shared/lib";
import { LoadingIndicator } from "./LoadingIndicator";

interface QuantityButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon: React.ReactNode;
  loading: boolean;
  className?: string;
}

export const QuantityButton: React.FC<QuantityButtonProps> = ({
  onClick,
  icon,
  loading,
  className,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center justify-center w-1/3 min-h-full box-border hover:bg-black transition hover:text-white",
      loading ? "hover:bg-white hover:text-black" : "",
      className
    )}
    disabled={loading}
  >
    {loading ? <LoadingIndicator isLoading={loading} /> : icon}
  </button>
);
