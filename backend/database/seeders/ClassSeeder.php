<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = [];
        $id = 1;
        
        // Study Programs
        $studyPrograms = [
            1 => 'TKJ',
            2 => 'RPL',
            3 => 'MM'
        ];
        
        // Academic Years
        $academicYears = [
            1 => '2022/2023',
            2 => '2023/2024', 
            3 => '2024/2025'
        ];
        
        foreach ($studyPrograms as $spId => $spCode) {
            foreach ($academicYears as $ayId => $ayYear) {
                // Class levels (X, XI, XII)
                $levels = ['X', 'XI', 'XII'];
                
                foreach ($levels as $level) {
                    for ($classNum = 1; $classNum <= 2; $classNum++) {
                        $classes[] = [
                            'id' => $id++,
                            'name' => "$level $spCode $classNum",
                            'study_program_id' => $spId,
                            'academic_year_id' => $ayId,
                            'created_at' => now(),
                            'updated_at' => now()
                        ];
                    }
                }
            }
        }
        
        DB::table('classes')->insert($classes);
    }
} 