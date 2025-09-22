<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\Request;
use App\Services\BudgetService;
use App\Http\Requests\BudgetRequest;
use App\Http\Resources\BudgetResource;

class BudgetController extends Controller
{
    protected BudgetService $budgetService;

    public function __construct(BudgetService $budgetService)
    {
        $this->budgetService = $budgetService;
    }

    public function index(Request $request)
    {
        $fields = ['id', 'unit_id', 'budget_year_id', 'quarterly'];
        $params = [
            'search' => $request->input('search'),
            'unit_id' => $request->input('unit_id'),
            'quarterly' => $request->input('quarterly'),
            'budget_year_id' => $request->input('budget_year_id'),
            'active_year_only' => $request->input('active_year_only'),
            'sort_field' => $request->input('sort_field', 'created_at'),
            'sort_order' => $request->input('sort_order', 'desc'),
            'page' => (int) $request->input('page', 1),
            'per_page' => (int) $request->input('per_page', 10),
        ];

        $budgets = $this->budgetService->getAll($fields, $params);

        // Transform data tanpa budget_items untuk list
        $transformedData = collect($budgets['data'])->map(function ($budget) {
            $resource = new BudgetResource($budget);
            $data = $resource->toArray(request());
            unset($data['budget_items']); // Remove budget_items dari response
            return $data;
        });

        return response()->json([
            'message' => 'Budgets retrieved successfully',
            'data' => $transformedData,
            'meta' => $budgets['meta']
        ]); 
    }

    public function show(int $id)
    {
        $fields = ['id', 'unit_id', 'budget_year_id', 'quarterly'];
        $budget = $this->budgetService->getById($id, $fields);
        return response()->json([
            'message' => 'Budget retrieved successfully',
            'data' => new BudgetResource($budget)
        ]);
    }

    public function getBudgetItems(int $id)
    {
        $budgetItems = $this->budgetService->getBudgetItemsByBudgetId($id);
        return response()->json([
            'message' => 'Budget items retrieved successfully',
            'data' => new BudgetResource($budgetItems)
        ]);
    }

    public function store(BudgetRequest $request)
    {
        $data = $request->validated();
        $budget = $this->budgetService->create($data);
        return response()->json([
            'message' => 'Budget created successfully',
            'data' => new BudgetResource($budget)
        ], 201);
    }

    public function update(BudgetRequest $request, int $id)
    {
        $data = $request->validated();
        $budget = $this->budgetService->update($id, $data);
        return response()->json([
            'message' => 'Budget updated successfully',
            'data' => new BudgetResource($budget)
        ]);
    }

    public function destroy(int $id)
    {
        $this->budgetService->delete($id);
        return response()->json([
            'message' => 'Budget deleted successfully'
        ]);
    }

    public function checkExisting(Request $request)
    {
        $request->validate([
            'unit_id' => 'required|integer',
            'budget_year_id' => 'required|integer',
            'quarterly' => 'required|integer|min:1|max:4'
        ]);

        $existingBudget = $this->budgetService->findExisting(
            $request->unit_id,
            $request->budget_year_id,
            $request->quarterly
        );

        if ($existingBudget) {
            return response()->json([
                'message' => 'Budget already exists',
                'exists' => true,
                'data' => new BudgetResource($existingBudget)
            ]);
        }

        return response()->json([
            'message' => 'Budget does not exist',
            'exists' => false,
            'data' => null
        ]);
    }
    
}
