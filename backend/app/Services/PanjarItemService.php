<?php

namespace App\Services;

use App\Repositories\PanjarItemRepository;

class PanjarItemService
{
    protected $panjarItemRepository;

    public function __construct(PanjarItemRepository $panjarItemRepository)
    {
        $this->panjarItemRepository = $panjarItemRepository;
    }

    public function createPanjarItem(int $requestId, array $data)
    {
        return $this->panjarItemRepository->createPanjarItem($requestId, $data);
    }

    /**
     * Update panjar item status with history tracking
     */
    public function updateStatus(int $id, array $data)
    {
        return $this->panjarItemRepository->updateStatus($id, $data);
    }

    public function updatePanjarItem(int $id, array $data)
    {
        return $this->panjarItemRepository->updatePanjarItem($id, $data);
    }

    /**
     * Bulk update multiple panjar items status
     */
    public function bulkUpdateStatus(array $items)
    {
        return $this->panjarItemRepository->bulkUpdateStatus($items);
    }

    /**
     * Get panjar items by request ID
     */
    public function getByRequestId(int $requestId)
    {
        return $this->panjarItemRepository->getByRequestId($requestId);
    }

    /**
     * Get panjar item with relationships
     */
    public function getById(int $id)
    {
        return $this->panjarItemRepository->getById($id);
    }

    /**
     * Get panjar item history
     */
    public function getHistory(int $id)
    {
        return $this->panjarItemRepository->getHistory($id);
    }

    /**
     * Check if user can update item status based on current status and user role
     */
    public function canUpdateStatus(int $itemId, string $newStatus, $user)
    {
        return $this->panjarItemRepository->canUpdateStatus($itemId, $newStatus, $user);
    }
}
