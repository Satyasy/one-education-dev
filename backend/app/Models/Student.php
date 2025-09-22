<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'study_program_id',
        'cohort_id',
        'parent_number',
        'parent_name',
        'gender',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function studyProgram()
    {
        return $this->belongsTo(StudyProgram::class);
    }

    public function cohort()
    {
        return $this->belongsTo(Cohort::class);
    }
    public function studentClassHistories()
    {
        return $this->hasMany(StudentClassHistory::class);
    }
}
