<?php

namespace App\Services;
use App\Repositories\BudgetRepository;

class BudgetService {
    protected $budgetRepository;

    public function __construct(BudgetRepository $budgetRepository)
    {
        $this->budgetRepository = $budgetRepository;
    }

    public function getAll(array $fields, array $params = [])
    {
        return $this->budgetRepository->getAll($fields, $params);
    }

    public function getById(int $id, array $fields)
    {
        return $this->budgetRepository->getById($id, $fields);
    }

    public function getBudgetItemsByBudgetId(int $budgetId)
    {
        return $this->budgetRepository->getBudgetItemsByBudgetId($budgetId);
    }

    public function create(array $data)
    {
        return $this->budgetRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->budgetRepository->update($id, $data);
    }

    public function delete(int $id)
    {
        return $this->budgetRepository->delete($id);
    }

    public function findExisting(int $unitId, int $budgetYearId, int $quarterly)
    {
        return $this->budgetRepository->findExisting($unitId, $budgetYearId, $quarterly);
    }
}