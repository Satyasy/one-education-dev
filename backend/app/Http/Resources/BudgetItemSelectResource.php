<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BudgetItemSelectResource extends JsonResource
{
    /**
     * Transform the resource into an array optimized for select inputs.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'label' => $this->name, // For easier frontend integration
            'value' => $this->id,   // For easier frontend integration
            'remaining_amount' => $this->remaining_amount,
            'remaining_amount_formatted' => 'Rp ' . number_format($this->remaining_amount, 0, ',', '.'),
            'budget' => $this->whenLoaded('budget', function () {
                return [
                    'id' => $this->budget->id,
                    'unit_id' => $this->budget->unit_id,
                    'year' => $this->budget->budgetYear->year ?? null,
                    'quarterly' => $this->budget->quarterly,
                ];
            }),
            // Combined display text for complex selects
            'display_text' => $this->name . ' (Sisa: Rp ' . number_format($this->remaining_amount, 0, ',', '.') . ')',
        ];
    }
}