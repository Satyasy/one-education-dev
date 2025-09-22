<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;

class PermissionRepository
{
    public function getAll(?int $perPage = null, array $filters = []): Collection|LengthAwarePaginator
    {
        $query = Permission::query();

        // Apply search filter
        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('guard_name', 'like', '%'.$search.'%');
            });
        }

        // Apply guard filter
        if (! empty($filters['guard_name'])) {
            $query->where('guard_name', $filters['guard_name']);
        }

        // Order by name by default
        $query->orderBy('name', 'asc');

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    public function getById(int $id): ?Permission
    {
        return Permission::find($id);
    }

    public function create(array $data): Permission
    {
        return Permission::create($data);
    }

    public function update(Permission $permission, array $data): Permission
    {
        $permission->update($data);

        return $permission->fresh();
    }

    public function delete(Permission $permission): bool
    {
        return $permission->delete();
    }

    public function getByName(string $name, ?string $guardName = null): ?Permission
    {
        $query = Permission::where('name', $name);

        if ($guardName) {
            $query->where('guard_name', $guardName);
        }

        return $query->first();
    }

    public function exists(int $id): bool
    {
        return Permission::where('id', $id)->exists();
    }

    public function nameExists(string $name, ?string $guardName = null, ?int $excludeId = null): bool
    {
        $query = Permission::where('name', $name);

        if ($guardName) {
            $query->where('guard_name', $guardName);
        }

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    public function getPermissionsByGuard(string $guardName): Collection
    {
        return Permission::where('guard_name', $guardName)
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getPermissionsWithRoles(): Collection
    {
        return Permission::with(['roles' => function ($query) {
            $query->select('id', 'name');
        }])
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getPermissionStatistics(): array
    {
        return [
            'total_permissions' => Permission::count(),
            'permissions_by_guard' => Permission::selectRaw('guard_name, count(*) as total')
                ->groupBy('guard_name')
                ->get()
                ->map(function ($item) {
                    return [
                        'guard_name' => $item->guard_name,
                        'total' => $item->total,
                    ];
                }),
            'permissions_with_roles_count' => Permission::has('roles')
                ->count(),
            'permissions_without_roles_count' => Permission::doesntHave('roles')
                ->count(),
        ];
    }

    public function getForSelect(): Collection
    {
        return Permission::select('id', 'name', 'guard_name')
            ->orderBy('name', 'asc')
            ->get();
    }

    public function bulkDelete(array $ids): int
    {
        return Permission::whereIn('id', $ids)->delete();
    }

    public function searchByName(string $name): Collection
    {
        return Permission::where('name', 'like', '%'.$name.'%')
            ->orderBy('name', 'asc')
            ->get();
    }
}
