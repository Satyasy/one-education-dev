<?php

namespace App\Repositories;

use App\Models\PanjarItem;
use App\Models\PanjarRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PanjarRequestRepository
{
    public function getAll(array $fields, array $params = [])
    {
        $query = PanjarRequest::select($fields)
            ->with(['unit', 'budgetItem', 'creator', 'verifier', 'approver', 'items'])
            ->orderBy('request_date', 'desc');

        // Get current user
        $user = Auth::user();

        // If user is admin, kepala-sekolah, or kepala-administrasi, show all data
        if ($user && $user->hasRole(['admin', 'kepala-sekolah', 'kepala-administrasi'])) {
            // No additional filter needed - show all data
        } else {
            // For other roles, restrict to their unit only
            if ($user && $user->employee && $user->employee->unit) {
                $query->where('unit_id', $user->employee->unit->id);
            } else {
                // If no unit associated, apply unit_id filter from params if provided
                if (! empty($params['unit_id'])) {
                    $query->where('unit_id', $params['unit_id']);
                }
            }
        }

        if (! empty($params['search'])) {
            $searchTerm = $params['search'];
            $query->where(function (Builder $q) use ($searchTerm) {
                $q->where('activity_name', 'like', "%{$searchTerm}%");
            });
        }

        if (! empty($params['status'])) {
            $query->where('status', $params['status']);
        }

        // Handle Pagination
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

    public function getAllPanjarRequestStatistics(?int $unitId = null)
    {
        $query = PanjarRequest::query();

        // Apply unit filter if specified
        if ($unitId !== null) {
            $query->where('unit_id', $unitId);
        }

        $totalPanjarRequest = $query->count();
        $totalPanjarRequestVerified = (clone $query)->where('status', 'verified')->count();
        $totalPanjarRequestApproved = (clone $query)->where('status', 'approved')->count();
        $totalPanjarRequestRejected = (clone $query)->where('status', 'rejected')->count();
        $totalPanjarRequestPending = (clone $query)->where('status', 'pending')->count();

        return [
            'total_panjar_request' => $totalPanjarRequest,
            'total_panjar_request_verified' => $totalPanjarRequestVerified,
            'total_panjar_request_approved' => $totalPanjarRequestApproved,
            'total_panjar_request_rejected' => $totalPanjarRequestRejected,
            'total_panjar_request_pending' => $totalPanjarRequestPending,
        ];
    }

    public function getById(int $id, array $fields)
    {
        return PanjarRequest::select($fields)
            ->with(['unit', 'budgetItem', 'creator', 'verifier', 'approver', 'items'])
            ->findOrFail($id);
    }

    /**
     * Create a new panjar request with its items
     *
     * @param  array  $panjarData  Data for panjar request
     * @param  array  $itemsData  Array of items data
     * @return PanjarRequest
     */
    public function createWithItems(array $panjarData, array $itemsData)
    {
        try {
            DB::beginTransaction();

            // Calculate total amount from items
            $totalAmount = collect($itemsData)->sum(function ($item) {
                return $item['quantity'] * $item['price'];
            });

            // Create panjar request
            $panjarRequest = PanjarRequest::create([
                'unit_id' => $panjarData['unit_id'],
                'budget_item_id' => $panjarData['budget_item_id'],
                'created_by' => $panjarData['created_by'],
                'status' => 'pending',
                'request_date' => $panjarData['request_date'] ?? now(),
                'total_amount' => $totalAmount,
            ]);

            // Create panjar items
            foreach ($itemsData as $item) {
                PanjarItem::create([
                    'panjar_request_id' => $panjarRequest->id,
                    'item_name' => $item['item_name'],
                    'spesification' => $item['spesification'] ?? null,
                    'quantity' => $item['quantity'],
                    'unit' => $item['unit'],
                    'price' => $item['price'],
                    'total' => $item['quantity'] * $item['price'],
                    'description' => $item['description'] ?? null,
                    'status' => 'pending',
                ]);
            }

            DB::commit();

            // Load relationships before returning
            return $panjarRequest->load(['unit', 'budgetItem', 'creator', 'items']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function update(int $id, array $data)
    {
        $panjarRequest = PanjarRequest::findOrFail($id);
        $panjarRequest->update($data);

        // Load relationships before returning for consistency
        return $panjarRequest->load(['unit', 'budgetItem', 'creator', 'verifier', 'approver', 'items']);
    }

    /**
     * Update panjar request with its items
     *
     * @param  int  $id  Panjar request ID
     * @param  array  $panjarData  Data for panjar request
     * @param  array  $itemsData  Array of items data (optional)
     * @return PanjarRequest
     */
    public function updateWithItems(int $id, array $panjarData, ?array $itemsData = null)
    {
        try {
            DB::beginTransaction();

            $panjarRequest = PanjarRequest::findOrFail($id);

            // If items data is provided, update items and recalculate total
            if ($itemsData !== null) {
                // Delete existing items
                $panjarRequest->items()->delete();

                // Calculate new total amount from items
                $totalAmount = collect($itemsData)->sum(function ($item) {
                    return $item['quantity'] * $item['price'];
                });

                // Create new panjar items
                foreach ($itemsData as $item) {
                    PanjarItem::create([
                        'panjar_request_id' => $panjarRequest->id,
                        'item_name' => $item['item_name'],
                        'spesification' => $item['spesification'] ?? null,
                        'quantity' => $item['quantity'],
                        'unit' => $item['unit'],
                        'price' => $item['price'],
                        'total' => $item['quantity'] * $item['price'],
                        'description' => $item['description'] ?? null,
                        'status' => 'pending',
                    ]);
                }

                // Update total amount in panjar request
                $panjarData['total_amount'] = $totalAmount;
            }

            // Update panjar request
            $panjarRequest->update($panjarData);

            DB::commit();

            // Load relationships before returning
            return $panjarRequest->load(['unit', 'budgetItem', 'creator', 'verifier', 'approver', 'items']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function delete(int $id)
    {
        $panjarRequest = PanjarRequest::findOrFail($id);

        // Delete related panjar items first
        $panjarRequest->items()->delete();

        // Then delete the panjar request
        $panjarRequest->delete();

        return $panjarRequest;
    }
}
