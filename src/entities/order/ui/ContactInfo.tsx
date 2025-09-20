"use client";
import { FormInput } from "@/shared/ui";
import { PhoneInput } from "./PhoneInput";

interface Props {
  className?: string;
}

export const ContactInfo: React.FC<Props> = ({ className }) => (
  <div className={className}>
    <h2 className="text-lg font-semibold border-b pb-3">
      Контактная информация
    </h2>
    <div className="mt-3 space-y-2">
      <FormInput placeholder="Ваше имя" name="name" />
      <PhoneInput placeholder="+7 (999) 999-99-99" type="tel" name="phone" autoComplete="tel"/>
      <FormInput placeholder="E-mail" type="email" name="email" />
    </div>
  </div>
);
