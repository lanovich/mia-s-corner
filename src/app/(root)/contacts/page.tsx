"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/shadcn-ui/button";
import { LINKS } from "@/constants";
import {
  contactFormSchema,
  ContactFormValues,
} from "@/constants/contactFormSchema";
import { sendContactMessage } from "@/app/actions";
import { toast } from "sonner";
import Link from "next/link";
import { Container } from "@/components/shared";
import { cn } from "@/lib";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const result = await sendContactMessage(data);

      if (result.success) {
        toast.success("Сообщение успешно отправлено!");
        reset();
      } else {
        toast.error(result.error || "Не удалось отправить сообщение.");
      }
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      toast.error("Произошла ошибка. Попробуйте ещё раз.");
    }
  };

  return (
    <Container className={"py-6 md:py-12 lg:py-16"}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto mb-20"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
          Свяжитесь с нами
        </h1>

        {/* Форма обратной связи */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Имя
            </label>
            <input
              {...register("name")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Ваше имя"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Ваш email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Сообщение
            </label>
            <textarea
              {...register("message")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              rows={5}
              placeholder="Ваше сообщение"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Отправка..." : "Отправить сообщение"}
          </Button>
        </form>

        {/* Ссылки на социальные сети и почту */}
        <div className="mt-12 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Мы в соцсетях</h2>
          <div className="flex space-x-4">
            <Link
              href={LINKS.VK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black transition-colors"
            >
              VK
            </Link>
            <Link
              href={LINKS.TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black transition-colors"
            >
              Telegram
            </Link>
            <Link
              href={LINKS.PINTEREST}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black transition-colors"
            >
              Pinterest
            </Link>
          </div>
          <p className="text-gray-700 my-2">
            Или напишите нам на почту:{" "}
            <Link
              href={`mailto:${LINKS.GMAIL}`}
              className="text-black hover:underline"
            >
              {LINKS.GMAIL}
            </Link>
            <p className="text-xs my-2">
              {"(сообщение в форме выше тоже отправляется нам на почту)"}
            </p>
          </p>
        </div>
      </motion.div>
    </Container>
  );
}
