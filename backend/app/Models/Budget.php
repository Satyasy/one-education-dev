<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    protected $fillable = [
        'unit_id',
        'budget_year_id',
        'quarterly',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class);   
    }

    public function budgetItems()
    {
        return $this->hasMany(BudgetItem::class);
    }

    public function panjarRequests()
    {
        return $this->hasManyThrough(PanjarRequest::class, BudgetItem::class);
    }

    public function budgetYear()
    {
        return $this->belongsTo(BudgetYear::class);
    }

    public function getYearAttribute()
    {
        return $this->budgetYear->year; // Ensure year is always an integer
    }

}
