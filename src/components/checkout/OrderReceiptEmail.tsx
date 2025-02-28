import React from "react";
import { Product } from "@/types";

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  product_id: number;
}

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
    <div style={{ maxWidth: "600px", margin: "0 auto", background: "#f9f9f9", padding: "20px", borderRadius: "8px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333", textAlign: "center" }}>Ваш заказ #{orderId}</h1>
      <p style={{ color: "#555", textAlign: "center" }}>
        Спасибо, что выбрали нас! 🕯️ Мы очень рады вашему заказу. Для оплаты перейдите{" "}
        <a href={paymentUrl} style={{ color: "#007bff", textDecoration: "none" }}>по этой ссылке</a>.
      </p>
      
      <h2 style={{ borderBottom: "2px solid #ddd", paddingBottom: "10px", marginTop: "20px", color: "#444" }}>Состав заказа:</h2>
      <div>
        {parsedItems.map((item) => (
          <div key={item.id} style={{ display: "flex", background: "#fff", borderRadius: "6px", padding: "10px", marginBottom: "10px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <img
              src={item.product.image_url}
              alt={item.product.title}
              style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
            />
            <div style={{ marginLeft: "15px" }}>
              <h3 style={{ margin: "0 0 5px", fontSize: "16px", color: "#333" }}>{item.product.title}</h3>
              <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>Размер: {item.product.size}</p>
              <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>Состав: {item.product.compound}</p>
              <p style={{ margin: "5px 0 0", fontWeight: "bold", fontSize: "14px", color: "#444" }}>
                {item.product.price} ₽ x {item.quantity} шт.
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <h2 style={{ textAlign: "right", fontSize: "18px", fontWeight: "bold", marginTop: "20px", color: "#333" }}>
        Общая сумма: {fullPrice} ₽
      </h2>
      
      <p style={{ textAlign: "center", fontSize: "14px", color: "#777", marginTop: "20px" }}>
        Если у вас есть вопросы, мы всегда на связи. Спасибо за доверие! 💙
      </p>
    </div>
  );
};