<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\BudgetYearService;
use App\Http\Requests\BudgetYearRequest;

class BudgetYearController extends Controller
{
    protected BudgetYearService $service;

    public function __construct(BudgetYearService $service)
    {
        $this->service = $service;
    }

    /**
     * Get all budget years for select dropdown
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function forSelect(): JsonResponse
    {
        $budgetYears = $this->service->getAllForSelect();
        
        return response()->json([
            'message' => 'Budget years retrieved successfully for select',
            'data' => $budgetYears->map(function ($budgetYear) {
                return [
                    'value' => $budgetYear->id,
                    'label' => $budgetYear->year . ($budgetYear->is_active ? ' (Aktif)' : ''),
                    'year' => $budgetYear->year,
                    'is_active' => $budgetYear->is_active,
                ];
            })
        ], 200);
    }

    /**
     * Display a listing of budget years
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 10);
        $budgetYears = $this->service->getAllPaginated($perPage);
        
        return response()->json([
            'message' => 'Budget years retrieved successfully',
            'data' => $budgetYears
        ], 200);
    }

    /**
     * Store a newly created budget year
     *
     * @param  \App\Http\Requests\BudgetYearRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(BudgetYearRequest $request): JsonResponse
    {
        $budgetYear = $this->service->create($request->validated());
        
        return response()->json([
            'message' => 'Budget year created successfully',
            'data' => $budgetYear
        ], 201);
    }

    /**
     * Display the specified budget year
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $budgetYear = $this->service->getById($id);
        
        return response()->json([
            'message' => 'Budget year retrieved successfully',
            'data' => $budgetYear
        ], 200);
    }

    /**
     * Update the specified budget year
     *
     * @param  \App\Http\Requests\BudgetYearRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(BudgetYearRequest $request, int $id): JsonResponse
    {
        $budgetYear = $this->service->update($id, $request->validated());
        
        return response()->json([
            'message' => 'Budget year updated successfully',
            'data' => $budgetYear
        ], 200);
    }

    /**
     * Remove the specified budget year
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        
        return response()->json([
            'message' => 'Budget year deleted successfully'
        ], 200);
    }

    /**
     * Set active budget year
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function setActive(int $id): JsonResponse
    {
        $budgetYear = $this->service->setActive($id);
        
        return response()->json([
            'message' => 'Budget year set as active successfully',
            'data' => $budgetYear
        ], 200);
    }
}
