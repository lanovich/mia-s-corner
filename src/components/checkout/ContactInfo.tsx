"use client";
import { FormInput } from "../shared/FormInput";

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
      <FormInput placeholder="Телефон" type="tel" name="phone" />
      <FormInput placeholder="E-mail" type="email" name="email" />
    </div>
  </div>
);
