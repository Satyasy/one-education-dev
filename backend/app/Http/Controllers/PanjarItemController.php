<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PanjarItemService;
use App\Http\Resources\PanjarItemResource;
use App\Http\Requests\PanjarItemStatusUpdateRequest;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\PanjarItemRequest;

class PanjarItemController extends Controller
{
    protected $panjarItemService;

    public function __construct(PanjarItemService $panjarItemService)
    {
        $this->panjarItemService = $panjarItemService;
    }

    public function createPanjarItem(PanjarItemRequest $request, int $requestId)
    {
        $data = $request->validated();
        $panjarItem = $this->panjarItemService->createPanjarItem($requestId, $data);

        return response()->json([
            'message' => 'Panjar item created successfully',
            'data' => new PanjarItemResource($panjarItem)
        ]);
    }

    /**
     * Update single panjar item status
     */
    public function updateStatus(PanjarItemStatusUpdateRequest $request, int $id)
    {
        $data = $request->validated();

        $panjarItem = $this->panjarItemService->updateStatus($id, $data);

        return response()->json([
            'message' => 'Panjar item status updated successfully',
        ]);
    }

    public function updatePanjarItem(PanjarItemRequest $request, int $id)
    {
        $data = $request->validated();

        $panjarItem = $this->panjarItemService->updatePanjarItem($id, $data);

        return response()->json([
            'message' => 'Panjar item updated successfully',
            'data' => new PanjarItemResource($panjarItem)
        ]);
    }

    /**
     * Bulk update panjar items status
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:panjar_items,id',
            'items.*.status' => 'required|in:pending,verified,approved,rejected,revision',
            'items.*.note' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();
        $items = $request->input('items');
        
        // Add user info to each item
        foreach ($items as &$item) {
            $item['updated_by'] = $user->id;
        }

        $updatedItems = $this->panjarItemService->bulkUpdateStatus($items);

        return response()->json([
            'message' => 'Panjar items status updated successfully',
            'data' => PanjarItemResource::collection($updatedItems),
            'updated_count' => count($updatedItems)
        ]);
    }

    public function getById(int $itemId)
    {
        $panjarItem = $this->panjarItemService->getById($itemId);

        return response()->json([
            'data' => new PanjarItemResource($panjarItem)
        ]);
    }

    /**
     * Get panjar items by request ID
     */
    public function getByRequest(int $requestId)
    {
        $panjarItems = $this->panjarItemService->getByRequestId($requestId);

        return response()->json([
            'data' => PanjarItemResource::collection($panjarItems)
        ]);
    }

    /**
     * Get panjar item history
     */
    public function getHistory(int $id)
    {
        $history = $this->panjarItemService->getHistory($id);

        return response()->json([
            'data' => $history
        ]);
    }

    /**
     * Approve specific panjar item (for kepala-sekolah)
     */
    public function approve(Request $request, int $id)
    {
        $user = Auth::user();
        
        if (!$user->hasRole('kepala-sekolah')) {
            return response()->json(['message' => 'Unauthorized to approve panjar item'], 403);
        }

        $data = [
            'status' => 'approved',
            'note' => $request->input('note'),
            'updated_by' => $user->id,
        ];

        $panjarItem = $this->panjarItemService->updateStatus($id, $data);

        return response()->json([
            'message' => 'Panjar item approved successfully',
            'data' => new PanjarItemResource($panjarItem)
        ]);
    }

    /**
     * Reject specific panjar item
     */
    public function reject(Request $request, int $id)
    {
        $user = Auth::user();
        
        if (!$user->hasRole(['kepala-sekolah', 'wakil-kepala-sekolah'])) {
            return response()->json(['message' => 'Unauthorized to reject panjar item'], 403);
        }

        $request->validate([
            'note' => 'required|string|max:500'
        ]);

        $data = [
            'status' => 'rejected',
            'note' => $request->input('note'),
            'updated_by' => $user->id,
        ];

        $panjarItem = $this->panjarItemService->updateStatus($id, $data);

        return response()->json([
            'message' => 'Panjar item rejected successfully',
            'data' => new PanjarItemResource($panjarItem)
        ]);
    }

    /**
     * Request revision for specific panjar item
     */
    public function requestRevision(Request $request, int $id)
    {
        $user = Auth::user();
        
        if (!$user->hasRole(['kepala-sekolah', 'wakil-kepala-sekolah'])) {
            return response()->json(['message' => 'Unauthorized to request revision'], 403);
        }

        $request->validate([
            'note' => 'required|string|max:500'
        ]);

        $data = [
            'status' => 'revision',
            'note' => $request->input('note'),
            'updated_by' => $user->id,
        ];

        $panjarItem = $this->panjarItemService->updateStatus($id, $data);

        return response()->json([
            'message' => 'Revision requested successfully',
            'data' => new PanjarItemResource($panjarItem)
        ]);
    }
}
