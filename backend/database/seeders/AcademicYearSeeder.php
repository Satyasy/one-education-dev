<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AcademicYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('academic_years')->insert([
            [
                'id' => 1,
                'year' => '2022/2023',
                'status' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2,
                'year' => '2023/2024',
                'status' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 3,
                'year' => '2024/2025',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
} 