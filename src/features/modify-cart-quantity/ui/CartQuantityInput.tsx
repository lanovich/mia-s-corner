import { cn } from "@/shared/lib";
import { QuantityButton } from "@/shared/ui";
import { Minus, Plus } from "lucide-react";
import { ChangeEvent } from "react";

interface CartQuantityInputProps {
  quantity: number;
  isLoading: boolean;
  onInc: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onDec: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputValue: string | null;
}

export const CartQuantityInput: React.FC<CartQuantityInputProps> = ({
  quantity,
  isLoading,
  onInc,
  onDec,
  onInputChange,
  onInputBlur,
  inputValue,
}) => {
  const displayValue = inputValue !== null ? inputValue : quantity;

  return (
    <div
      className={cn(
        "flex items-stretch p-1 rounded-lg border-black font-normal min-h-[40px] sm:min-h-[50px] w-full",
        isLoading && "opacity-50"
      )}
    >
      <QuantityButton
        onClick={onDec}
        icon={<Minus className="w-4 h-4 sm:w-5 sm:h-5" />}
        loading={isLoading}
        className="rounded-l-sm"
      />
      <input
        type="text"
        value={displayValue}
        onChange={onInputChange}
        onBlur={onInputBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="whitespace-nowrap border-x  border-black w-1/3 px-2 sm:px-4 text-center overflow-hidden bg-transparent focus:outline-none"
        disabled={isLoading}
      />
      <QuantityButton
        onClick={onInc}
        icon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
        loading={isLoading}
        className="rounded-r-sm"
      />
    </div>
  );
};
