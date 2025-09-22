<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    protected $fillable = [
        'name',
        'unit_id',
        'superior_id',
    ];

    // Relasi: Posisi berada di unit tertentu (many-to-one)
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    // Relasi: Posisi terhubung dengan employee (one-to-many)
    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    // Helper: Mendapatkan user melalui relasi employee
    public function users()
    {
        return User::whereHas('employee', function($query) {
            $query->where('position_id', $this->id);
        });
    }

    // Relasi: Posisi memiliki atasan (many-to-one)
    public function superior()
    {
        return $this->belongsTo(Position::class, 'superior_id');
    }

    // Relasi: Posisi memiliki bawahan (one-to-many)
    public function subordinates()
    {
        return $this->hasMany(Position::class, 'superior_id');
    }

    // Helper method: Mendapatkan semua bawahan secara rekursif
    public function allSubordinates()
    {
        $subordinates = collect();
        
        foreach ($this->subordinates as $subordinate) {
            $subordinates->push($subordinate);
            $subordinates = $subordinates->merge($subordinate->allSubordinates());
        }
        
        return $subordinates;
    }

    // Helper method: Mendapatkan hierarki ke atas
    public function getHierarchyUp()
    {
        $hierarchy = collect([$this]);
        $current = $this;
        
        while ($current->superior) {
            $current = $current->superior;
            $hierarchy->prepend($current);
        }
        
        return $hierarchy;
    }

    // Helper method: Cek apakah posisi ini adalah atasan dari posisi lain
    public function isSuperiorOf(Position $position)
    {
        return $this->allSubordinates()->contains('id', $position->id);
    }

    // Helper method: Cek apakah posisi ini adalah bawahan dari posisi lain
    public function isSubordinateOf(Position $position)
    {
        return $position->isSuperiorOf($this);
    }

    // Scope: Posisi dalam unit tertentu
    public function scopeInUnit($query, $unitId)
    {
        return $query->where('unit_id', $unitId);
    }

    // Scope: Posisi tanpa atasan (kepala unit/top level)
    public function scopeTopLevel($query)
    {
        return $query->whereNull('superior_id');
    }
}
