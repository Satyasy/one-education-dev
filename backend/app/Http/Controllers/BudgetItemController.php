<?php

namespace App\Http\Controllers;

use App\Http\Requests\BudgetItemRequest;
use App\Http\Resources\BudgetItemResource;
use Illuminate\Http\Request;
use App\Services\BudgetItemService;
use App\Http\Resources\BudgetItemSelectResource;

class BudgetItemController extends Controller
{
    protected $budgetItemService;

    public function __construct(BudgetItemService $budgetItemService)
    {
        $this->budgetItemService = $budgetItemService;
    }

    /**
     * Get all budget items for select input
     * Optimized for dropdown/select components
     */
    public function forSelect(Request $request)
    {
        $fields = ['id', 'name', 'budget_id', 'remaining_amount'];
        $params = [
            'budget_id' => $request->input('budget_id'),
            'unit_id' => $request->input('unit_id'),
            'search' => $request->input('search'),
            'has_remaining_budget' => $request->boolean('has_remaining_budget', false),
        ];

        $budgetItems = $this->budgetItemService->getAllForSelect($fields, $params);

        return response()->json([
            'data' => BudgetItemSelectResource::collection($budgetItems)
        ]);
    }

    /**
     * Get budget items by budget ID (for cascading selects)
     */
    public function getByBudget(int $budgetId)
    {
        $fields = ['id', 'name', 'budget_id', 'remaining_amount'];
        $budgetItems = $this->budgetItemService->getByBudget($budgetId, $fields);

        return response()->json([
            'data' => BudgetItemSelectResource::collection($budgetItems)
        ]);
    }

    /**
     * Get budget items by unit ID
     */
    public function getByUnit(int $unitId)
    {
        $fields = ['id', 'name', 'budget_id', 'remaining_amount'];
        $budgetItems = $this->budgetItemService->getByUnit($unitId, $fields);

        return response()->json([
            'data' => BudgetItemSelectResource::collection($budgetItems)
        ]);
    }

    public function store(BudgetItemRequest $request)
    {
        $data = $request->validated();
        $budgetItem = $this->budgetItemService->create($data);

        return response()->json([
            'message' => 'Budget item created successfully',
            'data' => new BudgetItemResource($budgetItem)
        ], 201);
    }
} 