<?php

namespace App\Http\Controllers;

use App\Http\Resources\PanjarResource;
use App\Services\PanjarRequestService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PanjarRequestController extends Controller
{
    protected $panjarRequestService;

    public function __construct(PanjarRequestService $panjarRequestService)
    {
        $this->panjarRequestService = $panjarRequestService;
    }

    public function index(Request $request)
    {
        try {
            $fields = ['id', 'budget_item_id', 'total_amount', 'approved_by', 'verified_by', 'created_by', 'status', 'unit_id', 'request_date', 'report_status'];
            $params = [
                'search' => $request->input('search'),
                'status' => $request->input('status'),
                'unit_id' => $request->input('unit_id'),
                'sort_field' => $request->input('sort_field', 'created_at'),
                'sort_order' => $request->input('sort_order', 'desc'),
                'page' => (int) $request->input('page', 1),
                'per_page' => (int) $request->input('per_page', 10),
            ];

            $panjarRequests = $this->panjarRequestService->getAll($fields, $params);

            return response()->json([
                'data' => PanjarResource::collection($panjarRequests['data']),
                'meta' => $panjarRequests['meta'],
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() === 403) {
                return response()->json(['message' => $e->getMessage()], 403);
            }
            throw $e;
        }
    }

    public function store(Request $request)
    {
        try {
            // Get validated data from the request
            // Extract panjar request data from the request
            $panjarData = [
                'unit_id' => $request->input('unit_id'),
                'budget_item_id' => $request->input('budget_item_id'),
                'created_by' => $request->input('created_by'),
                'request_date' => $request->input('request_date'),
            ];

            // Extract panjar items from the request
            $panjarItems = $request->input('panjar_items', []);

            $panjarRequest = $this->panjarRequestService->createWithItems(
                $panjarData,
                $panjarItems
            );

            return response()->json(new PanjarResource($panjarRequest), 201);
        } catch (\Exception $e) {
            if ($e->getCode() === 403) {
                return response()->json(['message' => $e->getMessage()], 403);
            }
            throw $e;
        }
    }

    public function statistics()
    {
        try {
            $statistics = $this->panjarRequestService->getAllPanjarRequestStatistics();

            return response()->json($statistics);
        } catch (\Exception $e) {
            if ($e->getCode() === 403) {
                return response()->json(['message' => $e->getMessage()], 403);
            }
            throw $e;
        }
    }

    public function update(Request $request, int $id)
    {
        try {
            $user = Auth::user();

            // Extract panjar request data from the request
            $panjarData = [
                'unit_id' => $request->input('unit_id'),
                'budget_item_id' => $request->input('budget_item_id'),
                'request_date' => $request->input('request_date') ? Carbon::parse($request->input('request_date'))->format('Y-m-d') : null,
                'verified_by' => $request->input('verified_by'),
                'approved_by' => $request->input('approved_by'),
            ];

            // Special handling for verification by wakil-kepala-sekolah
            if ($request->input('action') === 'verify' && $user->hasRole('wakil-kepala-sekolah')) {
                // Get panjar request to check unit and status
                $currentPanjarRequest = $this->panjarRequestService->getById($id, ['id', 'unit_id', 'status']);

                // Check if wakil-kepala-sekolah is from the same unit
                if (! $user->employee || ! $user->employee->unit || $user->employee->unit->id !== $currentPanjarRequest->unit_id) {
                    return response()->json([
                        'message' => 'You can only verify panjar requests from your own unit',
                    ], 403);
                }

                // Check status
                if ($currentPanjarRequest->status !== 'pending') {
                    return response()->json([
                        'message' => 'Panjar request can only be verified when status is pending',
                    ], 400);
                }

                $panjarData = [
                    'status' => 'verified',
                    'verified_by' => $user->id,
                ];
            }

            // Special handling for approval by kepala-sekolah
            if ($request->input('action') === 'approve' && $user->hasRole('kepala-sekolah')) {
                // Get panjar request to check status
                $currentPanjarRequest = $this->panjarRequestService->getById($id, ['id', 'status']);

                // Check status
                if ($currentPanjarRequest->status !== 'verified') {
                    return response()->json([
                        'message' => 'Panjar request can only be approved when status is verified',
                    ], 400);
                }

                $panjarData = [
                    'status' => 'approved',
                    'approved_by' => $user->id,
                ];
            }

            // Remove null values to avoid overwriting existing data
            $panjarData = array_filter($panjarData, function ($value) {
                return $value !== null;
            });

            // Extract panjar items from the request (if provided)
            $panjarItems = $request->input('panjar_items');

            if ($panjarItems !== null) {
                // Update with items
                $panjarRequest = $this->panjarRequestService->updateWithItems($id, $panjarData, $panjarItems);
            } else {
                // Update only panjar request data
                $panjarRequest = $this->panjarRequestService->update($id, $panjarData);
            }

            // Custom response message based on action
            $message = 'Panjar request updated successfully';
            if ($request->input('action') === 'verify') {
                $message = 'Panjar request verified successfully';
            } elseif ($request->input('action') === 'approve') {
                $message = 'Panjar request approved successfully';
            }

            return response()->json([
                'message' => $message,
                'data' => new PanjarResource($panjarRequest),
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() === 403) {
                return response()->json(['message' => $e->getMessage()], 403);
            }
            throw $e;
        }
    }

    public function show(int $id)
    {
        try {
            $fields = [
                'id',
                'budget_item_id',
                'total_amount',
                'approved_by',
                'verified_by',
                'created_by',
                'status',
                'unit_id',
                'request_date',
                'report_status',
                'created_at',
                'updated_at',
            ];

            $panjarRequest = $this->panjarRequestService->getById($id, $fields);

            // Load panjar items with their histories for detail page
            $panjarRequest->load([
                'items.panjarItemHistories' => function ($query) {
                    $query->orderBy('created_at', 'desc');
                },
            ]);

            return response()->json(new PanjarResource($panjarRequest));
        } catch (\Exception $e) {
            if ($e->getCode() === 403) {
                return response()->json(['message' => $e->getMessage()], 403);
            }
            throw $e;
        }
    }

    /**
     * Debug method to check panjar item histories
     */
    public function debug(int $id)
    {
        $panjarRequest = $this->panjarRequestService->getById($id, ['id']);

        // Check if histories exist in database
        $historiesCount = \App\Models\PanjarItemHistory::count();
        $itemHistoriesCount = \App\Models\PanjarItemHistory::whereHas('panjarItem', function ($q) use ($id) {
            $q->where('panjar_request_id', $id);
        })->count();

        // Load items with histories
        $panjarRequest->load([
            'items.panjarItemHistories',
        ]);

        $debugData = [
            'total_histories_in_db' => $historiesCount,
            'histories_for_this_request' => $itemHistoriesCount,
            'items_count' => $panjarRequest->items->count(),
            'items_with_histories' => $panjarRequest->items->filter(function ($item) {
                return $item->panjarItemHistories->count() > 0;
            })->count(),
            'items_data' => $panjarRequest->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->item_name,
                    'histories_count' => $item->panjarItemHistories->count(),
                    'histories' => $item->panjarItemHistories->map(function ($h) {
                        return [
                            'id' => $h->id,
                            'note' => $h->note,
                            'reviewer_role' => $h->reviewer_role,
                        ];
                    }),
                ];
            }),
        ];

        return response()->json($debugData);
    }

    public function destroy(int $id)
    {
        try {
            $this->panjarRequestService->delete($id);

            return response()->json(['message' => 'Panjar request deleted successfully']);
        } catch (\Exception $e) {
            if ($e->getCode() === 403) {
                return response()->json(['message' => $e->getMessage()], 403);
            }
            throw $e;
        }
    }

    /**
     * Verify panjar request (for wakil-kepala-sekolah)
     */
    public function verify(Request $request, int $id)
    {
        try {
            $user = Auth::user();

            // Check if user has permission to verify
            if (! $user->hasRole('wakil-kepala-sekolah')) {
                return response()->json(['message' => 'Unauthorized to verify panjar request'], 403);
            }

            // Get the panjar request first (this will check unit access via service)
            $panjarRequest = $this->panjarRequestService->getById($id, ['id', 'unit_id', 'status']);

            // Check if wakil-kepala-sekolah is from the same unit
            if (! $user->employee || ! $user->employee->unit || $user->employee->unit->id !== $panjarRequest->unit_id) {
                return response()->json([
                    'message' => 'You can only verify panjar requests from your own unit',
                ], 403);
            }

            // Check if panjar request is in correct status for verification
            if ($panjarRequest->status !== 'pending') {
                return response()->json([
                    'message' => 'Panjar request can only be verified when status is pending',
                ], 400);
            }

            $panjarData = [
                'status' => 'verified',
                'verified_by' => $user->id,
            ];

            $panjarRequest = $this->panjarRequestService->update($id, $panjarData);

            $panjarItems = $panjarRequest->items;
            foreach ($panjarItems as $item) {
                $item->status = 'verified';
                $item->save();
            }

            return response()->json([
                'message' => 'Panjar request verified successfully',
                'data' => new PanjarResource($panjarRequest),
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() === 403) {
                return response()->json(['message' => $e->getMessage()], 403);
            }
            throw $e;
        }
    }

    /**
     * Approve panjar request (for kepala-sekolah)
     */
    public function approve(Request $request, int $id)
    {
        try {
            $user = Auth::user();

            // Check if user has permission to approve
            if (! $user->hasRole('kepala-sekolah')) {
                return response()->json(['message' => 'Unauthorized to approve panjar request'], 403);
            }

            // Get the panjar request first (this will check unit access via service if user is not kepala-sekolah)
            $panjarRequest = $this->panjarRequestService->getById($id, ['id', 'unit_id', 'status']);

            // Check if panjar request is in correct status for approval
            if ($panjarRequest->status !== 'verified') {
                return response()->json([
                    'message' => 'Panjar request can only be approved when status is verified',
                ], 400);
            }

            $panjarData = [
                'status' => 'approved',
                'approved_by' => $user->id,
            ];

            $panjarRequest = $this->panjarRequestService->update($id, $panjarData);

            return response()->json([
                'message' => 'Panjar request approved successfully',
                'data' => new PanjarResource($panjarRequest),
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() === 403) {
                return response()->json(['message' => $e->getMessage()], 403);
            }
            throw $e;
        }
    }

    /**
     * Reject panjar request (for wakil-kepala-sekolah or kepala-sekolah)
     */
    public function reject(Request $request, int $id)
    {
        try {
            $user = Auth::user();

            // Check if user has permission to reject
            if (! $user->hasRole(['wakil-kepala-sekolah', 'kepala-sekolah'])) {
                return response()->json(['message' => 'Unauthorized to reject panjar request'], 403);
            }

            // Get the panjar request first (this will check unit access via service)
            $panjarRequest = $this->panjarRequestService->getById($id, ['id', 'unit_id', 'status']);

            // Check unit restriction for wakil-kepala-sekolah
            if ($user->hasRole('wakil-kepala-sekolah')) {
                if (! $user->employee || ! $user->employee->unit || $user->employee->unit->id !== $panjarRequest->unit_id) {
                    return response()->json([
                        'message' => 'You can only reject panjar requests from your own unit',
                    ], 403);
                }

                // Wakil kepala can only reject pending requests
                if ($panjarRequest->status !== 'pending') {
                    return response()->json([
                        'message' => 'You can only reject panjar requests with pending status',
                    ], 400);
                }
            }

            // Check status for kepala sekolah
            if ($user->hasRole('kepala-sekolah')) {
                if (! in_array($panjarRequest->status, ['pending', 'verified'])) {
                    return response()->json([
                        'message' => 'You can only reject panjar requests with pending or verified status',
                    ], 400);
                }
            }

            $panjarData = [
                'status' => 'rejected',
                'verified_by' => $user->hasRole('wakil-kepala-sekolah') ? $user->id : null,
                'approved_by' => $user->hasRole('kepala-sekolah') ? $user->id : null,
            ];

            // Remove null values
            $panjarData = array_filter($panjarData, function ($value) {
                return $value !== null;
            });

            $panjarRequest = $this->panjarRequestService->update($id, $panjarData);

            return response()->json([
                'message' => 'Panjar request rejected successfully',
                'data' => new PanjarResource($panjarRequest),
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() === 403) {
                return response()->json(['message' => $e->getMessage()], 403);
            }
            throw $e;
        }
    }
}
