import { Hexagon } from "lucide-react";
import { cn } from "../lib";

interface LoadingIndicatorProps {
  isLoading?: boolean;
  className?: string;
  size?: number;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isLoading = false,
  className,
  size = 24,
}) => {
  if (!isLoading) return null;
  return (
    <Hexagon
      className={cn("animate-spin", className)}
      style={{ width: size, height: size }}
    />
  );
};
