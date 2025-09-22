<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\UnitService;
use App\Http\Requests\UnitRequest;

class UnitController extends Controller
{
    protected UnitService $service;

    public function __construct(UnitService $service)
    {
        $this->service = $service;
    }

    /**
     * Get all units for select dropdown
     * Optimized for frontend select components
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function forSelect(): JsonResponse
    {
        $units = $this->service->getAllForSelect();
        
        return response()->json([
            'message' => 'Units retrieved successfully for select',
            'data' => $units->map(function ($unit) {
                return [
                    'value' => $unit->id,
                    'label' => $unit->name,
                    'code' => $unit->code,
                ];
            })
        ], 200);
    }

    /**
     * Display a listing of the units with pagination
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 10);
        $units = $this->service->getAllPaginated($perPage);
        
        return response()->json([
            'message' => 'Units retrieved successfully',
            'data' => $units
        ], 200);
    }

    /**
     * Store a newly created unit in storage
     *
     * @param  \App\Http\Requests\UnitRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(UnitRequest $request): JsonResponse
    {
        $unit = $this->service->create($request->validated());
        
        return response()->json([
            'message' => 'Unit created successfully',
            'data' => $unit
        ], 201);
    }

    /**
     * Display the specified unit
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $unit = $this->service->getById($id);
        
        return response()->json([
            'message' => 'Unit retrieved successfully',
            'data' => $unit
        ], 200);
    }

    /**
     * Update the specified unit in storage
     *
     * @param  \App\Http\Requests\UnitRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UnitRequest $request, int $id): JsonResponse
    {
        $unit = $this->service->update($id, $request->validated());
        
        return response()->json([
            'message' => 'Unit updated successfully',
            'data' => $unit
        ], 200);
    }

    /**
     * Remove the specified unit from storage
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        
        return response()->json([
            'message' => 'Unit deleted successfully'
        ], 200);
    }
}
