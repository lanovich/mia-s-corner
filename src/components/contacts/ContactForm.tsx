"use client";

import { Button } from "@/components/shadcn-ui/button";
import { useFormContext } from "react-hook-form";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../checkout/FormTextarea";

export const ContactForm = () => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <div className="space-y-6 w-full max-w-xl">
      <FormInput
        name="name"
        label="Имя"
        placeholder="Ваше имя"
        required
        className="w-full"
      />

      <FormInput
        name="email"
        label="Email"
        placeholder="Ваш email"
        type="email"
        required
        className="w-full"
      />

      <FormTextarea
        name="message"
        label="Сообщение"
        placeholder="Ваше сообщение"
        rows={5}
        required
        className="w-full"
      />

      <Button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Отправка..." : "Отправить сообщение"}
      </Button>
    </div>
  );
};
