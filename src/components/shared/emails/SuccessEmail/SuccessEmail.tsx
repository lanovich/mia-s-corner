import { OrderItem } from "@/types/OrderItem";
import { OrderItemCard } from "../OrderReceiptEmail/OrderItemCard";
import { EmailTemplateProps } from "../OrderReceiptEmail/OrderReceiptEmail";
import { styles } from "./styles";

export const SuccessEmail: React.FC<EmailTemplateProps> = ({
  orderId,
  fullPrice,
  items,
}) => {
  const parsedItems: OrderItem[] = JSON.parse(items);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Спасибо за ваш заказ #{orderId}!</h1>
      <p style={styles.description}>
        Мы рады сообщить, что ваш платеж успешно обработан. Ваш заказ уже
        готовится к отправке. 🕯️
      </p>

      <h2 style={styles.sectionTitle}>Детали заказа:</h2>
      <div>
        {parsedItems.map((item) => (
          <OrderItemCard key={item.id} item={item} size_id={item.size_id} />
        ))}
      </div>

      <h2 style={styles.totalPrice}>Общая сумма: {fullPrice} ₽</h2>

      <p style={styles.footerText}>
        Если у вас есть вопросы, пожалуйста, свяжитесь с нашей службой
        поддержки. Мы всегда готовы помочь! 💙
      </p>
    </div>
  );
};
