import React from "react";
import { Input } from "@/shared/shadcn-ui";
import * as RHF from "react-hook-form";
import { ErrorText, ClearButton } from "@/shared/ui";
import { cn } from "@/shared/lib";
import debounce from "lodash.debounce";

const { useFormContext } = RHF;

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  name: string;
  label?: string;
  required?: boolean;
  noChange?: boolean;
  customInput?: React.ComponentType<any>;
}

export const FormInput: React.FC<Props> = ({
  className,
  name,
  label,
  required,
  noChange,
  customInput: CustomInput,
  disabled,
  ...props
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string;

  const debouncedSetValue = debounce((value: string) => {
    setValue(name, value);
  }, 300);

  React.useEffect(() => {
    return () => debouncedSetValue.cancel();
  }, [debouncedSetValue]);

  const handleCustomInputChange = (value: string) => {
    debouncedSetValue(value);
  };

  const onClearClick = () => {
    setValue(name, "");
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-xs mb-1">{label}</label>}
      <div className="relative">
        {CustomInput ? (
          <CustomInput
            {...props}
            value={value}
            onChange={handleCustomInputChange}
            disabled={disabled}
          />
        ) : (
          <Input
            {...props}
            {...register(name)}
            className={cn(
              "pr-10 border [&::-webkit-inner-spin-button]:opacity-50 [&::-webkit-outer-spin-button]:opacity-50",
              errorText
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            )}
            disabled={disabled}
          />
        )}
        {value && !CustomInput && !noChange && !disabled && (
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
