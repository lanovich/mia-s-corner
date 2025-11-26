import { OrderItem } from "@/entities/order/model";
import { styles } from "./styles";
import { unitMap } from "@/shared/lib";

export const OrderItemCard: React.FC<{ item: OrderItem }> = ({ item }) => {
  const { productInfo, productSizeInfo, quantityInOrder } = item;
  return (
    <div style={styles.itemContainer}>
      <img
        src={productSizeInfo.images[0]}
        alt={productInfo.title}
        style={styles.itemImage}
      />
      <div style={styles.itemDetails}>
        <h3 style={styles.itemTitle}>{productInfo.title}</h3>
        <p style={styles.itemText}>
          Размер: {productSizeInfo.volume.amount || "Не указан"}{" "}
          {productSizeInfo.volume.unit}
        </p>
        <p style={styles.itemText}>Состав: {productInfo.scentName}</p>
        <p style={styles.itemPrice}>
          {productSizeInfo.price || 0} ₽ x {quantityInOrder} шт.
        </p>
      </div>
    </div>
  );
};
