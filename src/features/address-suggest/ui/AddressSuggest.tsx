import React, { useState } from "react";
import { Input } from "@/shared/shadcn-ui";
import {
  DaDataAddressData,
  DaDataSuggestion,
  fetchAddressSuggestions,
} from "../api";

interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onSuggestionSelect: (s: DaDataSuggestion<DaDataAddressData>) => void;
  onValueChange?: (val: string) => void;
}

export const AddressSuggest = ({
  value,
  onValueChange,
  onSuggestionSelect,
  ...props
}: Props) => {
  const [suggestions, setSuggestions] = useState<
    DaDataSuggestion<DaDataAddressData>[]
  >([]);

  const handleChange = async (val: string) => {
    onValueChange?.(val as any);
    const list = await fetchAddressSuggestions(val);
    setSuggestions(list);
  };

  return (
    <div className="relative">
      <Input
        {...props}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded w-full z-10">
          {suggestions.map((s) => (
            <li
              key={s.value}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onSuggestionSelect(s);
                setSuggestions([]);
              }}
            >
              {s.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
