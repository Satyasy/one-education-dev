<?php

namespace App\Repositories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EmployeeRepository
{
    public function getAll(?int $perPage = null, array $filters = []): Collection|LengthAwarePaginator
    {
        $query = Employee::with(['user', 'unit', 'position']);

        // Apply filters
        if (! empty($filters['unit_id'])) {
            $query->where('unit_id', $filters['unit_id']);
        }

        if (! empty($filters['position_id'])) {
            $query->where('position_id', $filters['position_id']);
        }

        if (! empty($filters['nip'])) {
            $query->where('nip', 'like', '%'.$filters['nip'].'%');
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('nip', 'like', '%'.$search.'%')
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', '%'.$search.'%')
                            ->orWhere('email', 'like', '%'.$search.'%');
                    });
            });
        }

        // Order by created_at desc by default
        $query->orderBy('created_at', 'desc');

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    public function getById(int $id): ?Employee
    {
        return Employee::with(['user', 'unit', 'position'])->find($id);
    }

    public function create(array $data): Employee
    {
        return Employee::create($data);
    }

    public function update(Employee $employee, array $data): Employee
    {
        $employee->update($data);

        return $employee->fresh(['user', 'unit', 'position']);
    }

    public function delete(Employee $employee): bool
    {
        return $employee->delete();
    }

    public function getByUserId(int $userId): ?Employee
    {
        return Employee::with(['user', 'unit', 'position'])
            ->where('user_id', $userId)
            ->first();
    }

    public function getByNip(string $nip): ?Employee
    {
        return Employee::with(['user', 'unit', 'position'])
            ->where('nip', $nip)
            ->first();
    }

    public function getByUnitId(int $unitId): Collection
    {
        return Employee::with(['user', 'unit', 'position'])
            ->where('unit_id', $unitId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getByPositionId(int $positionId): Collection
    {
        return Employee::with(['user', 'unit', 'position'])
            ->where('position_id', $positionId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function exists(int $id): bool
    {
        return Employee::where('id', $id)->exists();
    }

    public function nipExists(string $nip, ?int $excludeId = null): bool
    {
        $query = Employee::where('nip', $nip);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    public function userIdExists(int $userId, ?int $excludeId = null): bool
    {
        $query = Employee::where('user_id', $userId);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    public function getEmployeeStatistics(): array
    {
        return [
            'total_employees' => Employee::count(),
            'employees_by_unit' => Employee::selectRaw('unit_id, count(*) as total')
                ->with('unit:id,name')
                ->groupBy('unit_id')
                ->get()
                ->map(function ($item) {
                    return [
                        'unit_id' => $item->unit_id,
                        'unit_name' => $item->unit->name ?? 'Unknown',
                        'total' => $item->total,
                    ];
                }),
            'employees_by_position' => Employee::selectRaw('position_id, count(*) as total')
                ->with('position:id,name')
                ->groupBy('position_id')
                ->get()
                ->map(function ($item) {
                    return [
                        'position_id' => $item->position_id,
                        'position_name' => $item->position->name ?? 'Unknown',
                        'total' => $item->total,
                    ];
                }),
        ];
    }
}
