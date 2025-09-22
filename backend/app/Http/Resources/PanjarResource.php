<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PanjarResource extends JsonResource
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
            'budget_item' => $this->whenLoaded('budgetItem', function () {
                return [
                    'id' => $this->budgetItem->id,
                    'name' => $this->budgetItem->name,
                    'description' => $this->budgetItem->description,
                    'amount_allocation' => $this->budgetItem->amount_allocation,
                    'realization_amount' => $this->budgetItem->realization_amount,
                    'remaining_amount' => $this->budgetItem->remaining_amount,
                ];
            }),
            'total_amount' => $this->total_amount,
            'request_date' => $this->request_date,
            'approved_by' => $this->whenLoaded('approver', function () {
                return [
                    'id' => $this->approver->id,
                    'name' => $this->approver->name,
                    'email' => $this->approver->email
                ];
            }),
            'verified_by' => $this->whenLoaded('verifier', function () {
                return [
                    'id' => $this->verifier->id,
                    'name' => $this->verifier->name,
                    'email' => $this->verifier->email
                ];
            }),
            'created_by' => $this->whenLoaded('creator', function () {
                return [
                    'id' => $this->creator->id,
                    'name' => $this->creator->name,
                    'email' => $this->creator->email,
                    'position' => $this->creator->employee && $this->creator->employee->position ? [
                        'id' => $this->creator->employee->position->id,
                        'name' => $this->creator->employee->position->name,
                    ] : null,
                ];
            }),
            'status' => $this->status,
            'report_status' => $this->report_status,
            'unit' => $this->whenLoaded('unit', function () {
                return [
                    'id' => $this->unit->id,
                    'name' => $this->unit->name
                ];
            }),
            'panjar_items' => $this->whenLoaded('items', function () {
                return $this->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'item_name' => $item->item_name,
                        'spesification' => $item->spesification,
                        'quantity' => $item->quantity,
                        'unit' => $item->unit,
                        'price' => $item->price,
                        'total' => $item->total,
                        'status' => $item->status,
                        'description' => $item->description,
                        'panjar_item_histories' => $item->relationLoaded('panjarItemHistories') ? 
                            $item->panjarItemHistories->map(function ($history) {
                                return [
                                    'id' => $history->id,
                                    'note' => $history->note,
                                    'status' => $history->status,
                                    'reviewed_by' => $history->user->name,
                                    'reviewer_role' => $history->reviewer_role,
                                    'created_at' => $history->created_at,
                                ];
                            }) : [],
                    ];
                });
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
