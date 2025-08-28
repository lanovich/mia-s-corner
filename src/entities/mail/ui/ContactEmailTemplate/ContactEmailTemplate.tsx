import React from "react";
import { contactEmailStyles } from "./styles";

interface ContactEmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const ContactEmailTemplate: React.FC<ContactEmailTemplateProps> = ({
  name,
  email,
  message,
}) => {
  return (
    <div style={contactEmailStyles.container}>
      <h1 style={contactEmailStyles.title}>
        Новое сообщение с сайта Mia's Corner
      </h1>
      <div>
        <p style={contactEmailStyles.text}>
          <span style={contactEmailStyles.label}>Имя:</span> {name}
        </p>
        <p style={contactEmailStyles.text}>
          <span style={contactEmailStyles.label}>Email:</span> {email}
        </p>
        <p style={contactEmailStyles.text}>
          <span style={contactEmailStyles.label}>Сообщение:</span> {message}
        </p>
      </div>
    </div>
  );
};
