<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BudgetYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $budgetYears = [
            [
                'id' => 1,
                'year' => 2024,
                'is_active' => false,
                'description' => 'Tahun Anggaran 2024',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'year' => 2025,
                'is_active' => true,
                'description' => 'Tahun Anggaran 2025 (Aktif)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'year' => 2026,
                'is_active' => false,
                'description' => 'Tahun Anggaran 2026',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('budget_years')->insert($budgetYears);
    }
}
