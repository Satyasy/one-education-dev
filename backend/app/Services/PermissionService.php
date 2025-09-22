<?php

namespace App\Services;

use App\Repositories\PermissionRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;
use Symfony\Component\HttpFoundation\Response;

class PermissionService
{
    protected PermissionRepository $permissionRepository;

    public function __construct(PermissionRepository $permissionRepository)
    {
        $this->permissionRepository = $permissionRepository;
    }

    public function getAll(?int $perPage = null, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->permissionRepository->getAll($perPage, $filters);
    }

    public function getById(int $id): Permission
    {
        $permission = $this->permissionRepository->getById($id);

        if (! $permission) {
            throw new \Exception('Permission not found', Response::HTTP_NOT_FOUND);
        }

        return $permission;
    }

    public function create(array $data): Permission
    {
        // Set default guard if not provided
        if (! isset($data['guard_name'])) {
            $data['guard_name'] = 'web';
        }

        // Validate unique constraint
        if ($this->permissionRepository->nameExists($data['name'], $data['guard_name'])) {
            throw new \Exception('Permission name already exists for this guard', Response::HTTP_CONFLICT);
        }

        return $this->permissionRepository->create($data);
    }

    public function update(int $id, array $data): Permission
    {
        $permission = $this->getById($id);

        // Set default guard if not provided
        if (! isset($data['guard_name'])) {
            $data['guard_name'] = $permission->guard_name;
        }

        // Validate unique constraint
        if (isset($data['name']) && $this->permissionRepository->nameExists($data['name'], $data['guard_name'], $id)) {
            throw new \Exception('Permission name already exists for this guard', Response::HTTP_CONFLICT);
        }

        return $this->permissionRepository->update($permission, $data);
    }

    public function delete(int $id): bool
    {
        $permission = $this->getById($id);

        // Check if permission is assigned to any roles
        if ($permission->roles()->count() > 0) {
            throw new \Exception('Cannot delete permission that is assigned to roles. Please remove from roles first.', Response::HTTP_CONFLICT);
        }

        // Check if permission is assigned to any users directly
        if ($permission->users()->count() > 0) {
            throw new \Exception('Cannot delete permission that is assigned to users. Please remove from users first.', Response::HTTP_CONFLICT);
        }

        return $this->permissionRepository->delete($permission);
    }

    public function getByName(string $name, ?string $guardName = null): ?Permission
    {
        return $this->permissionRepository->getByName($name, $guardName);
    }

    public function getPermissionsByGuard(string $guardName): Collection
    {
        return $this->permissionRepository->getPermissionsByGuard($guardName);
    }

    public function getPermissionsWithRoles(): Collection
    {
        return $this->permissionRepository->getPermissionsWithRoles();
    }

    public function getPermissionStatistics(): array
    {
        return $this->permissionRepository->getPermissionStatistics();
    }

    public function getForSelect(): Collection
    {
        return $this->permissionRepository->getForSelect();
    }

    public function bulkDelete(array $ids): array
    {
        $deletedCount = 0;
        $errors = [];

        foreach ($ids as $id) {
            try {
                $this->delete($id);
                $deletedCount++;
            } catch (\Exception $e) {
                $errors[] = "ID {$id}: ".$e->getMessage();
            }
        }

        return [
            'deleted_count' => $deletedCount,
            'errors' => $errors,
            'total_requested' => count($ids),
        ];
    }

    public function searchByName(string $name): Collection
    {
        return $this->permissionRepository->searchByName($name);
    }

    public function assignToRole(int $permissionId, int $roleId): bool
    {
        $permission = $this->getById($permissionId);

        // Check if role exists
        $role = \Spatie\Permission\Models\Role::find($roleId);
        if (! $role) {
            throw new \Exception('Role not found', Response::HTTP_NOT_FOUND);
        }

        // Check if already assigned
        if ($role->hasPermissionTo($permission)) {
            throw new \Exception('Permission already assigned to this role', Response::HTTP_CONFLICT);
        }

        $role->givePermissionTo($permission);

        return true;
    }

    public function removeFromRole(int $permissionId, int $roleId): bool
    {
        $permission = $this->getById($permissionId);

        // Check if role exists
        $role = \Spatie\Permission\Models\Role::find($roleId);
        if (! $role) {
            throw new \Exception('Role not found', Response::HTTP_NOT_FOUND);
        }

        // Check if assigned
        if (! $role->hasPermissionTo($permission)) {
            throw new \Exception('Permission not assigned to this role', Response::HTTP_CONFLICT);
        }

        $role->revokePermissionTo($permission);

        return true;
    }

    public function syncWithRole(int $permissionId, array $roleIds): array
    {
        $permission = $this->getById($permissionId);

        // Get valid roles
        $roles = \Spatie\Permission\Models\Role::whereIn('id', $roleIds)->get();

        if ($roles->count() !== count($roleIds)) {
            throw new \Exception('Some roles not found', Response::HTTP_NOT_FOUND);
        }

        // Sync permissions
        foreach ($roles as $role) {
            $role->givePermissionTo($permission);
        }

        // Remove from roles not in the list
        $allRolesWithPermission = $permission->roles;
        foreach ($allRolesWithPermission as $role) {
            if (! in_array($role->id, $roleIds)) {
                $role->revokePermissionTo($permission);
            }
        }

        return [
            'assigned_roles' => $roles->count(),
            'permission_name' => $permission->name,
        ];
    }

    public function exists(int $id): bool
    {
        return $this->permissionRepository->exists($id);
    }
}
