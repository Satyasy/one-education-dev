<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
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
            'user_id' => $this->user_id,
            'unit_id' => $this->unit_id,
            'position_id' => $this->position_id,
            'nip' => $this->nip,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Relationships
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'email_verified_at' => $this->user->email_verified_at,
                    'created_at' => $this->user->created_at,
                    'updated_at' => $this->user->updated_at,
                ];
            }),

            'unit' => $this->whenLoaded('unit', function () {
                return [
                    'id' => $this->unit->id,
                    'name' => $this->unit->name,
                    'description' => $this->unit->description,
                    'code' => $this->unit->code,
                ];
            }),

            'position' => $this->whenLoaded('position', function () {
                return [
                    'id' => $this->position->id,
                    'name' => $this->position->name,
                    'description' => $this->position->description,
                    'level' => $this->position->level,
                ];
            }),

            // Additional computed fields
            'direct_superior' => $this->when($request->include_relations, function () {
                $superior = $this->directSuperior();

                return $superior ? [
                    'id' => $superior->id,
                    'nip' => $superior->nip,
                    'user' => [
                        'id' => $superior->user->id,
                        'name' => $superior->user->name,
                        'email' => $superior->user->email,
                    ],
                    'position' => [
                        'id' => $superior->position->id,
                        'name' => $superior->position->name,
                    ],
                ] : null;
            }),

            'subordinates' => $this->when($request->include_relations, function () {
                $subordinates = $this->allSubordinates();

                return $subordinates->map(function ($subordinate) {
                    return [
                        'id' => $subordinate->id,
                        'nip' => $subordinate->nip,
                        'user' => [
                            'id' => $subordinate->user->id,
                            'name' => $subordinate->user->name,
                            'email' => $subordinate->user->email,
                        ],
                        'position' => [
                            'id' => $subordinate->position->id,
                            'name' => $subordinate->position->name,
                        ],
                    ];
                });
            }),
        ];
    }
}
