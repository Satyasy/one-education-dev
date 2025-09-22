<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Services\EmployeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EmployeeController extends Controller
{
    protected EmployeeService $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse|AnonymousResourceCollection
    {
        try {
            $perPage = $request->get('per_page');
            $filters = $request->only(['unit_id', 'position_id', 'nip', 'search']);

            $employees = $this->employeeService->getAll($perPage, $filters);

            if ($perPage) {
                return EmployeeResource::collection($employees);
            }

            return EmployeeResource::collection($employees);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve employees',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EmployeeRequest $request): JsonResponse
    {
        try {
            $employee = $this->employeeService->create($request->validated());

            return response()->json([
                'message' => 'Employee created successfully',
                'data' => new EmployeeResource($employee),
            ], 201);
        } catch (\Exception $e) {
            if ($e->getCode() === 409) {
                return response()->json(['message' => $e->getMessage()], 409);
            }

            return response()->json([
                'message' => 'Failed to create employee',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $employee = $this->employeeService->getById((int) $id);

            return response()->json([
                'message' => 'Employee retrieved successfully',
                'data' => new EmployeeResource($employee),
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() === 404) {
                return response()->json(['message' => $e->getMessage()], 404);
            }

            return response()->json([
                'message' => 'Failed to retrieve employee',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EmployeeRequest $request, string $id): JsonResponse
    {
        try {
            $employee = $this->employeeService->update((int) $id, $request->validated());

            return response()->json([
                'message' => 'Employee updated successfully',
                'data' => new EmployeeResource($employee),
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() === 404) {
                return response()->json(['message' => $e->getMessage()], 404);
            }
            if ($e->getCode() === 409) {
                return response()->json(['message' => $e->getMessage()], 409);
            }

            return response()->json([
                'message' => 'Failed to update employee',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->employeeService->delete((int) $id);

            return response()->json([
                'message' => 'Employee deleted successfully',
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() === 404) {
                return response()->json(['message' => $e->getMessage()], 404);
            }

            return response()->json([
                'message' => 'Failed to delete employee',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get employee by user ID.
     */
    public function getByUserId(string $userId): JsonResponse
    {
        try {
            $employee = $this->employeeService->getByUserId((int) $userId);

            if (! $employee) {
                return response()->json([
                    'message' => 'Employee not found for this user',
                ], 404);
            }

            return response()->json([
                'message' => 'Employee retrieved successfully',
                'data' => new EmployeeResource($employee),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve employee',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get employee by NIP.
     */
    public function getByNip(string $nip): JsonResponse
    {
        try {
            $employee = $this->employeeService->getByNip($nip);

            if (! $employee) {
                return response()->json([
                    'message' => 'Employee not found with this NIP',
                ], 404);
            }

            return response()->json([
                'message' => 'Employee retrieved successfully',
                'data' => new EmployeeResource($employee),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve employee',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get employees by unit ID.
     */
    public function getByUnitId(string $unitId): JsonResponse
    {
        try {
            $employees = $this->employeeService->getByUnitId((int) $unitId);

            return response()->json([
                'message' => 'Employees retrieved successfully',
                'data' => EmployeeResource::collection($employees),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve employees',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get employees by position ID.
     */
    public function getByPositionId(string $positionId): JsonResponse
    {
        try {
            $employees = $this->employeeService->getByPositionId((int) $positionId);

            return response()->json([
                'message' => 'Employees retrieved successfully',
                'data' => EmployeeResource::collection($employees),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve employees',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get employee statistics.
     */
    public function statistics(): JsonResponse
    {
        try {
            $statistics = $this->employeeService->getEmployeeStatistics();

            return response()->json([
                'message' => 'Employee statistics retrieved successfully',
                'data' => $statistics,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve employee statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
