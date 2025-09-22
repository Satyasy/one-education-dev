export interface User {
    id: number;
    name: string;
    email: string;
    position?: Position;
}

export interface Unit {
    id: number;
    name: string;
}

export interface BudgetItem {
    id?: number;
    name?: string;
    description?: string;
    amount_allocation?: number;
    realization_amount?: number;
    remaining_amount?: number;
}

export interface PanjarItem {
    id?: number;
    item_name: string;
    spesification: string;
    description: string;
    quantity: number;
    unit: string;
    price: string;
    total: string;
    status: string;
    report_status: string;
    panjar_item_histories?: PanjarItemHistory[];
}

export interface Employee {
    id: number;
    name: string;
    position?: Position;
}

export interface Position{
    name: string;
    slug: string;
}

export interface PanjarItemHistory {
    id?: number;
    status: string;
    note: string;
    reviewed_by?: string;   
    created_at: string;
}

export interface Panjar {
    id?: number;
    budget_item?: BudgetItem;
    budget_item_id?: number;
    total_amount?: string;
    approved_by?: User;
    verified_by?: User;
    created_by?: User;
    finance_approval_by?: User;
    finance_verification_by?: User;
    finance_tax_verification_by?: User;
    request_date?: string;
    status?: string;
    report_status?: string;
    unit?: Unit;
    unit_id?: number;
    panjar_items?: PanjarItem[];
}

// Interface for API requests (ensures IDs are numbers)
export interface PanjarRequest {
    id?: number;
    budget_item_id?: number;
    total_amount?: string;
    created_by?: number;
    request_date?: string;
    verified_by?: number | null;
    unit_id?: number;
    panjar_items?: PanjarItem[];
}