<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BudgetItemResource extends JsonResource
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
            'budget' => $this->whenLoaded('budget', function () {
                return [
                    'id' => $this->budget->id,
                    'unit' => $this->budget->unit ? $this->budget->unit->name : null,
                    'budget_year' => $this->budget->budgetYear ? [
                        'id' => $this->budget->budgetYear->id,
                        'year' => $this->budget->budgetYear->year,
                    ] : null,
                ];
            }),
            'name' => $this->name,
            'description' => $this->description,
            'amount_allocation' => $this->amount_allocation,
        ];
    }
}
