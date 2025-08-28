import { cn } from "@/lib";
import { Label } from "@/shared/shadcn-ui";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  withBorder?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  className,
  withBorder = true,
}) => (
  <div
    className={cn(
      `space-y-2 ${withBorder ? "pt-2 border-t border-gray-200" : ""}`,
      className
    )}
  >
    <Label className="text-md font-bold">{title}</Label>
    {children}
  </div>
);
