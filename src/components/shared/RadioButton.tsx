import React from "react";

interface RadioButtonProps {
  value: string;
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  price?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  checked,
  onChange,
  label,
  price,
}) => {
  return (
    <label
      className={`${
        checked ? "border bg-gray-200 shadow-md" : ""
      } flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer`}
    >
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm flex-grow ">{label}</span>
      {price && (
        <span className="text-xs font-semibold text-blue-600 ml-2">
          {price}
        </span>
      )}
    </label>
  );
};
