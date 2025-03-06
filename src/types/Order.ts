import { CartItem } from "@/store/useCartStore";

export interface Order {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  delivery_address?: string | null;
  wishes?: string | null;
  floor: string;
  comment?: string | null;
  token: string;
  fullPrice: number;
  paymentId: string;
  status: "SUCCEEDED" | "CANCELLED" | "PENDING";
  items: CartItem[];
}
