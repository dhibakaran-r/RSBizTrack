export interface DashboardStats {
  total_businesses: number;
  total_products: number;
  total_suppliers: number;
  total_categories: number;
  low_stock_count: number;
}

export interface RecentProduct {
  id: number;
  name: string;
  selling_price: number;
  created_at: string;
}

export interface LowStockProduct {
  id: number;
  name: string;
  current_stock: number;
  min_stock: number;
  shortage: number;
}