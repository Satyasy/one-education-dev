<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\PanjarRealizationItemService;
use App\Http\Resources\PanjarRealizationResource;
use App\Http\Requests\PanjarRealizationItemRequest;

class PanjarRealizationItemController extends Controller
{
    protected PanjarRealizationItemService $service;

    public function __construct(PanjarRealizationItemService $service)
    {
        $this->service = $service;
    }

    /**
     * Get all panjar realizations for a specific panjar request.
     *
     * @param int $panjarRequestId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(int $panjarRequestId): JsonResponse
    {
        $realizations = $this->service->getAllPanjarRealizations($panjarRequestId);
        
        return response()->json([
            'message' => 'Panjar realizations retrieved successfully',
            'data' => PanjarRealizationResource::collection($realizations)
        ], 200);
    }

    public function getPanjarRealizationItemById(int $id): JsonResponse
    {
        $item = $this->service->getPanjarRealizationItemById($id);

        return response()->json([
            'message' => 'Panjar realization item retrieved successfully',
            'data' => new PanjarRealizationResource($item)
        ], 200);
    }

    /**
     * Store a new panjar realization item.
     *
     * @param  \App\Http\Requests\PanjarRealizationItemRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(PanjarRealizationItemRequest $request): JsonResponse
    {
        // Cast to Request to handle file uploads
        $httpRequest = app(Request::class);
        
        $data = $request->validated();
        
        // Handle file uploads if present
        if ($httpRequest->hasFile('receipt_file')) {
            $data['receipt_file'] = $httpRequest->file('receipt_file')->store('panjar_receipts', 'public');
        }
        
        if ($httpRequest->hasFile('item_photo')) {
            $data['item_photo'] = $httpRequest->file('item_photo')->store('panjar_photos', 'public');
        }

        $item = $this->service->createPanjarRealization($data);
        
        return response()->json([
            'message' => 'Panjar realization item created successfully',
            'data' => new PanjarRealizationResource($item)
        ], 201);
    }
    
    public function getPanjarRealizationByPanjarRequestIdByItemId(int $panjarRequestId, int $itemId)
    {
        $item = $this->service->getPanjarRealizationByPanjarRequestIdByItemId($panjarRequestId, $itemId);

        return response()->json([
            'message' => 'Panjar realization item retrieved successfully',
            'data' => $item
        ], 200);
    }

    /**
     * Update a panjar realization item.
     *
     * @param int $panjarRequestId
     * @param \App\Http\Requests\PanjarRealizationItemRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(int $id, PanjarRealizationItemRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        // Handle file uploads if present
        if (request()->hasFile('receipt_file')) {
            $data['receipt_file'] = request()->file('receipt_file')->store('panjar_receipts', 'public');
        }
        
        if (request()->hasFile('item_photo')) {
            $data['item_photo'] = request()->file('item_photo')->store('panjar_photos', 'public');
        }

        $item = $this->service->updatePanjarRealizationItem($id, $data);
        
        return response()->json([
            'message' => 'Panjar realization item updated successfully',
            'data' => new PanjarRealizationResource($item)
        ], 200);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->deletePanjarRealizationItem($id);
        
        return response()->json([
            'message' => 'Panjar realization item deleted successfully',
            'data' => []
        ], 200);
    }

    public function updateReportStatus(int $id, Request $request): JsonResponse
    {
        $data = $request->validate([
            'report_status' => 'required|string',
        ]);

        $this->service->updateReportStatus($id, $data);
        
        return response()->json([
            'message' => 'Report status updated successfully',
        ], 200);
    }
}
