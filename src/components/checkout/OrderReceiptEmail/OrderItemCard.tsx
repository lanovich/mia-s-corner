import { findSelectedSize } from "@/lib";
import { OrderItem } from "@/types/OrderItem";
import { styles } from "./styles";

export const OrderItemCard: React.FC<{ item: OrderItem; size_id: number }> = ({
  item,
  size_id,
}) => {
  const selectedSize = findSelectedSize(item.product, size_id);

  return (
    <div style={styles.itemContainer}>
      <img
        src={item.product.images[0].url}
        alt={item.product.title}
        style={styles.itemImage}
      />
      <div style={styles.itemDetails}>
        <h3 style={styles.itemTitle}>{item.product.title}</h3>
        <p style={styles.itemText}>
          Размер: {selectedSize?.size || "Не указан"} {item.product.measure}
        </p>
        <p style={styles.itemText}>Состав: {item.product.compound}</p>
        <p style={styles.itemPrice}>
          {selectedSize?.price || 0} ₽ x {item.quantity} шт.
        </p>
      </div>
    </div>
  );
};
