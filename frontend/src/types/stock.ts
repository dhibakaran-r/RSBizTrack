// Shape of data coming FROM the API (response)
export interface Stock {
    id: number
    product_id: number
    quantity: number
    last_updated: string
}

// Shape of data going TO the API (create)
export interface StockCreate {
    product_id: number
    quantity?: number | null
}

// Shape of data going TO the API (update)
export interface StockUpdate {
  quantity?: number | null
}