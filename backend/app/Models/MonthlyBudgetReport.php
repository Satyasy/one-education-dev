<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthlyBudgetReport extends Model
{
    protected $fillable = [
        'unit_id',
        'month',
        'year',
        'total_budget',
        'total_realization',
        'remaining_budget',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

}
