import { OrderItem } from "./OrderItem";
export interface Order {
  id: string;
  name: string;
  phone: string;
  email: string;
  wishes: string | null;
  comment: string;
  token: string;
  created_at: string;
  items: OrderItem[];
  fullPrice: string;
  paymentId: string;
  status: string;
  delivery_method: string;
  delivery_price: string;
  city: string;
  street: string;
  building: string;
  porch: string;
  sfloor: string;
  sflat: string;
}
