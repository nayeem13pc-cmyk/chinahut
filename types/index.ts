// ============================================================
// ChinaHut - Shared TypeScript Types
// ============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  category?: Category;
  cost_price: number;
  selling_price: number;
  stock_count: number;
  image_url?: string;
  is_active: boolean;
  profit_per_unit?: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  purchase_count: number;
  total_spent: number;
  first_order_at?: string;
  last_order_at?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product?: Product;
  product_name: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
}

export type OrderStatus = 'new' | 'in_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer_id?: string;
  customer?: Customer;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  status: OrderStatus;
  total_amount: number;
  total_cost: number;
  notes?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DashboardStats {
  new_orders: number;
  in_delivery_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_revenue: number;
  net_profit: number;
  total_customers: number;
  repeat_customers: number;
  active_products: number;
}

export interface CheckoutFormData {
  name: string;
  phone: string;
  email?: string;
  address: string;
  notes?: string;
}
