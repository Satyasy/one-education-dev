<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PanjarRequestModelPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Use existing permissions from the table
        $permissions = [
            'create panjar-requests',
            'edit panjar-requests',
            'view panjar-requests',
            'delete panjar-requests',
            'verify panjar-requests',
            'approve panjar-requests',
            'revise panjar-requests',
            'reject panjar-requests',
            'create panjar-items',
            'edit panjar-items',
            'view panjar-items',
            'delete panjar-items',
            'verify panjar-items',
            'approve panjar-items',
            'revise panjar-items',
            'reject panjar-items',
        ];

        // Create permissions if they don't exist
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Define role permissions mapping using existing permission names
        $rolePermissions = [
            'admin' => [
                'view panjar-requests',
                'create panjar-requests',
                'edit panjar-requests',
                'delete panjar-requests',
                'verify panjar-requests',
                'approve panjar-requests',
                'revise panjar-requests',
                'reject panjar-requests',
                'create panjar-items',
                'edit panjar-items',
                'view panjar-items',
                'delete panjar-items',
                'verify panjar-items',
                'approve panjar-items',
                'revise panjar-items',
                'reject panjar-items',
            ],

            'kepala-sekolah' => [
                'approve panjar-requests',
                'view panjar-requests',
                'approve panjar-items',
                'revise panjar-items',
                'reject panjar-items',
            ],
            'wakil-kepala-sekolah' => [
                'view panjar-requests',
                'verify panjar-requests',
                'revise panjar-items',
                'reject panjar-items',
            ],
            'kepala-administrasi' => ['view panjar-requests'],
            'kepala-urusan' => [
                'view panjar-requests',
                'create panjar-requests',
                'edit panjar-requests',
                'delete panjar-requests',
            ],
        ];

        // Assign permissions to roles
        foreach ($rolePermissions as $roleName => $rolePerms) {
            $role = Role::firstOrCreate(['name' => $roleName]);

            // Sync permissions for this role (removes old, adds new)
            $permissions = Permission::whereIn('name', $rolePerms)->get();
            $role->syncPermissions($permissions);

            $this->command->info("Assigned permissions to role '{$roleName}': ".implode(', ', $rolePerms));
        }
        $this->command->info('PanjarRequest model permissions seeding completed.');
    }
}
