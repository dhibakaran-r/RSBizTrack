// Shape of data coming FROM the API (response)
export interface Business {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
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
  isActive?: boolean;
}