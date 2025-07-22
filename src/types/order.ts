export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  productId: string;
}

export interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  userId: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

export interface OrderStatusUpdate {
  status: string;
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface OrderSummary {
  totalOrders: number;
  totalAmount: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
}
