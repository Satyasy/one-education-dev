<?php

namespace App\Services;

use App\Repositories\BudgetYearRepository;

class BudgetYearService
{
    protected BudgetYearRepository $repository;

    public function __construct(BudgetYearRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Get all budget years for select dropdown
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllForSelect()
    {
        return $this->repository->getAllForSelect();
    }

    /**
     * Get all budget years with pagination
     *
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllPaginated(int $perPage = 10)
    {
        return $this->repository->getAllPaginated($perPage);
    }

    /**
     * Get budget year by ID
     *
     * @param int $id
     * @return \App\Models\BudgetYear
     */
    public function getById(int $id)
    {
        return $this->repository->getById($id);
    }

    /**
     * Create new budget year
     *
     * @param array $data
     * @return \App\Models\BudgetYear
     */
    public function create(array $data)
    {
        return $this->repository->create($data);
    }

    /**
     * Update budget year
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\BudgetYear
     */
    public function update(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    /**
     * Delete budget year
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id)
    {
        return $this->repository->delete($id);
    }

    /**
     * Set budget year as active
     *
     * @param int $id
     * @return \App\Models\BudgetYear
     */
    public function setActive(int $id)
    {
        return $this->repository->setActive($id);
    }
}
