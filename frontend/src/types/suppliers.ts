// Shape of data coming FROM the API (response)
export interface Supplier {
    id: number
    name: string
    company: string | null
    phone: string | null
    email: string | null
    address: string | null
    gstin: string | null
    is_active: boolean
    created_at: string
}

// Shape of data going TO the API (create)
export interface SupplierCreate {
    name: string
    company: string | null
    phone: string | null
    email: string | null
    address: string | null
    gstin: string | null
}

// Shape of data going TO the API (update)
export interface SupplierUpdate {
    name: string | null
    company: string | null
    phone: string | null
    email: string | null
    address: string | null
    gstin: string | null
    is_active: boolean | null
}