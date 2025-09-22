<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Services\PermissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PermissionController extends Controller
{
    protected PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse|AnonymousResourceCollection
    {
        try {
            $perPage = $request->get('per_page');
            $filters = $request->only(['search', 'guard_name']);

            $permissions = $this->permissionService->getAll($perPage, $filters);

            if ($perPage) {
                return PermissionResource::collection($permissions);
            }

            return PermissionResource::collection($permissions);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve permissions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PermissionRequest $request): JsonResponse
    {
        try {
            $permission = $this->permissionService->create($request->validated());

            return response()->json([
                'message' => 'Permission created successfully',
                'data' => new PermissionResource($permission),
            ], 201);
        } catch (\Exception $e) {
            if ($e->getCode() === 409) {
                return response()->json(['message' => $e->getMessage()], 409);
            }

            return response()->json([
                'message' => 'Failed to create permission',
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
            $permission = $this->permissionService->getById((int) $id);

            return response()->json([
                'message' => 'Permission retrieved successfully',
                'data' => new PermissionResource($permission),
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() === 404) {
                return response()->json(['message' => $e->getMessage()], 404);
            }

            return response()->json([
                'message' => 'Failed to retrieve permission',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PermissionRequest $request, string $id): JsonResponse
    {
        try {
            $permission = $this->permissionService->update((int) $id, $request->validated());

            return response()->json([
                'message' => 'Permission updated successfully',
                'data' => new PermissionResource($permission),
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() === 404) {
                return response()->json(['message' => $e->getMessage()], 404);
            }
            if ($e->getCode() === 409) {
                return response()->json(['message' => $e->getMessage()], 409);
            }

            return response()->json([
                'message' => 'Failed to update permission',
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
            $this->permissionService->delete((int) $id);

            return response()->json([
                'message' => 'Permission deleted successfully',
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() === 404) {
                return response()->json(['message' => $e->getMessage()], 404);
            }
            if ($e->getCode() === 409) {
                return response()->json(['message' => $e->getMessage()], 409);
            }

            return response()->json([
                'message' => 'Failed to delete permission',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get permissions for select dropdown.
     */
    public function forSelect(): JsonResponse
    {
        try {
            $permissions = $this->permissionService->getForSelect();

            return response()->json([
                'message' => 'Permissions retrieved successfully',
                'data' => PermissionResource::collection($permissions),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve permissions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get permissions by guard name.
     */
    public function getByGuard(string $guardName): JsonResponse
    {
        try {
            $permissions = $this->permissionService->getPermissionsByGuard($guardName);

            return response()->json([
                'message' => 'Permissions retrieved successfully',
                'data' => PermissionResource::collection($permissions),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve permissions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get permissions with their assigned roles.
     */
    public function withRoles(): JsonResponse
    {
        try {
            $permissions = $this->permissionService->getPermissionsWithRoles();

            return response()->json([
                'message' => 'Permissions with roles retrieved successfully',
                'data' => PermissionResource::collection($permissions),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve permissions with roles',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get permission statistics.
     */
    public function statistics(): JsonResponse
    {
        try {
            $statistics = $this->permissionService->getPermissionStatistics();

            return response()->json([
                'message' => 'Permission statistics retrieved successfully',
                'data' => $statistics,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve permission statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Search permissions by name.
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|min:1',
            ]);

            $permissions = $this->permissionService->searchByName($request->input('name'));

            return response()->json([
                'message' => 'Permissions found successfully',
                'data' => PermissionResource::collection($permissions),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to search permissions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Bulk delete permissions.
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'integer|exists:permissions,id',
            ]);

            $result = $this->permissionService->bulkDelete($request->input('ids'));

            return response()->json([
                'message' => 'Bulk delete completed',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to bulk delete permissions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Assign permission to role.
     */
    public function assignToRole(Request $request, string $id): JsonResponse
    {
        try {
            $request->validate([
                'role_id' => 'required|integer|exists:roles,id',
            ]);

            $this->permissionService->assignToRole((int) $id, $request->input('role_id'));

            return response()->json([
                'message' => 'Permission assigned to role successfully',
            ]);
        } catch (\Exception $e) {
            if (in_array($e->getCode(), [404, 409])) {
                return response()->json(['message' => $e->getMessage()], $e->getCode());
            }

            return response()->json([
                'message' => 'Failed to assign permission to role',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove permission from role.
     */
    public function removeFromRole(Request $request, string $id): JsonResponse
    {
        try {
            $request->validate([
                'role_id' => 'required|integer|exists:roles,id',
            ]);

            $this->permissionService->removeFromRole((int) $id, $request->input('role_id'));

            return response()->json([
                'message' => 'Permission removed from role successfully',
            ]);
        } catch (\Exception $e) {
            if (in_array($e->getCode(), [404, 409])) {
                return response()->json(['message' => $e->getMessage()], $e->getCode());
            }

            return response()->json([
                'message' => 'Failed to remove permission from role',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Sync permission with roles.
     */
    public function syncWithRoles(Request $request, string $id): JsonResponse
    {
        try {
            $request->validate([
                'role_ids' => 'required|array',
                'role_ids.*' => 'integer|exists:roles,id',
            ]);

            $result = $this->permissionService->syncWithRole((int) $id, $request->input('role_ids'));

            return response()->json([
                'message' => 'Permission synced with roles successfully',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() === 404) {
                return response()->json(['message' => $e->getMessage()], 404);
            }

            return response()->json([
                'message' => 'Failed to sync permission with roles',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
