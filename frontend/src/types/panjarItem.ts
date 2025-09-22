export interface PanjarItemRequest 
{
    status: string;
    note: string;
}

export interface CreatePanjarItemRequest {
    item_name: string;
    spesification: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
    description: string;
}

export interface UpdatePanjarItemRequest {
    item_name: string;
    spesification: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
    description: string;
    status: string;
    note: string;
}