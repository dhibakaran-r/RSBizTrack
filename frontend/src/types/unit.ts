// Shape of data coming FROM the API (response)
export interface Business {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

// Shape of data going TO the API (create)
export interface BusinessCreate {
  name: string;
  description?: string;
}

// Shape of data going TO the API (update)
export interface BusinessUpdate {
  name?: string;
  description?: string;
  is_active?: boolean;
}