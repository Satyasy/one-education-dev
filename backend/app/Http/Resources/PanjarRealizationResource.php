<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PanjarRealizationResource extends JsonResource
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
            'panjar_request_id' => $this->panjar_request_id,
            'panjar_request' => $this->whenLoaded('panjarRequest', function () {
                return [
                    'id' => $this->panjarRequest->id,
                    'total_amount' => $this->panjarRequest->total_amount,
                    'unit' => $this->panjarRequest->unit ? $this->panjarRequest->unit->name : null,
                    'budget_item' => $this->panjarRequest->budgetItem ? [
                        'id' => $this->panjarRequest->budgetItem->id,
                        'name' => $this->panjarRequest->budgetItem->name,
                        'description' => $this->panjarRequest->budgetItem->description,
                    ] : null,
                ];
            }),
            'item_name' => $this->item_name,
            'spesification' => $this->spesification,
            'unit' => $this->unit,
            'price' => $this->price,
            'quantity' => $this->quantity,
            'total' => $this->total,
            'report_status' => $this->report_status,
            'receipt_file' => $this->receipt_file ? asset('storage/' . $this->receipt_file) : null,
            'item_photo' => $this->item_photo ? asset('storage/' . $this->item_photo) : null,
            'description' => $this->description,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
