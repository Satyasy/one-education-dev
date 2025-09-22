<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'user_id',
        'unit_id',
        'position_id',
        'nip',
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
    
    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function directSuperior()
    {
        if ($this->position && $this->position->superior) {
            return Employee::whereHas('position', function($query) {
                $query->where('id', $this->position->superior_id);
            })->first();
        }
        return null;
    }

    public function allSubordinates()
    {
        if ($this->position) {
            $subordinatePositionIds = $this->position->subordinates()->pluck('id');
            if ($subordinatePositionIds->isNotEmpty()) {
                return Employee::whereIn('position_id', $subordinatePositionIds)->get();
            }
        }
        return collect();
    }
}
