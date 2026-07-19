export interface Product {
    id: number;
    name: string;
    description: string | null;
    business_id: number;
    category_id: number;
    unit_id: number;
    selling_price: number;
    cost_price: number;
    min_stock: number;
    is_active: boolean;
    created_at: string;
}

export interface ProductCreate {
    name: string;
    description?: string;
    business_id: number;
    category_id: number;
    unit_id: number;
    selling_price: number;
    cost_price: number;
    min_stock: number;
}

export interface ProductUpdate {
    name?: string | null;
    description?: string | null;
    business_id?: number | null;
    category_id?: number | null;
    unit_id?: number | null;
    selling_price?: number | null;
    cost_price?: number | null;
    min_stock?: number | null;
}