<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudyProgram extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
    ];

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function classes()
    {
        return $this->hasMany(Classes::class);
    }
}
