<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentClassHistory extends Model
{
    protected $fillable = [
        'student_id',
        'class_id',
        'semester_id',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function classes()
    {
        return $this->belongsTo(Classes::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

}
