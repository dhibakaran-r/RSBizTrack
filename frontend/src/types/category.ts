// Shape of data coming FROM the API (response)
export interface Category {
    id: number;
    name: string;
    description: string | null;
    business_id: number;
    is_active: boolean;
    created_at: string;
}

// Shape of data going TO the API (create)
export interface CategoryCreate {
  name: string;
  description?: string;
  business_id: number;
}

// Shape of data going TO the API (update)
export interface CategoryUpdate {
  name: string;
  description?: string;
  business_id: number;
  is_active?: boolean;
}