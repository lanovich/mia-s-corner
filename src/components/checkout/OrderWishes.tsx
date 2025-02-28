import React from "react";
import { Textarea } from "../shadcn-ui/textarea";
import { AboutWishesTooltip } from "./AboutWishesTooltip";
import { FormTextarea } from "./FormTextarea";

export const OrderWishes = () => {
  return (
    <div>
      <div className="flex border-b pb-3">
        <h2 className="relative text-lg font-semibold ">Пожелания к заказу </h2>
        <AboutWishesTooltip />
      </div>

      <div className="mt-3 space-y-2">
        <FormTextarea
          placeholder="Ваши пожелания к заказу"
          className="resize-none"
          rows={7}
          name="wishes"
        />
      </div>
      <div className="mt-4 flex justify-end"></div>
    </div>
  );
};
