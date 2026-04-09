import { axiosInstance } from "@/app/lib/api/axiosInstance";
import { ApiEndpoints } from "@/app/lib/api/endpoints";

export type CreateOrderPayload = {
  customerName: string;
  items: { menuItemId: string; quantity: number }[];
  phone?: string;
  email?: string;
  deliveryAddress?: string;
  orderType: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  paymentMethod: "cash" | "card" | "online";
  tableNumber?: number;
};

export const createOrder = async (payload: CreateOrderPayload) => {
  const response = await axiosInstance.post(ApiEndpoints.orderMenus, payload);
  return response.data;
};

export const order_menus = createOrder;
