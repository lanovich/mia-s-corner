"use server";

import { Resend } from "resend";
import React from "react";

export const sendEmail = async (
  to: string,
  subject: string,
  TemplateComponent: React.FC<any>,
  templateProps: any
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const template = React.createElement(TemplateComponent, templateProps);

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      react: template,
    });

    if (error) {
      console.error("Ошибка отправки письма:", error);
      throw new Error("Ошибка отправки письма");
    }
    return data;
  } catch (error) {
    console.error("Ошибка в sendEmail:", error);
    throw error;
  }
};
