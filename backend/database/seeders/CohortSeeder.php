<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CohortSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('cohorts')->insert([
            [
                'id' => 1,
                'year' => '2022',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2,
                'year' => '2023',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 3,
                'year' => '2024',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
} 