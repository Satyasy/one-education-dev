<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    protected $fillable = [
        'year',
        'status',
    ];

    public function classes()
    {
        return $this->hasMany(Classes::class);
    }

    public function semesters()
    {
        return $this->hasMany(Semester::class);
    }
}
