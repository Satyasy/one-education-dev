<?php

namespace App\Repositories;

use App\Models\PanjarItem;
use App\Models\PanjarItemHistory;
use App\Models\PanjarRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PanjarItemRepository
{
    public function createPanjarItem(int $requestId, array $data)
    {
        $data['panjar_request_id'] = $requestId;
        $data['total_amount'] = $data['price'] * $data['quantity'];
        $panjarItem = PanjarItem::create($data);
        $panjarRequest = PanjarRequest::find($requestId);
        $panjarRequest->update([
            'total_amount' => $panjarRequest->total_amount + $data['total_amount']
        ]);
        return $panjarItem;
    }

    /**
     * Update panjar item status with history tracking
     */
    public function updateStatus(int $id, array $data)
    {
        try {
            DB::beginTransaction();

            $panjarItem = PanjarItem::with('panjarRequest')->findOrFail($id);
            $oldStatus = $panjarItem->status;
            
            // Validate status transition
            $this->validateStatusTransition($panjarItem, $data['status']);

            // Create history record before updating
            $this->createHistory($panjarItem, $data, $oldStatus);

            // Update panjar item
            $panjarItem->update([
                'status' => $data['status']
            ]);

            // Update panjar request status based on all items
            $this->updatePanjarRequestStatus($panjarItem->panjarRequest);

            DB::commit();

            return $panjarItem->load(['panjarRequest']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updatePanjarItem(int $id, array $data)
    {
        try {
            DB::beginTransaction();

            $panjarItem = PanjarItem::with('panjarRequest')->findOrFail($id);
            $panjarItem->update($data);
            $oldStatus = $panjarItem->status;
            $data['note'] = "Item telah diubah";
            
            // Create history record if status is provided
            if (isset($data['status'])) {
                // Update panjar request status if item status changed
                $this->updatePanjarRequestStatus($panjarItem->panjarRequest);
                // create history for panjar item
                $this->createHistory($panjarItem, $data, $oldStatus);
            }

            DB::commit();
            
            return $panjarItem;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Bulk update multiple panjar items status
     */
    public function bulkUpdateStatus(array $items)
    {
        try {
            DB::beginTransaction();

            $updatedItems = collect();
            $affectedRequests = collect();

            foreach ($items as $itemData) {
                $panjarItem = PanjarItem::with('panjarRequest')->findOrFail($itemData['id']);
                $oldStatus = $panjarItem->status;

                // Validate status transition
                $this->validateStatusTransition($panjarItem, $itemData['status']);

                // Create history record
                $this->createHistory($panjarItem, $itemData, $oldStatus);

                // Update item
                $panjarItem->update([
                    'status' => $itemData['status']
                ]);

                $updatedItems->push($panjarItem);
                
                // Collect affected requests to update their status later
                if (!$affectedRequests->contains('id', $panjarItem->panjarRequest->id)) {
                    $affectedRequests->push($panjarItem->panjarRequest);
                }
            }

            // Update all affected panjar request statuses
            foreach ($affectedRequests as $request) {
                $this->updatePanjarRequestStatus($request);
            }

            DB::commit();

            return $updatedItems;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get panjar items by request ID
     */
    public function getByRequestId(int $requestId)
    {
        return PanjarItem::where('panjar_request_id', $requestId)
            ->with(['panjarRequest'])
            ->orderBy('created_at', 'asc')
            ->get();
    }

    /**
     * Get panjar item by ID with relationships
     */
    public function getById(int $id)
    {
        return PanjarItem::with(['panjarRequest', 'panjarItemHistories'])
            ->findOrFail($id);
    }

    /**
     * Get panjar item history
     */
    public function getHistory(int $id)
    {
        return PanjarItemHistory::where('panjar_item_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Check if user can update item status
     */
    public function canUpdateStatus(int $itemId, string $newStatus, $user)
    {
        $panjarItem = PanjarItem::with('panjarRequest')->findOrFail($itemId);
        $currentStatus = $panjarItem->status;
        $userRoles = $user->roles->pluck('name');

        // Define allowed transitions based on role and current status
        $allowedTransitions = [
            'kepala-urusan' => [
                'pending' => ['pending'], // Can only edit when pending
            ],
            'wakil-kepala-sekolah' => [
                'pending' => ['verified', 'rejected', 'revision'],
                'revision' => ['verified', 'rejected', 'revision'],
            ],
            'kepala-sekolah' => [
                'verified' => ['approved', 'rejected', 'revision'],
                'revision' => ['approved', 'rejected', 'revision'],
                'approved' => ['rejected', 'revision'], // Bisa menolak atau meminta revisi dari status approved
            ],
            'admin' => [
                'pending' => ['pending', 'verified', 'approved', 'rejected', 'revision'],
                'verified' => ['pending', 'verified', 'approved', 'rejected', 'revision'],
                'approved' => ['pending', 'verified', 'approved', 'rejected', 'revision'],
                'rejected' => ['pending', 'verified', 'approved', 'rejected', 'revision'],
                'revision' => ['pending', 'verified', 'approved', 'rejected', 'revision'],
            ]
        ];

        foreach ($userRoles as $role) {
            if (isset($allowedTransitions[$role][$currentStatus])) {
                if (in_array($newStatus, $allowedTransitions[$role][$currentStatus])) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Validate status transition
     */
    private function validateStatusTransition($panjarItem, $newStatus)
    {
        $user = Auth::user();
        
        if (!$this->canUpdateStatus($panjarItem->id, $newStatus, $user)) {
            throw new \Exception('Invalid status transition or insufficient permissions');
        }
    }

    /**
     * Create history record for status change
     */
    private function createHistory($panjarItem, $data, $oldStatus)
    {
        $user = Auth::user();
        
        PanjarItemHistory::create([
            'panjar_item_id' => $panjarItem->id,
            'note' => $data['note'] ?? null,
            'reviewed_by' => $user->id,
            'reviewer_role' => $this->getReviewerRole($user),
            'status' => $data['status'] ?? $oldStatus,
        ]);
    }

    /**
     * Update panjar request status based on all its items status
     */
    private function updatePanjarRequestStatus($panjarRequest)
    {
        // Get all items for this request
        $items = PanjarItem::where('panjar_request_id', $panjarRequest->id)->get();
        
        if ($items->isEmpty()) {
            return;
        }

        $statusCounts = $items->countBy('status');
        $totalItems = $items->count();
        
        // Determine request status based on items status
        $requestStatus = $this->determinePanjarRequestStatus($statusCounts, $totalItems);
        
        // Update request status if it's different
        if ($panjarRequest->status !== $requestStatus) {
            $updateData = ['status' => $requestStatus];
            
            // Only set approved_by if status is changing to 'approved' and user is kepala-sekolah
            if ($requestStatus === 'approved' && Auth::check() && Auth::user()->hasRole('kepala-sekolah')) {
                $updateData['approved_by'] = Auth::user()->id;
            }
            
            $panjarRequest->update($updateData);
        }
    }

    /**
     * Determine panjar request status based on items status counts
     */
    private function determinePanjarRequestStatus($statusCounts, $totalItems)
    {
        // Priority order: revision > rejected > pending > verified > approved
        
        // If any item has revision status
        if ($statusCounts->get('revision', 0) > 0) {
            return 'revision';
        }
        
        // If any item has rejected status
        if ($statusCounts->get('rejected', 0) > 0) {
            return 'rejected';
        }
        
        // If all items are pending
        if ($statusCounts->get('pending', 0) === $totalItems) {
            return 'pending';
        }
        
        // If all items are verified
        if ($statusCounts->get('verified', 0) === $totalItems) {
            return 'verified';
        }
        
        // If all items are approved
        if ($statusCounts->get('approved', 0) === $totalItems) {
            return 'approved';
        }

        // If all items are either verified or approved, and at least one is verified and at least one is approved
        $verifiedCount = $statusCounts->get('verified', 0);
        $approvedCount = $statusCounts->get('approved', 0);
        if (($verifiedCount + $approvedCount === $totalItems) && $verifiedCount > 0 && $approvedCount > 0) {
            return 'verified';
        }
        
        // Mixed statuses (some pending, some verified, etc.) - default to pending
        return 'pending';
    }

    /**
     * @deprecated Use updatePanjarRequestStatus instead
     */
    private function updateStatusPanjarRequest($panjarRequest, $data)
    {
        // This method is deprecated, use updatePanjarRequestStatus instead
        $this->updatePanjarRequestStatus($panjarRequest);
    }

    /**
     * Get reviewer role based on user roles
     */
    private function getReviewerRole($user)
    {
        if ($user->hasRole('admin')) {
            return 'admin';
        } elseif ($user->hasRole('kepala-sekolah')) {
            return 'approver';
        } elseif ($user->hasRole('wakil-kepala-sekolah')) {
            return 'verifier';
        } elseif ($user->hasRole('kepala-urusan')) {
            return 'creator'; // Or a more appropriate role for initial creation/edit
        }
        return 'unknown';
    }
}
