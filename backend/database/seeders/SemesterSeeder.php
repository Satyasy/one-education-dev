<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $semesters = [];
        $id = 1;
        
        for ($academicYearId = 1; $academicYearId <= 3; $academicYearId++) {
            $semesters[] = [
                'id' => $id++,
                'name' => 'Semester Ganjil',
                'academic_year_id' => $academicYearId,
                'created_at' => now(),
                'updated_at' => now()
            ];
            
            $semesters[] = [
                'id' => $id++,
                'name' => 'Semester Genap',
                'academic_year_id' => $academicYearId,
                'created_at' => now(),
                'updated_at' => now()
            ];
        }
        
        DB::table('semesters')->insert($semesters);
    }
} 