<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PanjarItemResource extends JsonResource
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
            'item_name' => $this->item_name,
            'spesification' => $this->spesification,
            'quantity' => $this->quantity,
            'unit' => $this->unit,
            'price' => $this->price,
            'total' => $this->total,
            'description' => $this->description,
            'status' => $this->status,
            'status_label' => $this->getStatusLabel(),
            'status_color' => $this->getStatusColor(),
            'panjar_request' => $this->whenLoaded('panjarRequest', function () {
                return [
                    'id' => $this->panjarRequest->id,
                    'status' => $this->panjarRequest->status,
                    'request_date' => $this->panjarRequest->request_date,
                ];
            }),
            'history' => $this->whenLoaded('panjarItemHistories', function () {
                return $this->panjarItemHistories->map(function ($history) {
                    return [
                        'id' => $history->id,
                        'note' => $history->note,
                        'reviewed_by' => $history->reviewed_by,
                        'reviewer_role' => $history->reviewer_role,
                        'created_at' => $history->created_at,
                    ];
                });
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Get human readable status label
     */
    private function getStatusLabel()
    {
        $labels = [
            'pending' => 'Menunggu',
            'verified' => 'Diverifikasi',
            'approved' => 'Disetujui',
            'rejected' => 'Ditolak',
            'revision' => 'Revisi',
        ];

        return $labels[$this->status] ?? $this->status;
    }

    /**
     * Get status color for UI
     */
    private function getStatusColor()
    {
        $colors = [
            'pending' => 'warning',
            'verified' => 'info',
            'approved' => 'success',
            'rejected' => 'danger',
            'revision' => 'secondary',
        ];

        return $colors[$this->status] ?? 'default';
    }
} 