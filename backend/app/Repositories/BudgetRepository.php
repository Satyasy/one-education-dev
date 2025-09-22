<?php

namespace App\Repositories;

use App\Models\Budget;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class BudgetRepository {
    public function getAll(array $fields, array $params = []){
        $query = Budget::select($fields)
            ->with(['unit', 'budgetYear', 'budgetItems', 'panjarRequests'])
            ->whereHas('budgetYear', function (Builder $query) {
                $query->where('is_active', true);
            });
        // Get current user
        $user = Auth::user();

        // If user is admin or kepala-sekolah, show all data
        if ($user && $user->hasRole(['admin', 'kepala-sekolah','kepala-administrasi'])) {
            // No additional filter needed - show all data
        } else {
            // For other roles, apply unit_id filter if provided
            if (!empty($params['unit_id'])) {
                $query->where('unit_id', $params['unit_id']);
            }
        }

        if (!empty($params['search'])) {
            $searchTerm = $params['search'];
            $query->where(function($q) use ($searchTerm) {
                $q->where('quarterly', 'like', '%' . $searchTerm . '%')
                    ->orWhereHas('budgetYear', function($query) use ($searchTerm) {
                        $query->where('year', 'like', '%' . $searchTerm . '%');
                    });
            });
        }

        // Filter by quarterly if provided
        if (!empty($params['quarterly'])) {
            $query->where('quarterly', $params['quarterly']);
        }

        // Filter by budget year if provided
        if (!empty($params['budget_year_id'])) {
            $query->where('budget_year_id', $params['budget_year_id']);
        }

        // Filter by active budget year if requested
        if (!empty($params['active_year_only'])) {
            $query->whereHas('budgetYear', function($query) {
                $query->where('is_active', true);
            });
        }

        //Handle Pagination
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

    public function getById(int $id, array $fields){
        return Budget::select($fields)
            ->with(['unit', 'budgetYear', 'budgetItems', 'panjarRequests'])
            ->findOrFail($id);
    }

    public function create(array $data){
        $dataBudget = [
            'unit_id' => $data['unit_id'],
            'budget_year_id' => $data['budget_year_id'],
            'quarterly' => $data['quarterly'],
        ];
        $dataBudgetItems = $data['budget_items'];
        
        DB::beginTransaction();
        try {
            // Check if budget already exists with same unit, budget_year_id, and quarterly
            $existingBudget = Budget::where('unit_id', $data['unit_id'])
                ->where('budget_year_id', $data['budget_year_id'])
                ->where('quarterly', $data['quarterly'])
                ->first();

            if ($existingBudget) {
                // Update existing budget by replacing budget items
                $existingBudget->budgetItems()->delete(); // Delete existing budget items
                
                foreach ($dataBudgetItems as $item) {
                    $existingBudget->budgetItems()->create([
                        'name' => $item['name'],
                        'description' => $item['description'] ?? null,
                        'amount_allocation' => $item['amount_allocation'],
                    ]);
                }
                
                DB::commit();
                return $existingBudget->load(['unit', 'budgetYear', 'budgetItems']);
            } else {
                // Create new budget
                $budget = Budget::create($dataBudget);
                
                foreach ($dataBudgetItems as $item) {
                    $budget->budgetItems()->create([
                        'name' => $item['name'],
                        'description' => $item['description'] ?? null,
                        'amount_allocation' => $item['amount_allocation'],
                    ]);
                }
                
                DB::commit();
                return $budget->load(['unit', 'budgetYear', 'budgetItems']);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getBudgetItemsByBudgetId(int $budgetId){
        return Budget::with(['budgetItems', 'unit', 'budgetYear'])
            ->findOrFail($budgetId);
    }

    public function update(int $id, array $data){
        DB::beginTransaction();
        try {
            $budget = Budget::findOrFail($id);
            
            // Update budget data
            $budgetData = [
                'unit_id' => $data['unit_id'],
                'budget_year_id' => $data['budget_year_id'],
                'quarterly' => $data['quarterly'],
            ];
            $budget->update($budgetData);
            
            // Update budget items if provided
            if (isset($data['budget_items'])) {
                // Delete existing budget items
                $budget->budgetItems()->delete();
                
                // Create new budget items
                foreach ($data['budget_items'] as $item) {
                    $budget->budgetItems()->create([
                        'name' => $item['name'],
                        'description' => $item['description'] ?? null,
                        'amount_allocation' => $item['amount_allocation'],
                    ]);
                }
            }
            
            DB::commit();
            return $budget->load(['unit', 'budgetYear', 'budgetItems']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function delete(int $id){
        $budget = Budget::findOrFail($id);
        $budget->delete();
        return $budget;
    }

    public function findExisting(int $unitId, int $budgetYearId, int $quarterly)
    {
        return Budget::where('unit_id', $unitId)
            ->where('budget_year_id', $budgetYearId)
            ->where('quarterly', $quarterly)
            ->with(['unit', 'budgetYear', 'budgetItems'])
            ->first();
    }
}   