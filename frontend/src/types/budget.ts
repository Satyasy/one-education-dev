import { Unit } from "./unit";

export interface Budget {
    id: number;
    budget_year: BudgetYear;
    quarterly: number;
    unit: Unit;
    unit_id: number;
}
export interface BudgetYear{
    id: number;
    year: number;
    is_active: boolean;
}

export interface BudgetItem {
    id: number;
    name: string;
    description: string;
    amount_allocation: number;
}

export interface BudgetDetail {
    id: number;
    budget_year: BudgetYear;
    quarterly: number;
    unit: Unit;
    budget_items: BudgetItem[];
}

// Budget for API response
export type BudgetResponse = {
    data: Budget[];
    meta: {
        total: number;
        total_pages: number;
    };
};

// Budget for API request
export interface BudgetRequest {
    budget_year_id: number;
    quarterly: number;
    unit_id: number;
    budget_items: BudgetItem[];
}

