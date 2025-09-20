import { OrderItem } from "@/entities/order/model";
import { OrderItemCard } from "../OrderReceiptEmail/OrderItemCard";
import { styles } from "./styles";

interface NewOrderAlertEmailProps {
  orderId: string;
  fullPrice: number;
  deliveryPrice: number;
  items: string;
  deliveryMethod: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryComment?: string;
  wishes?: string;
  deliveryAddress?: {
    city: string;
    street: string;
    building: string;
    porch?: string;
    floor?: string;
    flat?: string;
  };
}

export const NewOrderAlertEmail: React.FC<NewOrderAlertEmailProps> = ({
  orderId,
  fullPrice,
  deliveryPrice,
  items,
  wishes,
  deliveryComment,
  deliveryMethod,
  customerName,
  customerPhone,
  customerEmail,
  deliveryAddress,
}) => {
  const parsedItems: OrderItem[] = JSON.parse(items);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Новый заказ #{String(orderId).slice(0,6)}</h1>
      <p style={styles.description}>
        Поступил новый заказ, который требует обработки. Ниже приведены детали
        заказа:
      </p>

      <h2 style={styles.sectionTitle}>Информация о клиенте:</h2>
      <p style={styles.description}>
        <strong>Имя:</strong> {customerName}
      </p>
      <p style={styles.description}>
        <strong>Телефон:</strong> {customerPhone}
      </p>
      <p style={styles.description}>
        <strong>Email:</strong> {customerEmail}
      </p>

      <h2 style={styles.sectionTitle}>Метод доставки:</h2>
      <p style={styles.description}>{deliveryMethod}</p>

      {deliveryAddress && (
        <>
          <h2 style={styles.sectionTitle}>Адрес доставки:</h2>
          <p style={styles.description}>
            <strong>Город:</strong> {deliveryAddress.city}
          </p>
          <p style={styles.description}>
            <strong>Улица:</strong> {deliveryAddress.street}
          </p>
          <p style={styles.description}>
            <strong>Дом:</strong> {deliveryAddress.building}
          </p>
          {deliveryAddress.porch && (
            <p style={styles.description}>
              <strong>Подъезд:</strong> {deliveryAddress.porch}
            </p>
          )}
          {deliveryAddress.floor && (
            <p style={styles.description}>
              <strong>Этаж:</strong> {deliveryAddress.floor}
            </p>
          )}
          {deliveryAddress.flat && (
            <p style={styles.description}>
              <strong>Квартира:</strong> {deliveryAddress.flat}
            </p>
          )}

          <h2 style={styles.sectionTitle}>Комментарии:</h2>
          <p style={styles.description}>
            <strong>Пожелания к заказу: </strong> {wishes}
          </p>

          <p style={styles.description}>
            <strong>Комментарий курьеру: </strong> {deliveryComment}
          </p>
        </>
      )}

      <h2 style={styles.sectionTitle}>Детали заказа:</h2>
      <div>
        {parsedItems.map((item) => (
          <OrderItemCard key={item.id} item={item} size_id={item.size_id} />
        ))}
      </div>

      <h3 style={styles.description}>
        <strong>Стоимость товаров:</strong> {fullPrice - deliveryPrice} ₽
      </h3>
      <h3 style={styles.description}>
        <strong>Стоимость доставки:</strong> {deliveryPrice} ₽
      </h3>
      <h2 style={styles.totalPrice}>
        <strong>Общая сумма:</strong> {fullPrice} ₽
      </h2>
    </div>
  );
};
