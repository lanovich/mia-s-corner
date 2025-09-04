"use client";

import { sendContactMessage } from "@/app/actions";
import {
  ContactFormValues,
  contactFormSchema,
} from "@/shared/model/contactFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Container } from "@/shared/ui";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { ContactDetails } from "./ContactDetails";
import { ContactForm } from "./ContactForm";
import { useEffect, useState } from "react";

export function ContactPageClient() {
  const methods = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const result = await sendContactMessage(data);

      if (result.success) {
        toast.success("Сообщение успешно отправлено!");
        methods.reset();
      } else {
        toast.error(result.error || "Не удалось отправить сообщение.");
      }
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      toast.error("Произошла ошибка. Попробуйте ещё раз.");
    }
  };

  if (!mounted) return null;

  return (
    <Container className="my-8 mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center space-y-12"
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center">
          Свяжитесь с нами
        </h1>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="w-full flex flex-col items-center"
          >
            <ContactForm />
          </form>
        </FormProvider>

        <ContactDetails />
      </motion.div>
    </Container>
  );
}
