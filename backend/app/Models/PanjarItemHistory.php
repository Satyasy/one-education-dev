<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PanjarItemHistory extends Model
{
    protected $fillable = [
        'panjar_item_id',
        'note',
        'reviewed_by',
        'reviewer_role',
        'status',
    ];

    public function panjarItem()
    {
        return $this->belongsTo(PanjarItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
