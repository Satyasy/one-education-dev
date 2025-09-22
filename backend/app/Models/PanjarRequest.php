<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PanjarRequest extends Model
{
    protected $fillable = [
        'unit_id',
        'budget_item_id',
        'created_by',
        'verified_by',
        'approved_by',
        'status',
        'report_status',
        'request_date',
        'total_amount',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function budgetItem()
    {
        return $this->belongsTo(BudgetItem::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function items()
    {
        return $this->hasMany(PanjarItem::class);
    }

    public function panjarRealizationItems()
    {
        return $this->hasMany(PanjarRealizationItem::class);
    }

}
