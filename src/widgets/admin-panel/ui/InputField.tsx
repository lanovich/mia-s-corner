import { cn } from "@/lib";
import { Input, Label } from "@/shared/shadcn-ui";
import { ReactNode } from "react";

interface InputFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  isChanged?: boolean;
  className?: string;
  icon?: ReactNode;
  unit?: string;
  multiline?: boolean;
  rows?: number;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  isChanged = false,
  className = "",
  icon,
  unit,
  multiline = false,
  rows = 1,
}) => {
  const inputClasses = cn(
    isChanged ? "border-blue-500 bg-blue-50" : "bg-slate-100",
    icon ? "pl-10" : "",
    unit ? "pr-10" : "",
    multiline ? "min-h-[80px] resize-y" : ""
  );

  return (
    <div className={cn("", className)}>
      <Label className="text-xs text-gray-500">{label}</Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
        )}
        {multiline ? (
          <textarea
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              inputClasses
            )}
            rows={rows}
          />
        ) : (
          <Input
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={inputClasses}
          />
        )}
        {unit && (
          <div className="absolute right-3 top-3 text-gray-500 text-sm">
            {unit}
          </div>
        )}
      </div>
    </div>
  );
};
