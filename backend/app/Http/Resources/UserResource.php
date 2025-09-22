<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'roles' => $this->whenLoaded('roles', function () {
                return $this->roles->pluck('name');
            }),
            'permissions' => $this->getUserPermissions(),
        ];

        // If user is a student, include student data
        if ($this->hasRole('siswa')) {
            $data['student'] = $this->whenLoaded('student', function () {
                return [
                    'id' => $this->student->id,
                    'gender' => $this->student->gender,
                    'parent_name' => $this->student->parent_name,
                    'parent_number' => $this->student->parent_number,
                    'study_program' => $this->student->studyProgram ? [
                        'id' => $this->student->studyProgram->id,
                        'name' => $this->student->studyProgram->name,
                        'code' => $this->student->studyProgram->code,
                    ] : null,
                    'cohort' => $this->student->cohort ? [
                        'id' => $this->student->cohort->id,
                        'year' => $this->student->cohort->year,
                    ] : null,
                ];
            });
        } else {
            // If user is employee, include employee data
            $data['employee'] = $this->whenLoaded('employee', function () {
                $employeeData = [
                    'id' => $this->employee->id,
                    'nip' => $this->employee->nip,
                    'unit' => $this->employee->unit ? [
                        'id' => $this->employee->unit->id,
                        'name' => $this->employee->unit->name,
                    ] : null,
                    'position' => $this->employee->position ? [
                        'id' => $this->employee->position->id,
                        'name' => $this->employee->position->name,
                    ] : null,
                ];

                // Get direct superior using helper method
                $directSuperior = $this->employee->directSuperior();
                if ($directSuperior && $directSuperior->user) {
                    $employeeData['direct_superior'] = [
                        'id' => $directSuperior->user->id,
                        'name' => $directSuperior->user->name,
                        'nip' => $directSuperior->nip,
                        'position' => $directSuperior->position ? [
                            'id' => $directSuperior->position->id,
                            'name' => $directSuperior->position->name,
                        ] : null,
                    ];
                } else {
                    $employeeData['direct_superior'] = null;
                }

                return $employeeData;
            });

            // Add approval hierarchy for panjar workflow
            $data['approval_hierarchy'] = $this->getApprovalHierarchy();
            $data['finance_verification_hierarchy'] = $this->getFinanceVerificationHierarchy();
            $data['finance_tax_verification_hierarchy'] = $this->getFinanceTaxVerificationHierarchy();
            $data['finance_approval_hierarchy'] = $this->getFinanceApprovalHierarchy();
        }

        return $data;
    }

    /**
     * Get approval hierarchy based on user role
     * Shows who can verify and approve in the workflow
     */
    private function getApprovalHierarchy()
    {
        if (! $this->relationLoaded('roles') || ! $this->employee) {
            return null;
        }

        $userRoles = $this->roles->pluck('name');
        $hierarchy = [];

        // Kepala Urusan - can see wakil-kepala-sekolah and kepala-sekolah
        if ($userRoles->contains('kepala-urusan')) {
            // Get wakil-kepala-sekolah from same unit
            $wakilKepala = $this->getWakilKepalaByUnit($this->employee->unit_id);
            if ($wakilKepala) {
                $hierarchy['verifiers'] = [[
                    'id' => $wakilKepala->id,
                    'name' => $wakilKepala->name,
                    'email' => $wakilKepala->email,
                    'position' => $wakilKepala->employee->position->name,
                    'role' => 'wakil-kepala-sekolah',
                    'unit' => $wakilKepala->employee->unit ? [
                        'id' => $wakilKepala->employee->unit->id,
                        'name' => $wakilKepala->employee->unit->name,
                    ] : null,
                ]];
            } else {
                $hierarchy['verifiers'] = [];
            }

            // Get kepala-sekolah
            $kepalaSekolah = $this->getKepalaSekolah();
            if ($kepalaSekolah) {
                $hierarchy['approvers'] = [[
                    'id' => $kepalaSekolah->id,
                    'name' => $kepalaSekolah->name,
                    'email' => $kepalaSekolah->email,
                    'position' => $kepalaSekolah->employee->position->name,
                    'role' => 'kepala-sekolah',
                ]];
            } else {
                $hierarchy['approvers'] = [];
            }
        }

        // Wakil Kepala Sekolah - can see themselves and kepala-sekolah
        elseif ($userRoles->contains('wakil-kepala-sekolah')) {
            // Show themselves as verifier
            $hierarchy['verifiers'] = [[
                'id' => $this->id,
                'name' => $this->name,
                'email' => $this->email,
                'role' => 'wakil-kepala-sekolah',
                'position' => $this->employee->position->name,
                'unit' => $this->employee->unit ? [
                    'id' => $this->employee->unit->id,
                    'name' => $this->employee->unit->name,
                ] : null,
            ]];

            // Get kepala-sekolah as approver
            $kepalaSekolah = $this->getKepalaSekolah();
            if ($kepalaSekolah) {
                $hierarchy['approvers'] = [[
                    'id' => $kepalaSekolah->id,
                    'name' => $kepalaSekolah->name,
                    'email' => $kepalaSekolah->email,
                    'position' => $kepalaSekolah->employee->position->name,
                    'role' => 'kepala-sekolah',
                ]];
            } else {
                $hierarchy['approvers'] = [];
            }
        }

        // Kepala Sekolah - can see all verifiers from all units
        elseif ($userRoles->contains('kepala-sekolah')) {
            // Get all wakil-kepala-sekolah from all units as verifiers
            $allWakilKepala = $this->getAllWakilKepala();
            if ($allWakilKepala && $allWakilKepala->isNotEmpty()) {
                $hierarchy['verifiers'] = $allWakilKepala->map(function ($wakilKepala) {
                    return [
                        'id' => $wakilKepala->id,
                        'name' => $wakilKepala->name,
                        'email' => $wakilKepala->email,
                        'position' => $wakilKepala->employee->position->name,
                        'role' => 'wakil-kepala-sekolah',
                        'unit' => $wakilKepala->employee->unit ? [
                            'id' => $wakilKepala->employee->unit->id,
                            'name' => $wakilKepala->employee->unit->name,
                        ] : null,
                    ];
                })->toArray();
            } else {
                $hierarchy['verifiers'] = [];
            }

            // Show themselves as approver
            $hierarchy['approvers'] = [[
                'id' => $this->id,
                'name' => $this->name,
                'email' => $this->email,
                'position' => $this->employee->position->name,
                'role' => 'kepala-sekolah',
            ]];
        }

        // Kepala Administrasi - can see all verifiers from all units and approvers
        elseif ($userRoles->contains('kepala-administrasi')) {
            // Get all wakil-kepala-sekolah from all units as verifiers
            $allWakilKepala = $this->getAllWakilKepala();
            if ($allWakilKepala && $allWakilKepala->isNotEmpty()) {
                $hierarchy['verifiers'] = $allWakilKepala->map(function ($wakilKepala) {
                    return [
                        'id' => $wakilKepala->id,
                        'name' => $wakilKepala->name,
                        'email' => $wakilKepala->email,
                        'position' => $wakilKepala->employee->position->name,
                        'role' => 'wakil-kepala-sekolah',
                        'unit' => $wakilKepala->employee->unit ? [
                            'id' => $wakilKepala->employee->unit->id,
                            'name' => $wakilKepala->employee->unit->name,
                        ] : null,
                    ];
                })->toArray();
            } else {
                $hierarchy['verifiers'] = [];
            }

            // Get kepala-sekolah as approver
            $kepalaSekolah = $this->getKepalaSekolah();
            if ($kepalaSekolah) {
                $hierarchy['approvers'] = [[
                    'id' => $kepalaSekolah->id,
                    'name' => $kepalaSekolah->name,
                    'email' => $kepalaSekolah->email,
                    'position' => $kepalaSekolah->employee->position->name,
                    'role' => 'kepala-sekolah',
                ]];
            } else {
                $hierarchy['approvers'] = [];
            }
        }

        // Default empty arrays for roles without hierarchy
        if (! isset($hierarchy['verifiers'])) {
            $hierarchy['verifiers'] = [];
        }
        if (! isset($hierarchy['approvers'])) {
            $hierarchy['approvers'] = [];
        }

        return $hierarchy;
    }

    private function getFinanceVerificationHierarchy()
    {
        $user = User::whereHas('employee.position', function ($query) {
            $query->where('slug', 'kepala-urusan-keuangan');
        })->first();

        if (! $user) {
            return null;
        }

        $hierarchy = [];
        $hierarchy['finance_verifiers'] = [[
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => 'kepala-urusan-keuangan',
            'position' => $user->employee->position->name,
        ]];

        return $hierarchy;
    }

    private function getFinanceTaxVerificationHierarchy()
    {
        $user = User::whereHas('employee.position', function ($query) {
            $query->where('slug', 'kepala-urusan-human-capital');
        })->first();

        if (! $user) {
            return null;
        }

        $hierarchy = [];
        $hierarchy['finance_tax_verifiers'] = [[
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => 'kepala-urusan-human-capital',
            'position' => $user->employee->position->name,
        ]];

        return $hierarchy;
    }

    private function getFinanceApprovalHierarchy()
    {
        $user = User::whereHas('employee.position', function ($query) {
            $query->where('slug', 'kepala-administrasi');
        })->first();

        if (! $user) {
            return null;
        }

        $hierarchy = [];
        $hierarchy['finance_approvers'] = [[
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => 'kepala-administrasi',
            'position' => $user->employee->position->name,
        ]];

        return $hierarchy;
    }

    private function getAllWakilKepala()
    {
        return \App\Models\User::whereHas('roles', function ($query) {
            $query->where('name', 'wakil-kepala-sekolah');
        })->with(['employee.unit'])->get();
    }

    /**
     * Get wakil-kepala-sekolah by unit
     */
    private function getWakilKepalaByUnit($unitId)
    {
        return \App\Models\User::whereHas('roles', function ($query) {
            $query->where('name', 'wakil-kepala-sekolah');
        })->whereHas('employee', function ($query) use ($unitId) {
            $query->where('unit_id', $unitId);
        })->with(['employee.unit'])->first();
    }

    /**
     * Get kepala-sekolah
     */
    private function getKepalaSekolah()
    {
        return \App\Models\User::whereHas('roles', function ($query) {
            $query->where('name', 'kepala-sekolah');
        })->first();
    }

    /**
     * Get all user permissions (direct + via roles)
     */
    private function getUserPermissions()
    {
        // Get all permissions for this user (both direct and via roles)
        $allPermissions = $this->getAllPermissions();

        return [
            'all_permissions' => $allPermissions->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'guard_name' => $permission->guard_name,
                    'source' => $this->getPermissionSource($permission),
                ];
            })->values(),
            'permission_names' => $allPermissions->pluck('name')->unique()->values(),
            'permissions_via_roles' => $this->getPermissionsViaRoles(),
            'direct_permissions' => $this->getDirectPermissions(),
        ];
    }

    /**
     * Get permission source (direct or via role)
     */
    private function getPermissionSource($permission)
    {
        // Check if user has this permission directly
        $hasDirectPermission = $this->permissions->contains('id', $permission->id);

        if ($hasDirectPermission) {
            return 'direct';
        }

        // Check which roles give this permission
        $rolesWithPermission = $this->roles->filter(function ($role) use ($permission) {
            return $role->permissions->contains('id', $permission->id);
        });

        if ($rolesWithPermission->isNotEmpty()) {
            return 'via_roles: '.$rolesWithPermission->pluck('name')->implode(', ');
        }

        return 'unknown';
    }

    /**
     * Get permissions inherited from roles
     */
    private function getPermissionsViaRoles()
    {
        if (! $this->relationLoaded('roles')) {
            return [];
        }

        $rolesPermissions = [];

        foreach ($this->roles as $role) {
            $rolePermissions = $role->permissions->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'guard_name' => $permission->guard_name,
                ];
            });

            if ($rolePermissions->isNotEmpty()) {
                $rolesPermissions[] = [
                    'role' => [
                        'id' => $role->id,
                        'name' => $role->name,
                        'guard_name' => $role->guard_name,
                    ],
                    'permissions' => $rolePermissions->values(),
                ];
            }
        }

        return $rolesPermissions;
    }

    /**
     * Get direct permissions assigned to user
     */
    private function getDirectPermissions()
    {
        return $this->whenLoaded('permissions', function () {
            return $this->permissions->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'guard_name' => $permission->guard_name,
                ];
            });
        }) ?: [];
    }
}
