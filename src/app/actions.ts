"use server";

import { ContactEmailTemplate } from "@/entities/mail/ui";
import { ContactFormValues } from "@/shared/model/contactFormSchema";
import { sendEmail } from "@/entities/mail/api";
import { LINKS } from "@/shared/model";

export async function sendContactMessage(data: ContactFormValues) {
  try {
    await sendEmail(
      LINKS.GMAIL,
      `Новое сообщение с сайта Mia's Corner от пользователя ${data.email}`,
      ContactEmailTemplate,
      data
    );

    return { success: true };
  } catch (error) {
    console.error("Ошибка при отправке сообщения", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  }
}
