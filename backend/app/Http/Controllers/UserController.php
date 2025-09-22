<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    private UserService $userService;

    private array $fields = [
        'id',
        'name',
        'email',
    ];

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        $params = [
            'search' => $request->input('search'),
            'role' => $request->input('role'),
            'unit_id' => $request->input('unit_id'),
            'sort_field' => $request->input('sort_field', 'created_at'),
            'sort_order' => $request->input('sort_order', 'desc'),
            'page' => (int) $request->input('page', 1),
            'per_page' => (int) $request->input('per_page', 10),
        ];

        $users = $this->userService->getAll($this->fields, $params);

        return response()->json([
            'data' => UserResource::collection($users['data']),
            'meta' => $users['meta'],
        ]);
    }

    public function statistics()
    {
        $statistics = $this->userService->getAllUserStatistics();

        return response()->json($statistics);
    }

    public function show($id)
    {
        $user = $this->userService->getById((int) $id, $this->fields);
        if (! $user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(new UserResource($user));
    }

    public function store(UserRequest $request)
    {
        try {
            // Get all validated data including roles, permissions, user_type, employee, and student data
            $userData = $request->only([
                'name',
                'email',
                'password',
                'roles',
                'permissions',
                'user_type',
                'employee',
                'student',
            ]);

            // Create user with roles and permissions
            $user = $this->userService->createUserWithRolesAndPermissions($userData);

            return response()->json([
                'message' => 'User created successfully',
                'data' => new UserResource($user),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create user',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    public function update(UserRequest $request, $id)
    {
        $user = $this->userService->update((int) $id, $request->validated());

        return response()->json(new UserResource($user));
    }

    public function destroy($id)
    {
        $this->userService->delete((int) $id);

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Get user with detailed permissions info
     */
    public function getUserWithPermissions($id)
    {
        $user = $this->userService->getById((int) $id, $this->fields);
        if (! $user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'message' => 'User with permissions retrieved successfully',
            'data' => new UserResource($user),
        ]);
    }

    /**
     * Get current authenticated user with permissions
     */
    public function me(Request $request)
    {
        $user = $request->user();

        // Load necessary relationships
        $user->load(['roles', 'permissions', 'roles.permissions', 'employee.unit', 'employee.position', 'student.studyProgram', 'student.cohort']);

        return response()->json([
            'message' => 'Current user data retrieved successfully',
            'data' => new UserResource($user),
        ]);
    }

    /**
     * Get form data for user creation (available roles and permissions)
     */
    public function getCreateFormData()
    {
        try {
            $data = [
                'roles' => $this->userService->getAvailableRoles(),
                'permissions' => $this->userService->getAvailablePermissions(),
                'units' => $this->userService->getAvailableUnits(),
                'positions' => $this->userService->getAvailablePositions(),
                'study_programs' => $this->userService->getAvailableStudyPrograms(),
                'cohorts' => $this->userService->getAvailableCohorts(),
            ];

            return response()->json([
                'message' => 'Form data retrieved successfully',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to load form data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
