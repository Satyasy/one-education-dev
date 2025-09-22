<?php

namespace App\Repositories;

use App\Models\PanjarItem;
use App\Models\PanjarRealizationItem;

class PanjarRealizationItemRepository
{
    public function getAllPanjarRealizations($panjarRequestId)
    {
        return PanjarRealizationItem::with(['panjarRequest.unit', 'panjarRequest.budgetItem'])
            ->where('panjar_request_id', $panjarRequestId)
            ->get();
    }
    public function createPanjarRealization(array $data)
    {
        // Only allow fillable fields
        $item = PanjarRealizationItem::create($data);
        return $item->load(['panjarRequest.unit', 'panjarRequest.budgetItem']);
    }

    public function getPanjarRealizationByPanjarRequestIdByItemId(int $panjarRequestId, int $itemId)
    {
        return PanjarItem::where('panjar_request_id', $panjarRequestId)
            ->where('id', $itemId)
            ->get();
    }
    
    public function updatePanjarRealizationItem(int $id, array $data)
    {
        $item = PanjarRealizationItem::findOrFail($id);
        
        // Delete old files if new ones are being uploaded
        if (isset($data['receipt_file']) && $item->receipt_file) {
            $item->deleteFile('receipt_file');
        }
        
        if (isset($data['item_photo']) && $item->item_photo) {
            $item->deleteFile('item_photo');
        }
        
        $item->update($data);
        return $item->load(['panjarRequest.unit', 'panjarRequest.budgetItem']);
    }

    public function getPanjarRealizationItemById(int $id)
    {
        return PanjarRealizationItem::with(['panjarRequest.unit', 'panjarRequest.budgetItem'])->findOrFail($id);
    }
    
    public function deletePanjarRealizationItem(int $id)
    {
        $item = PanjarRealizationItem::findOrFail($id);
        // Files will be automatically deleted by model event
        $item->delete();
        return $item;
    }

    public function updateReportStatus(int $id, array $data)
    {
        $item = PanjarRealizationItem::findOrFail($id);
        $item->update([
            'report_status' => $data['report_status']
        ]);
        return $item;
    }
}