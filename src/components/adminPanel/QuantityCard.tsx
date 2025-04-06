import { cn } from "@/lib";

interface QuantityCardProps {
  label: string;
  value: number;
  className?: string;
  endSymbol?: string;
}

export const QuantityCard = ({
  label,
  value,
  endSymbol,
  className,
}: QuantityCardProps) => (
  <div
    className={cn(
      "flex justify-between text-base min-w-40 border-gray-200 border-2 p-2 rounded-xl bg-white",
      className
    )}
  >
    <span>{label}</span>
    <div className="flex-1 border-b border-dashed border-b-black relative -top-1 mx-2" />
    <span>
      {value} {endSymbol}
    </span>
  </div>
);
