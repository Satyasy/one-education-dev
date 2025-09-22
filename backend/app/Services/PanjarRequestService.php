<?php

namespace App\Services;

use App\Repositories\PanjarRequestRepository;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class PanjarRequestService
{
    protected $panjarRequestRepository;

    public function __construct(PanjarRequestRepository $panjarRequestRepository)
    {
        $this->panjarRequestRepository = $panjarRequestRepository;
    }

    /**
     * Check if user has access to a specific unit's data
     */
    private function hasUnitAccess(int $unitId): bool
    {
        $user = Auth::user();

        // Super admin and high-level roles can access all units
        if ($user && $user->hasRole(['admin', 'kepala-sekolah', 'kepala-administrasi'])) {
            return true;
        }

        // Other roles can only access their own unit
        if ($user && $user->employee && $user->employee->unit) {
            return $user->employee->unit->id === $unitId;
        }

        return false;
    }

    /**
     * Get user's unit ID or null if unrestricted access
     */
    private function getUserUnitId(): ?int
    {
        $user = Auth::user();

        // Super admin and high-level roles have unrestricted access
        if ($user && $user->hasRole(['admin', 'kepala-sekolah', 'kepala-administrasi'])) {
            return null;
        }

        // Other roles are restricted to their unit
        if ($user && $user->employee && $user->employee->unit) {
            return $user->employee->unit->id;
        }

        return null;
    }

    public function getAll(array $fields, array $params = [])
    {
        // Apply unit restriction for non-privileged users
        $userUnitId = $this->getUserUnitId();
        if ($userUnitId !== null) {
            $params['unit_id'] = $userUnitId;
        }

        return $this->panjarRequestRepository->getAll($fields, $params);
    }

    public function getAllPanjarRequestStatistics()
    {
        // Apply unit restriction for statistics as well
        $userUnitId = $this->getUserUnitId();

        return $this->panjarRequestRepository->getAllPanjarRequestStatistics($userUnitId);
    }

    public function createWithItems(array $panjarData, array $itemsData)
    {
        // Check if user can create panjar request for the specified unit
        if (isset($panjarData['unit_id']) && ! $this->hasUnitAccess($panjarData['unit_id'])) {
            throw new \Exception('You do not have permission to create panjar request for this unit', Response::HTTP_FORBIDDEN);
        }

        return $this->panjarRequestRepository->createWithItems($panjarData, $itemsData);
    }

    public function getById(int $id, array $fields)
    {
        $panjarRequest = $this->panjarRequestRepository->getById($id, $fields);

        // Check if user has access to this panjar request's unit
        if (! $this->hasUnitAccess($panjarRequest->unit_id)) {
            throw new \Exception('You do not have permission to access this panjar request', Response::HTTP_FORBIDDEN);
        }

        return $panjarRequest;
    }

    public function update(int $id, array $data)
    {
        // First check if user has access to this panjar request
        $panjarRequest = $this->panjarRequestRepository->getById($id, ['id', 'unit_id']);
        if (! $this->hasUnitAccess($panjarRequest->unit_id)) {
            throw new \Exception('You do not have permission to update this panjar request', Response::HTTP_FORBIDDEN);
        }

        // If updating unit_id, check access to new unit as well
        if (isset($data['unit_id']) && ! $this->hasUnitAccess($data['unit_id'])) {
            throw new \Exception('You do not have permission to move panjar request to this unit', Response::HTTP_FORBIDDEN);
        }

        return $this->panjarRequestRepository->update($id, $data);
    }

    public function updateWithItems(int $id, array $panjarData, ?array $itemsData = null)
    {
        // First check if user has access to this panjar request
        $panjarRequest = $this->panjarRequestRepository->getById($id, ['id', 'unit_id']);
        if (! $this->hasUnitAccess($panjarRequest->unit_id)) {
            throw new \Exception('You do not have permission to update this panjar request', Response::HTTP_FORBIDDEN);
        }

        // If updating unit_id, check access to new unit as well
        if (isset($panjarData['unit_id']) && ! $this->hasUnitAccess($panjarData['unit_id'])) {
            throw new \Exception('You do not have permission to move panjar request to this unit', Response::HTTP_FORBIDDEN);
        }

        return $this->panjarRequestRepository->updateWithItems($id, $panjarData, $itemsData);
    }

    public function delete(int $id)
    {
        // First check if user has access to this panjar request
        $panjarRequest = $this->panjarRequestRepository->getById($id, ['id', 'unit_id']);
        if (! $this->hasUnitAccess($panjarRequest->unit_id)) {
            throw new \Exception('You do not have permission to delete this panjar request', Response::HTTP_FORBIDDEN);
        }

        return $this->panjarRequestRepository->delete($id);
    }
}
