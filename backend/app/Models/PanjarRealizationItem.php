<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PanjarRealizationItem extends Model
{
    protected $fillable = [
        'panjar_request_id',
        'item_name',
        'spesification',
        'quantity',
        'unit',
        'price',
        'total',
        'description',
        'report_status',
        'receipt_file',
        'item_photo',
    ];

    /**
     * Boot method to add model events
     */
    protected static function boot()
    {
        parent::boot();

        // When model is being deleted, also delete associated files
        static::deleting(function ($item) {
            $item->deleteFiles();
        });
    }

    /**
     * Delete associated files
     */
    public function deleteFiles()
    {
        if ($this->receipt_file && Storage::disk('public')->exists($this->receipt_file)) {
            Storage::disk('public')->delete($this->receipt_file);
        }
        
        if ($this->item_photo && Storage::disk('public')->exists($this->item_photo)) {
            Storage::disk('public')->delete($this->item_photo);
        }
    }

    /**
     * Delete specific file if it exists
     */
    public function deleteFile($field)
    {
        if ($this->$field && Storage::disk('public')->exists($this->$field)) {
            Storage::disk('public')->delete($this->$field);
        }
    }

    public function panjarRequest()
    {
        return $this->belongsTo(PanjarRequest::class);
    }
}
