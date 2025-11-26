import { OrderItem } from "@/entities/order/model";
import { OrderItemCard } from "../OrderReceiptEmail/OrderItemCard";
import { EmailTemplateProps } from "../OrderReceiptEmail/OrderReceiptEmail";
import { styles } from "./styles";

export const SuccessEmail: React.FC<EmailTemplateProps> = ({
  orderId,
  fullPrice,
  deliveryPrice,
  items,
}) => {
  const parsedItems: OrderItem[] = JSON.parse(items);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Спасибо за ваш заказ #{String(orderId).slice(0, 6)}!
      </h1>
      <p style={styles.description}>
        Мы рады сообщить, что ваш платеж успешно обработан. Ваш заказ уже
        готовится к отправке. 🕯️
      </p>

      <h2 style={styles.sectionTitle}>Детали заказа:</h2>
      <div>
        {parsedItems.map((item) => (
          <OrderItemCard key={item.id} item={item} />
        ))}
      </div>

      <h3 style={styles.description}>
        Стоимость товаров: {fullPrice - deliveryPrice} ₽
      </h3>
      <h3 style={styles.description}>Стоимость доставки: {deliveryPrice} ₽</h3>
      <h2 style={styles.totalPrice}>Общая сумма: {fullPrice} ₽</h2>

      <p style={styles.footerText}>
        Если у вас есть вопросы, пожалуйста, свяжитесь с нашей службой
        поддержки. Мы всегда готовы помочь! 💜
      </p>
    </div>
  );
};
