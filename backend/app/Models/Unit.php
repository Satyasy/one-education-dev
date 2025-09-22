<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $fillable = [
        'name',
        'code',
        'parent_id',
        'head_id',
        'description',
    ];

    // Relasi: Unit memiliki banyak employee (one-to-many)
    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    // Helper method: Mendapatkan users melalui employee
    public function users()
    {
        return User::whereHas('employee', function($query) {
            $query->where('unit_id', $this->id);
        });
    }

    public function budgets()
    {
        return $this->hasMany(Budget::class);
    }

    public function monthlyBudgetReports()
    {
        return $this->hasMany(MonthlyBudgetReport::class);
    }

    public function panjarRequests()
    {
        return $this->hasMany(PanjarRequest::class);
    }

    public function head()
    {
        return $this->belongsTo(User::class, 'head_id');
    }

    public function parent()
    {
        return $this->belongsTo(Unit::class, 'parent_id');
    }

    public function positions()
    {
        return $this->hasMany(Position::class, 'unit_id');
    }

    public function children()
    {
        return $this->hasMany(Unit::class, 'parent_id');
    }

    // Helper method: Mendapatkan anggota melalui employee
    public function members()
    {
        return $this->users();
    }

    public function allChildren()
    {
        $children = collect();
        
        foreach ($this->children as $child) {
            $children->push($child);
            $children = $children->merge($child->allChildren());
        }
        
        return $children;
    }

    public function getHierarchyUp()
    {
        $hierarchy = collect([$this]);
        $current = $this;
        
        while ($current->parent) {
            $current = $current->parent;
            $hierarchy->prepend($current);
        }
        
        return $hierarchy;
    }

    // Helper method: Mendapatkan semua anggota termasuk dari unit anak
    public function allMembers()
    {
        $memberIds = $this->members()->pluck('users.id');
        
        foreach ($this->allChildren() as $child) {
            $memberIds = $memberIds->merge($child->members()->pluck('users.id'));
        }
        
        return User::whereIn('id', $memberIds)->get();
    }

    public function headPosition()
    {
        return $this->positions()->where('user_id', $this->head_id)->first();
    }

    public function isParentOf(Unit $unit)
    {
        return $this->allChildren()->contains('id', $unit->id);
    }

    public function isChildOf(Unit $unit)
    {
        return $unit->isParentOf($this);
    }

    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeChildrenOf($query, $parentId)
    {
        return $query->where('parent_id', $parentId);
    }

    public function getFullNameAttribute()
    {
        $hierarchy = $this->getHierarchyUp();
        return $hierarchy->pluck('name')->implode(' > ');
    }
}
