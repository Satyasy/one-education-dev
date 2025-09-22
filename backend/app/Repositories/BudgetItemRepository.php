<?php

namespace App\Repositories;

use App\Models\BudgetItem;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class BudgetItemRepository
{
    /**
     * Get all budget items optimized for select input
     */
    public function getAllForSelect(array $fields, array $params = [])
    {
        $query = BudgetItem::select($fields)
            ->with(['budget:id,unit_id,budget_year_id,quarterly', 'budget.budgetYear:id,year']);

        // Get current user for role-based filtering
        $user = Auth::user();

        // Apply role-based filtering
        if ($user && !$user->hasRole(['admin', 'kepala-sekolah'])) {
            // For non-admin users, filter by unit_id through budget relationship
            if (!empty($params['unit_id'])) {
                $query->whereHas('budget', function ($q) use ($params) {
                    $q->where('unit_id', $params['unit_id']);
                });
            } else if ($user->employee && $user->employee->unit_id) {
                // Default to user's own unit if no unit_id specified
                $query->whereHas('budget', function ($q) use ($user) {
                    $q->where('unit_id', $user->employee->unit_id);
                });
            }
        }

        // Filter by budget_id if provided
        if (!empty($params['budget_id'])) {
            $query->where('budget_id', $params['budget_id']);
        }

        // Filter by unit_id if provided (through budget relationship)
        if (!empty($params['unit_id'])) {
            $query->whereHas('budget', function ($q) use ($params) {
                $q->where('unit_id', $params['unit_id']);
            });
        }

        // Search by name
        if (!empty($params['search'])) {
            $query->where('name', 'like', '%' . $params['search'] . '%');
        }

        // Filter items that have remaining budget (for panjar requests)
        if (!empty($params['has_remaining_budget'])) {
            $query->where('remaining_amount', '>', 0);
        }

        return $query->orderBy('name', 'asc')->get();
    }

    /**
     * Get budget items by budget ID
     */
    public function getByBudget(int $budgetId, array $fields)
    {
        return BudgetItem::select($fields)
            ->where('budget_id', $budgetId)
            ->where('remaining_amount', '>', 0) // Only items with remaining budget
            ->orderBy('name', 'asc')
            ->get();
    }

    /**
     * Get budget items by unit ID (through budget relationship)
     */
    public function getByUnit(int $unitId, array $fields)
    {
        return BudgetItem::select($fields)
            ->with(['budget:id,unit_id'])
            ->whereHas('budget', function ($query) use ($unitId) {
                $query->where('unit_id', $unitId);
            })
            ->where('remaining_amount', '>', 0) // Only items with remaining budget
            ->orderBy('name', 'asc')
            ->get();
    }

    /**
     * Create a new budget item
     */
    public function create(array $data)
    {
        return BudgetItem::create($data);
    }
}