<?php

namespace App\Services;

use App\Repositories\BudgetItemRepository;

class BudgetItemService
{
    protected $budgetItemRepository;

    public function __construct(BudgetItemRepository $budgetItemRepository)
    {
        $this->budgetItemRepository = $budgetItemRepository;
    }

    /**
     * Get all budget items for select input with filters
     */
    public function getAllForSelect(array $fields, array $params = [])
    {
        return $this->budgetItemRepository->getAllForSelect($fields, $params);
    }

    /**
     * Get budget items by budget ID
     */
    public function getByBudget(int $budgetId, array $fields)
    {
        return $this->budgetItemRepository->getByBudget($budgetId, $fields);
    }

    /**
     * Get budget items by unit ID (through budget relationship)
     */
    public function getByUnit(int $unitId, array $fields)
    {
        return $this->budgetItemRepository->getByUnit($unitId, $fields);
    }

    /**
     * Create a new budget item
     */
    public function create(array $data)
    {
        return $this->budgetItemRepository->create($data);
    }
} 