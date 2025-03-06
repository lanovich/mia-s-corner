import React from "react";
import { styles } from "./styles";
import { OrderItemCard } from "./OrderItemCard";
import { OrderItem } from "@/types/OrderItem";

export interface EmailTemplateProps {
  orderId: number;
  fullPrice: number;
  paymentUrl: string;
  items: string;
}

export const OrderReceiptEmail: React.FC<EmailTemplateProps> = ({
  orderId,
  fullPrice,
  paymentUrl,
  items,
}) => {
  const parsedItems: OrderItem[] = JSON.parse(items);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Ваш заказ #{orderId}</h1>
      <p style={styles.description}>
        Спасибо, что выбрали нас! 🕯️ Мы очень рады вашему заказу. Для оплаты
        перейдите{" "}
        <a href={paymentUrl} style={styles.paymentLink}>
          по этой ссылке
        </a>
        .
      </p>

      <h2 style={styles.sectionTitle}>Состав заказа:</h2>
      <div>
        {parsedItems.map((item) => (
          <OrderItemCard key={item.id} item={item} size_id={item.size_id} />
        ))}
      </div>

      <h2 style={styles.totalPrice}>Общая сумма: {fullPrice} ₽</h2>

      <p style={styles.footerText}>
        Если у вас есть вопросы, мы всегда на связи. Спасибо за доверие! 💙
      </p>
    </div>
  );
};

