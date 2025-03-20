import { z } from "zod";

export const selfPickupSchema = z.object({
  deliveryMethod: z.literal("selfPickup"),
  name: z.string().min(1, "Введите имя"),
  phone: z
    .string()
    .min(1, "Введите номер телефона")
    .regex(/^(\+?\d{1,3})?\d{10}$/, "Некорректный номер"),
  email: z.string().min(1, "Введите email").email("Некорректный email"),
  wishes: z.string().optional(),
  comment: z.string().optional(),
  floor: z.string().optional(),
  apartment: z.string().optional(),
  entrance: z.string().optional(),
  deliveryAddress: z.string().optional(),
});

export const deliverySchema = z.object({
  deliveryMethod: z.literal("fastDelivery"),
  email: z.string().min(1, "Введите email").email("Некорректный email"),
  deliveryAddress: z.string().min(1, "Введите адрес доставки"),
  apartment: z.string().min(1, "Введите номер квартиры"),
  entrance: z.string().min(1, "Введите подъезд"),
  floor: z.string().min(1, "Введите этаж"),
  name: z.string().min(1, "Введите имя"),
  phone: z
    .string()
    .min(1, "Введите номер телефона")
    .regex(/^(\+?\d{1,3})?\d{10}$/, "Некорректный номер"),
  wishes: z.string().optional(),
  comment: z.string().optional(),
})

export const schema = z.union([selfPickupSchema, deliverySchema]);

export type CheckoutFormValues = z.infer<typeof schema>;
