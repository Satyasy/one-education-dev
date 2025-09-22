<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PanjarItem extends Model
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
        'status',
    ];

    public function panjarRequest()
    {
        return $this->belongsTo(PanjarRequest::class);
    }

    public function panjarItemHistories()
    {
        return $this->hasMany(PanjarItemHistory::class);
    }
}
