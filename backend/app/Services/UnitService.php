<?php

namespace App\Services;

use App\Repositories\UnitRepository;

class UnitService
{
    protected UnitRepository $repository;

    public function __construct(UnitRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Get all units for select dropdown
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllForSelect()
    {
        return $this->repository->getAllForSelect();
    }

    /**
     * Get all units with pagination
     *
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllPaginated(int $perPage = 10)
    {
        return $this->repository->getAllPaginated($perPage);
    }

    /**
     * Get unit by ID
     *
     * @param int $id
     * @return \App\Models\Unit
     */
    public function getById(int $id)
    {
        return $this->repository->getById($id);
    }

    /**
     * Create new unit
     *
     * @param array $data
     * @return \App\Models\Unit
     */
    public function create(array $data)
    {
        return $this->repository->create($data);
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
        return $this->repository->update($id, $data);
    }

    /**
     * Delete unit
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id)
    {
        return $this->repository->delete($id);
    }
}