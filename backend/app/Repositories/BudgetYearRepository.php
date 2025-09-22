<?php

namespace App\Repositories;

use App\Models\BudgetYear;

class BudgetYearRepository
{
    /**
     * Get all budget years for select dropdown
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllForSelect()
    {
        return BudgetYear::select('id', 'year', 'is_active', 'description')
            ->orderBy('year', 'desc')
            ->get();
    }

    /**
     * Get all budget years with pagination
     *
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllPaginated(int $perPage = 10)
    {
        return BudgetYear::orderBy('year', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get budget year by ID
     *
     * @param int $id
     * @return \App\Models\BudgetYear
     */
    public function getById(int $id)
    {
        return BudgetYear::findOrFail($id);
    }

    /**
     * Create new budget year
     *
     * @param array $data
     * @return \App\Models\BudgetYear
     */
    public function create(array $data)
    {
        return BudgetYear::create($data);
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
        $budgetYear = BudgetYear::findOrFail($id);
        $budgetYear->update($data);
        return $budgetYear->fresh();
    }

    /**
     * Delete budget year
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id)
    {
        $budgetYear = BudgetYear::findOrFail($id);
        return $budgetYear->delete();
    }

    /**
     * Set budget year as active (and deactivate others)
     *
     * @param int $id
     * @return \App\Models\BudgetYear
     */
    public function setActive(int $id)
    {
        // Deactivate all budget years first
        BudgetYear::query()->update(['is_active' => false]);
        
        // Activate the selected one
        $budgetYear = BudgetYear::findOrFail($id);
        $budgetYear->update(['is_active' => true]);
        
        return $budgetYear;
    }

    /**
     * Get active budget year
     *
     * @return \App\Models\BudgetYear|null
     */
    public function getActive()
    {
        return BudgetYear::where('is_active', true)->first();
    }
}
