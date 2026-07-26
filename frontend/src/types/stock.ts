// Simple stock — for update response
export interface Stock {
  id: number;
  product_id: number;
  quantity: number;
  last_updated: string;
}

// Stock with product name — for list view
export interface StockWithProduct {
  id: number;
  product_id: number;
  product_name: string;  
  quantity: number;
  last_updated: string;
}

export interface StockUpdate {
  quantity: number;
}