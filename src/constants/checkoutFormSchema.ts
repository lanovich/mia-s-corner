import { z } from "zod";

export const orderSchema = z.object({
  name: z.string().min(1, "Введите имя"),
  phone: z
    .string()
    .min(1, "Введите номер телефона")
    .regex(/^(\+?\d{1,3})?\d{10}$/, "Некорректный номер"),
  email: z.string().min(1, "Введите email").email("Некорректный email"),
  deliveryAddress: z.string().min(1, "Введите адрес доставки"),
  wishes: z.string().optional(),
  floor: z.string().min(1, "Введите этаж"),
  comment: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof orderSchema>;
