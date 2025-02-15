import { ShoppingBag } from "lucide-react";
import React from "react";

interface Props {
  className?: string;
}

export const CartButton: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <button className="flex gap-2">
        <ShoppingBag size={32} strokeWidth={1.5}/>
      </button>
    </div>
  );
};
