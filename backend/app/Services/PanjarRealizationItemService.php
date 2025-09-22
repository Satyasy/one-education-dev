<?php

namespace App\Services;

use App\Repositories\PanjarRealizationItemRepository;

class PanjarRealizationItemService
{
    protected PanjarRealizationItemRepository $repository;

    public function __construct(PanjarRealizationItemRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Get all panjar realizations for a specific panjar request
     *
     * @param int $panjarRequestId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllPanjarRealizations(int $panjarRequestId)
    {
        return $this->repository->getAllPanjarRealizations($panjarRequestId);
    }

    /**
     * Create a new panjar realization item
     *
     * @param array $data
     * @return \App\Models\PanjarRealizationItem
     */
    public function createPanjarRealization(array $data)
    {
        // Calculate total based on price and quantity
        if (isset($data['price']) && isset($data['quantity'])) {
            $data['total'] = $data['price'] * $data['quantity'];
        }
        
        return $this->repository->createPanjarRealization($data);
    }

    public function getPanjarRealizationByPanjarRequestIdByItemId(int $panjarRequestId, int $itemId)
    {
        return $this->repository->getPanjarRealizationByPanjarRequestIdByItemId($panjarRequestId, $itemId);
    }
    /**
     * Update an existing panjar realization item
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\PanjarRealizationItem
     */
    public function updatePanjarRealizationItem(int $id, array $data)
    {
        return $this->repository->updatePanjarRealizationItem($id, $data);
    }

    /**
     * Get a panjar realization item by ID
     *
     * @param int $id
     * @return \App\Models\PanjarRealizationItem
     */
    public function getPanjarRealizationItemById(int $id)
    {
        return $this->repository->getPanjarRealizationItemById($id);
    }

    /**
     * Delete a panjar realization item
     *
     * @param int $id
     * @return \App\Models\PanjarRealizationItem
     */
    public function deletePanjarRealizationItem(int $id)
    {
        return $this->repository->deletePanjarRealizationItem($id);
    }

    /**
     * Update the report status of a panjar realization item
     *
     * @param int $id
     * @param array $data
     * @return \App\Models\PanjarRealizationItem
     */
    public function updateReportStatus(int $id, array $data)
    {
        return $this->repository->updateReportStatus($id, $data);
    }

}
