<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BudgetItem extends Model
{
    protected $fillable = [
        'budget_id',
        'name',
        'description',
        'amount_allocation',
        'realization_amount',
        'remaining_amount',
    ];

    public function budget()
    {
        return $this->belongsTo(Budget::class);
    }

    public function panjarRequests()
    {
        return $this->hasMany(PanjarRequest::class);
    }
}