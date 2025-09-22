<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudentClassHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all students
        $students = DB::table('students')->get();
        
        // Define class mapping based on cohort and study program
        foreach ($students as $student) {
            $histories = [];
            
            // Determine which classes the student should be in based on their cohort
            $cohortYear = (int) DB::table('cohorts')->where('id', $student->cohort_id)->value('year');
            $studyProgramCode = DB::table('study_programs')->where('id', $student->study_program_id)->value('code');
            
            // Calculate current class level based on cohort
            $currentYear = 2024; // Current year
            $yearsInSchool = $currentYear - $cohortYear;
            
            // Generate class history
            for ($year = 0; $year <= $yearsInSchool; $year++) {
                $classLevel = $this->getClassLevel($year);
                
                if ($classLevel) {
                    // Find appropriate academic year (assuming sequential IDs)
                    $academicYearId = $cohortYear - 2022 + $year + 1;
                    
                    if ($academicYearId <= 3) { // We only have 3 academic years
                        // Find class for this level, study program, and academic year
                        $className = "$classLevel $studyProgramCode 1"; // Assign to class 1 by default
                        
                        $class = DB::table('classes')
                            ->where('name', $className)
                            ->where('study_program_id', $student->study_program_id)
                            ->where('academic_year_id', $academicYearId)
                            ->first();
                        
                        if ($class) {
                            // Add entries for both semesters of this academic year
                            $semesterIds = DB::table('semesters')
                                ->where('academic_year_id', $academicYearId)
                                ->pluck('id');
                            
                            foreach ($semesterIds as $semesterId) {
                                $histories[] = [
                                    'student_id' => $student->id,
                                    'class_id' => $class->id,
                                    'semester_id' => $semesterId,
                                    'created_at' => now(),
                                    'updated_at' => now(),
                                ];
                            }
                        }
                    }
                }
            }
            
            // Insert all histories for this student
            if (!empty($histories)) {
                DB::table('student_class_histories')->insert($histories);
            }
        }
    }
    
    /**
     * Get class level based on years in school
     */
    private function getClassLevel($year)
    {
        switch ($year) {
            case 0:
                return 'X';
            case 1:
                return 'XI';
            case 2:
                return 'XII';
            default:
                return null; // Graduated
        }
    }
} 