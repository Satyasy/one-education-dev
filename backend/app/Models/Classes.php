<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classes extends Model
{
    protected $fillable = [
        'name',
        'study_program_id',
        'academic_year_id',
    ];

    public function studyProgram()
    {
        return $this->belongsTo(StudyProgram::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function studentClassHistories()
    {
        return $this->hasMany(StudentClassHistory::class);
    }

}
