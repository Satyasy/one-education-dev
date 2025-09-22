<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cohort extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
    ];

    // Relasi: Cohort memiliki banyak students (one-to-many)
    public function students()
    {
        return $this->hasMany(Student::class);
    }
}
