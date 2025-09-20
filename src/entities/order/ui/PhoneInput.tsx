import { IMaskInput } from "react-imask";
import { Controller, useFormContext } from "react-hook-form";
import { ErrorText, ClearButton } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  name: string;
  label?: string;
  required?: boolean;
  noChange?: boolean;
  customInput?: React.ComponentType<any>;
}

export const PhoneInput = ({ name, label, disabled, ...props }: Props) => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const value = watch(name);
  const errorText = errors[name]?.message as string;

  const onClearClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setValue(name, "");
  };

  return (
    <div className={"flex flex-col gap-1"}>
      {label && <label>{label}</label>}
      <div className="relative">
        <Controller
          name={name}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <IMaskInput
              {...props}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                errorText
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              )}
              mask={`+7 (000) 000-00-00`}
              unmask={false}
              value={field.value}
              onAccept={field.onChange}
              onKeyDown={
                props.onKeyDown ||
                ((e) => {
                  if (e.key === "Enter") e.preventDefault();
                })
              }
              disabled={disabled}
            />
          )}
        />
        {value && !disabled && (
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
