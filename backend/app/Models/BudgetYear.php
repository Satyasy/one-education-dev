<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BudgetYear extends Model
{
    protected $fillable = [
        'year',
        'is_active',
        'description',
    ];
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the budgets associated with this budget year.
     */
    public function budgets()
    {
        return $this->hasMany(Budget::class);
    }

    /**
     * Scope a query to only include active budget years.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
