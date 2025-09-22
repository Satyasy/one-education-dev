<?php

namespace App\Repositories;

use App\Models\Unit;

class UnitRepository
{
    /**
     * Get all units for select dropdown
     * Returns only id and name for better performance
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllForSelect()
    {
        return Unit::select('id', 'name', 'code')
            ->orderBy('name', 'asc')
            ->get();
    }

    /**
     * Get all units with pagination
     *
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllPaginated(int $perPage = 10)
    {
        return Unit::with(['head:id,name'])
            ->orderBy('name', 'asc')
            ->paginate($perPage);
    }

    /**
     * Get unit by ID
     *
     * @param int $id
     * @return \App\Models\Unit
     */
    public function getById(int $id)
    {
        return Unit::with(['head:id,name', 'employees'])
            ->findOrFail($id);
    }

    /**
     * Create new unit
     *
     * @param array $data
     * @return \App\Models\Unit
     */
    public function create(array $data)
    {
        return Unit::create($data);
    }

    /**
     * Update unit
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\Unit
     */
    public function update(int $id, array $data)
    {
        $unit = Unit::findOrFail($id);
        $unit->update($data);
        return $unit->fresh();
    }

    /**
     * Delete unit
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id)
    {
        $unit = Unit::findOrFail($id);
        return $unit->delete();
    }

    /**
     * Get units by parent ID
     *
     * @param int|null $parentId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByParentId($parentId = null)
    {
        return Unit::where('parent_id', $parentId)
            ->orderBy('name', 'asc')
            ->get();
    }

    /**
     * Search units by name
     *
     * @param string $search
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function searchByName(string $search)
    {
        return Unit::where('name', 'LIKE', "%{$search}%")
            ->orWhere('code', 'LIKE', "%{$search}%")
            ->orderBy('name', 'asc')
            ->get();
    }
}