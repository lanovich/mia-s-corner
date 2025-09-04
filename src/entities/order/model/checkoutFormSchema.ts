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
});

export const deliverySchema = z.object({
  // контактная информация
  deliveryMethod: z.literal("fastDelivery"),
  email: z.string().min(1, "Введите email").email("Некорректный email"),
  name: z.string().min(1, "Введите имя"),
  phone: z
    .string()
    .min(1, "Введите номер телефона")
    .regex(/^(\+?\d{1,3})?\d{10}$/, "Некорректный номер"),

  // Адрес для Яндекс доставки курьером
  city: z.string().min(1, "Введите город"),
  street: z.string().min(1, "Введите улицу"),
  building: z.string().min(1, "Введите номер здания"),
  porch: z.string().min(1, "Введите подъезд"),
  sfloor: z.string().min(1, "Введите этаж"),
  sflat: z.string().min(1, "Введите номер квартиры"),
  comment: z.string().optional(),

  // поле для пожеланий к заказу
  wishes: z.string().optional(),
});

export const postalSchema = z.object({
  // контактная информация
  deliveryMethod: z.literal("postalDelivery"),
  name: z.string().min(1, "Введите имя"),
  email: z.string().min(1, "Введите email").email("Некорректный email"),
  phone: z
    .string()
    .min(1, "Введите номер телефона")
    .regex(/^(\+?\d{1,3})?\d{10}$/, "Некорректный номер"),

  // Адрес для доставки в пункт выдачи
  city: z.string().min(1, "Введите город"),
  street: z.string().min(1, "Введите улицу"),
  building: z.string().min(1, "Введите номер здания"),

  // поле для пожеланий к заказу
  wishes: z.string().optional(),
});

export const schema = z.union([selfPickupSchema, deliverySchema, postalSchema]);

export type CheckoutFormValues = z.infer<typeof schema>;
