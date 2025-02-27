import React, { MouseEventHandler } from "react";
import { Button } from "../shadcn-ui/button";
import { X } from "lucide-react";

interface Props {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const ClearButton: React.FC<Props> = ({ className, onClick }) => {
  return (
    <div className={className}>
      <Button
        onClick={onClick}
        className="w-10 h-1/2 bg-gray-400 bg-inherit hover:bg-inherit hover:scale-110"
      >
        <X color="black" />
      </Button>
    </div>
  );
};
