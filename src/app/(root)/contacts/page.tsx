"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Container } from "@/components/shared";
import {
  contactFormSchema,
  ContactFormValues,
} from "@/constants/contactFormSchema";
import { sendContactMessage } from "@/app/actions";
import { FormProvider } from "react-hook-form";
import { ContactForm } from "@/components/contacts/ContactForm";
import { ContactDetails } from "@/components/contacts/ContactDetails";

export default function ContactPage() {
  const methods = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

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

  return (
    <Container className="my-8">
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
