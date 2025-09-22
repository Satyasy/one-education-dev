import { Unit } from "./unit";

export interface BudgetSelect {
    id: number;
    unit: Unit;
    year: number;
    quarterly: number;
}

export interface BudgetItemSelect {
    id: number;
    name: string;
    label: string;
    value: number;
    remaining_amount_formatted: string;
    budget: BudgetSelect;
    display_text: string;
}
