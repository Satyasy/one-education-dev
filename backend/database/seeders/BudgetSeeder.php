<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BudgetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert Budget data for each unit
        $budgets = [
            [
                'id' => 3,
                'unit_id' => 3, // Unit Kurikulum
                'budget_year_id' => 2, // 2025 (active year)
                'quarterly' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'unit_id' => 4, // Unit Kesiswaan
                'budget_year_id' => 2, // 2025 (active year)
                'quarterly' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'unit_id' => 5, // Unit Sarana Prasarana
                'budget_year_id' => 2, // 2025 (active year)
                'quarterly' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 6,
                'unit_id' => 6, // Unit Hubungan Industri
                'budget_year_id' => 2, // 2025 (active year)
                'quarterly' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('budgets')->insert($budgets);

        // Insert Budget Items
        $budgetItems = [
            // Items for Unit Kurikulum (Budget ID: 3)
            [
                'id' => 6,
                'budget_id' => 3,
                'name' => 'Workshop dan Pelatihan Guru',
                'amount_allocation' => 150000000,
                'realization_amount' => 16250000,
                'remaining_amount' => 133750000,
                'description' => 'Anggaran untuk workshop dan pelatihan pengembangan kompetensi guru',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 7,
                'budget_id' => 3,
                'name' => 'Pengembangan Kurikulum',
                'amount_allocation' => 75000000,
                'realization_amount' => 0,
                'remaining_amount' => 75000000,
                'description' => 'Anggaran untuk penyusunan dan pengembangan kurikulum',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Items for Unit Kesiswaan (Budget ID: 4)
            [
                'id' => 8,
                'budget_id' => 4,
                'name' => 'Program Pembinaan Prestasi',
                'amount_allocation' => 100000000,
                'realization_amount' => 22500000,
                'remaining_amount' => 77500000,
                'description' => 'Anggaran untuk pembinaan prestasi siswa dalam berbagai bidang',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 9,
                'budget_id' => 4,
                'name' => 'Kegiatan Ekstrakurikuler',
                'amount_allocation' => 80000000,
                'realization_amount' => 0,
                'remaining_amount' => 80000000,
                'description' => 'Anggaran untuk mendukung kegiatan ekstrakurikuler siswa',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Items for Unit Sarana Prasarana (Budget ID: 5)
            [
                'id' => 10,
                'budget_id' => 5,
                'name' => 'Pengadaan Peralatan Lab',
                'amount_allocation' => 400000000,
                'realization_amount' => 181250000,
                'remaining_amount' => 218750000,
                'description' => 'Anggaran untuk pengadaan peralatan laboratorium komputer dan praktikum',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 11,
                'budget_id' => 5,
                'name' => 'Maintenance Gedung dan Fasilitas',
                'amount_allocation' => 200000000,
                'realization_amount' => 0,
                'remaining_amount' => 200000000,
                'description' => 'Anggaran untuk pemeliharaan gedung dan fasilitas sekolah',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Items for Unit Hubungan Industri (Budget ID: 6)
            [
                'id' => 12,
                'budget_id' => 6,
                'name' => 'Program PPDB',
                'amount_allocation' => 250000000,
                'realization_amount' => 0,
                'remaining_amount' => 250000000,
                'description' => 'Anggaran untuk kegiatan Penerimaan Peserta Didik Baru',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 13,
                'budget_id' => 6,
                'name' => 'Kerjasama Industri',
                'amount_allocation' => 150000000,
                'realization_amount' => 0,
                'remaining_amount' => 150000000,
                'description' => 'Anggaran untuk program kerjasama dengan industri dan PKL',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('budget_items')->insert($budgetItems);
    }
}
