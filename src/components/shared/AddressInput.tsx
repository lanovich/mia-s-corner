"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "react-dadata/dist/react-dadata.css";

interface Props {
  onChange?: (value?: string) => void;
}

const AddressSuggestions = dynamic(
  () => import("react-dadata").then((mod) => mod.AddressSuggestions),
  { ssr: false }
);

export const AddressInput: React.FC<Props> = ({ onChange }) => {
  return (
    <div className="min-h-10">
      <AddressSuggestions
        hintText="Город, улица, дом, квартира"
        token="b73bf13925fc3aabc30ab8f10d786ee27ff65556"
        onChange={(data) => onChange?.(data?.value)}
      />
    </div>
  );
};
