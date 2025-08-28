import React from "react";
import { Hexagon } from "lucide-react";
import { cn } from "@/lib";

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
  <button onClick={onClick} className={cn("flex items-center justify-center w-1/3 h-7 md:h-8 hover:bg-black transition hover:text-white",
          loading ? "hover:bg-white hover:text-black" : "", className)} disabled={loading}>
    {loading ? <Hexagon className="animate-spin" /> : icon}
  </button>
);