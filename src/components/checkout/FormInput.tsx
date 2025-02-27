import React from "react";
import { Input } from "../shadcn-ui/input";
import { useFormContext } from "react-hook-form";
import { ErrorText } from "./ErrorText";
import { ClearButton } from "./ClearButton";
import { cn } from "@/lib";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  name: string;
  label?: string;
  required?: boolean;
}

export const FormInput: React.FC<Props> = ({
  className,
  name,
  label,
  required,
  ...props
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const onClearClick = () => {
    setValue(name, "");
  };

  const value = watch(name);
  const errorText = errors[name]?.message as string;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-xs mb-1">{label}</label>}
      <div className="relative">
        <Input
          {...props}
          {...register(name)}
          className={cn(
            "pr-10 border [&::-webkit-inner-spin-button]:opacity-50 [&::-webkit-outer-spin-button]:opacity-50",
            errorText ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          )}
        />
        {value && (
          <ClearButton
            onClick={onClearClick}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          />
        )}
      </div>
      {errorText && <ErrorText text={errorText} />}
    </div>
  );
};
