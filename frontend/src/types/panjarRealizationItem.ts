// Base interface untuk properti umum
export interface PanjarRealizationItemBase {
    id?: number;
    panjar_request_id?: number;
    item_name?: string;
    spesification?: string;
    description?: string;
    unit?: string;
    quantity?: number;
    price?: number | string;
    total?: number | string;
    report_status?: string;
    created_at?: string;
}

// Interface untuk request (form submission)
export interface PanjarRealizationItemRequest extends PanjarRealizationItemBase {
    receipt_file?: File;
    item_photo?: File;
}

// Interface untuk response (API response)
export interface PanjarRealizationItemResponse extends PanjarRealizationItemBase {
    panjar_request?: {
        id: number;
        total_amount: string;
        unit: string;
        budget_item: {
            id: number;
            name: string;
            description: string;
        };
    };
    receipt_file?: string; // URL string dari server
    item_photo?: string;   // URL string dari server
}

// Alias untuk backward compatibility
export type PanjarRealizationItem = PanjarRealizationItemResponse;