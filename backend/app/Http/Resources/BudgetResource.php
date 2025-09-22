<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BudgetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'unit' => $this->whenLoaded('unit', function () {
                return [
                    'id' => $this->unit->id,
                    'name' => $this->unit->name
                ];
            }),
            'budget_year' => $this->whenLoaded('budgetYear', function () {
                return [
                    'id' => $this->budgetYear->id,
                    'year' => $this->budgetYear->year,
                    'is_active' => $this->budgetYear->is_active,
                    'description' => $this->budgetYear->description
                ];
            }),
            'quarterly' => $this->quarterly,
            'budget_items' => $this->whenLoaded('budgetItems', function () {
                return $this->budgetItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'description' => $item->description,
                        'amount_allocation' => $item->amount_allocation,
                        'realization_amount' => $item->realization_amount,
                        'remaining_amount' => $item->remaining_amount,
                    ];
                });
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
