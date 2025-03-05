import React from "react";

interface ProductDetailProps {
  title: string;
  details: { label: string; value: string | number | null }[];
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  title,
  details,
}) => {
  return (
    <div className="py-2">
      <h4 className="text-base font-semibold mb-2">{title}</h4>
      <div className="border-b-2 mb-4 pb-2">
        {details.map((detail, index) => (
          <div key={index} className="flex mb-1">
            <span className="text-gray-500 min-w-[120px]">{detail.label}:</span>
            <span className="flex-1">{detail.value || "Не указан"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
