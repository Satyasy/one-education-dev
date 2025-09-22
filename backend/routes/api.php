<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\BudgetItemController;
use App\Http\Controllers\BudgetYearController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PanjarItemController;
use App\Http\Controllers\PanjarRealizationItemController;
use App\Http\Controllers\PanjarRequestController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('auth/sign-in', [AuthController::class, 'login'])->middleware('web');
Route::post('auth/login', [AuthController::class, 'tokenLogin']);

// Routes dengan token authentication (untuk mobile apps, etc)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', [AuthController::class, 'user']);
    Route::post('auth/sign-out', [AuthController::class, 'logout']);
    Route::get('users/statistics', [UserController::class, 'statistics']);
    Route::get('panjar-requests/statistics', [PanjarRequestController::class, 'statistics'])->middleware('can:view panjar-requests');

    // Panjar Request routes with permissions
    Route::get('panjar-requests', [PanjarRequestController::class, 'index'])->middleware('can:view panjar-requests');
    Route::post('panjar-requests', [PanjarRequestController::class, 'store'])->middleware('can:create panjar-requests');
    Route::get('panjar-requests/{panjar_request}', [PanjarRequestController::class, 'show'])->middleware('can:view panjar-requests');
    Route::put('panjar-requests/{panjar_request}', [PanjarRequestController::class, 'update'])->middleware('can:edit panjar-requests');
    Route::patch('panjar-requests/{panjar_request}', [PanjarRequestController::class, 'update'])->middleware('can:edit panjar-requests');
    Route::delete('panjar-requests/{panjar_request}', [PanjarRequestController::class, 'destroy'])->middleware('can:delete panjar-requests');

    // Additional panjar request action routes with permissions
    Route::patch('panjar-requests/{id}/verify', [PanjarRequestController::class, 'verify'])->middleware('can:edit panjar-requests');
    Route::patch('panjar-requests/{id}/approve', [PanjarRequestController::class, 'approve'])->middleware('can:edit panjar-requests');
    Route::patch('panjar-requests/{id}/reject', [PanjarRequestController::class, 'reject'])->middleware('can:edit panjar-requests');

    // Budget routes
    Route::get('budget-years/select', [BudgetYearController::class, 'forSelect']);
    Route::patch('budget-years/{id}/set-active', [BudgetYearController::class, 'setActive']);
    Route::apiResource('budget-years', BudgetYearController::class);

    // Budget routes
    Route::post('budgets/check-existing', [BudgetController::class, 'checkExisting']);
    Route::apiResource('budgets', BudgetController::class);
    Route::get('budgets/{id}/items', [BudgetController::class, 'getBudgetItems']);

    // Budget Items routes for select inputs
    Route::get('budget-items/select', [BudgetItemController::class, 'forSelect']);
    Route::get('budget-items/budget/{budgetId}', [BudgetItemController::class, 'getByBudget']);
    Route::get('budget-items/unit/{unitId}', [BudgetItemController::class, 'getByUnit']);
    Route::apiResource('budget-items', BudgetItemController::class);

    // Unit routes
    Route::get('units/select', [UnitController::class, 'forSelect']);
    Route::apiResource('units', UnitController::class);

    // Panjar Items routes
    Route::get('panjar-items/request/{requestId}', [PanjarItemController::class, 'getByRequest']);
    Route::post('panjar-items/{requestId}', [PanjarItemController::class, 'createPanjarItem']);
    Route::get('panjar-items/{id}', [PanjarItemController::class, 'getById']);
    Route::patch('panjar-items/{id}', [PanjarItemController::class, 'updatePanjarItem']);
    Route::get('panjar-items/{id}/history', [PanjarItemController::class, 'getHistory']);
    Route::patch('panjar-items/{id}/status', [PanjarItemController::class, 'updateStatus']);
    Route::patch('panjar-items/bulk-status', [PanjarItemController::class, 'bulkUpdateStatus']);
    Route::patch('panjar-items/{id}/approve', [PanjarItemController::class, 'approve']);
    Route::patch('panjar-items/{id}/reject', [PanjarItemController::class, 'reject']);
    Route::patch('panjar-items/{id}/revision', [PanjarItemController::class, 'requestRevision']);

    // Panjar Realization Item routes
    Route::get('/panjar-realization-items/request/{panjarRequestId}', [PanjarRealizationItemController::class, 'index']);
    Route::post('/panjar-realization-items', [PanjarRealizationItemController::class, 'store']);
    Route::get('/panjar-realization-items/{panjarRequestId}/item/{itemId}', [PanjarRealizationItemController::class, 'getPanjarRealizationByPanjarRequestIdByItemId']);
    Route::put('panjar-realization-items/{id}', [PanjarRealizationItemController::class, 'update']);
    Route::get('panjar-realization-items/{id}', [PanjarRealizationItemController::class, 'getPanjarRealizationItemById']);
    Route::delete('panjar-realization-items/{id}', [PanjarRealizationItemController::class, 'destroy']);
    Route::patch('panjar-realization-items/{id}/report-status', [PanjarRealizationItemController::class, 'updateReportStatus']);

    // Employee routes
    Route::get('employees/statistics', [EmployeeController::class, 'statistics']);
    Route::get('employees/user/{userId}', [EmployeeController::class, 'getByUserId']);
    Route::get('employees/nip/{nip}', [EmployeeController::class, 'getByNip']);
    Route::get('employees/unit/{unitId}', [EmployeeController::class, 'getByUnitId']);
    Route::get('employees/position/{positionId}', [EmployeeController::class, 'getByPositionId']);
    Route::apiResource('employees', EmployeeController::class);

    // Permission management routes
    Route::get('permissions/statistics', [PermissionController::class, 'statistics']);
    Route::get('permissions/select', [PermissionController::class, 'forSelect']);
    Route::get('permissions/guard/{guardName}', [PermissionController::class, 'getByGuard']);
    Route::get('permissions/with-roles', [PermissionController::class, 'withRoles']);
    Route::get('permissions/search', [PermissionController::class, 'search']);
    Route::delete('permissions/bulk-delete', [PermissionController::class, 'bulkDelete']);
    Route::post('permissions/{id}/assign-role', [PermissionController::class, 'assignToRole']);
    Route::delete('permissions/{id}/remove-role', [PermissionController::class, 'removeFromRole']);
    Route::put('permissions/{id}/sync-roles', [PermissionController::class, 'syncWithRoles']);
    Route::apiResource('permissions', PermissionController::class);

    // User management routes
    Route::get('me', [UserController::class, 'me']);
    Route::get('users/create/form-data', [UserController::class, 'getCreateFormData']);
    Route::apiResource('users', UserController::class);
    Route::get('users/{id}/permissions', [UserController::class, 'getUserWithPermissions']);

});
