<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PermissionResource extends JsonResource
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
            'name' => $this->name,
            'guard_name' => $this->guard_name,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Conditional relationships
            'roles' => $this->whenLoaded('roles', function () {
                return $this->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                        'guard_name' => $role->guard_name,
                    ];
                });
            }),

            'users' => $this->whenLoaded('users', function () {
                return $this->users->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ];
                });
            }),

            // Additional computed fields
            'roles_count' => $this->when($request->include_counts, function () {
                return $this->roles()->count();
            }),

            'users_count' => $this->when($request->include_counts, function () {
                return $this->users()->count();
            }),

            'is_assigned' => $this->when($request->include_assignment_status, function () {
                return $this->roles()->count() > 0 || $this->users()->count() > 0;
            }),

            // Format for select dropdowns
            'label' => $this->when($request->for_select, function () {
                return $this->name.' ('.$this->guard_name.')';
            }),

            'value' => $this->when($request->for_select, function () {
                return $this->id;
            }),
        ];
    }
}
