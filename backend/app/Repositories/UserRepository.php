<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class UserRepository
{
    public function getAll(array $fields, array $params = [])
    {
        $query = User::select($fields)->with(['roles', 'permissions']);

        // Add conditional eager loading based on role
        $query->with(['employee.unit', 'employee.position', 'student.studyProgram', 'student.cohort']);

        // Add eager loading for roles and their permissions
        $query->with(['roles.permissions']);

        // Handle search
        if (! empty($params['search'])) {
            $searchTerm = $params['search'];
            $query->where(function (Builder $q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }

        // Handle role filter
        if (! empty($params['role'])) {
            $query->whereHas('roles', function (Builder $q) use ($params) {
                $q->where('name', $params['role']);
            });
        }

        // Handle unit filter (only for employees)
        if (! empty($params['unit_id'])) {
            $query->whereHas('employee', function (Builder $q) use ($params) {
                $q->where('unit_id', $params['unit_id']);
            });
        }

        // Handle sorting
        $sortField = $params['sort_field'] ?? 'created_at';
        $sortOrder = $params['sort_order'] ?? 'desc';
        $query->orderBy($sortField, $sortOrder);

        // Handle pagination
        $perPage = $params['per_page'] ?? 20;
        $page = $params['page'] ?? 1;

        $result = $query->paginate($perPage, ['*'], 'page', $page);

        return [
            'data' => $result->items(),
            'meta' => [
                'page' => $result->currentPage(),
                'per_page' => $result->perPage(),
                'total' => $result->total(),
                'total_pages' => $result->lastPage(),
            ],
        ];
    }

    public function getAllUserStatistics()
    {
        $definedRoles = ['admin', 'guru', 'staff', 'user', 'wakil-kepala-sekolah'];

        // Get role counts in a single query
        $roleCounts = DB::table('model_has_roles')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->whereIn('roles.name', $definedRoles)
            ->groupBy('roles.name')
            ->pluck(DB::raw('count(*)'), 'roles.name');

        $totalUsers = User::count();

        // Build statistics dynamically
        $statistics = collect($definedRoles)
            ->mapWithKeys(fn ($role) => [$role => $roleCounts->get($role, 0)])
            ->prepend($totalUsers, 'all')
            ->put('others', $totalUsers - $roleCounts->sum())
            ->toArray();

        return $statistics;
    }

    public function getById(int $id, array $fields)
    {
        return User::select($fields)
            ->with(['roles', 'permissions', 'roles.permissions', 'employee.unit', 'employee.position', 'student.studyProgram', 'student.cohort'])
            ->findOrFail($id);
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function update(int $id, array $data)
    {
        $user = User::findOrFail($id);
        $user->update($data);

        return $user;
    }

    public function delete(int $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return $user;
    }
}
