import { cn } from "@/shared/lib";
import { LoadingIndicator, QuantityButton } from "@/shared/ui";
import { ShoppingCart } from "lucide-react";

interface CartAddButtonProps {
  isLoading: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

export const CartAddButton: React.FC<CartAddButtonProps> = ({
  isLoading,
  onClick,
  children,
}) => (
  <div
    className={cn(
      "flex items-stretch rounded-lg text-lg font-normal min-h-[40px] sm:min-h-[50px] w-full",
      isLoading && "opacity-50"
    )}
  >
    <QuantityButton
      onClick={onClick}
      className="flex items-center justify-center rounded-sm transition border-black/70 border-[1px]  text-black hover:bg-black hover:text-white min-h-[40px] sm:min-h-[50px] w-full"
      icon={
        isLoading ? (
          <LoadingIndicator isLoading={isLoading} />
        ) : (
          <>
            <span className="hidden sm:inline font-normal">{children}</span>
            <ShoppingCart className="sm:hidden w-5 h-5" />
          </>
        )
      }
      loading={isLoading}
    />
  </div>
);
