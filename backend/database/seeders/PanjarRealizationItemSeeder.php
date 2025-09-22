<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PanjarRealizationItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert Panjar Realization Items - actual items purchased/realized
        $panjarRealizationItems = [
            // Realization for Panjar Request 1 (Pengadaan Peralatan Lab Komputer) - Approved
            [
                'panjar_request_id' => 1,
                'item_name' => 'Komputer Desktop All-in-One HP',
                'spesification' => 'HP All-in-One 24-df1035d - Intel Core i5-1135G7, RAM 8GB, SSD 256GB, Monitor 23.8 inch',
                'quantity' => 20,
                'unit' => 'unit',
                'price' => 8750000,
                'total' => 175000000,
                'description' => 'Komputer untuk lab komputer - realisasi pembelian',
                'created_at' => Carbon::now()->subDays(25),
                'updated_at' => Carbon::now()->subDays(25),
            ],
            [
                'panjar_request_id' => 1,
                'item_name' => 'Switch Network Cisco 24 Port',
                'spesification' => 'Cisco Catalyst 1000 Series 24-Port Gigabit Ethernet Switch',
                'quantity' => 2,
                'unit' => 'unit',
                'price' => 3200000,
                'total' => 6400000,
                'description' => 'Switch untuk jaringan lab - realisasi pembelian',
                'created_at' => Carbon::now()->subDays(25),
                'updated_at' => Carbon::now()->subDays(25),
            ],

            // Realization for Panjar Request 4 (Pembinaan Prestasi Siswa Olimpiade) - Approved
            [
                'panjar_request_id' => 4,
                'item_name' => 'Pelatihan Intensive Matematika - Bimbel Neutron',
                'spesification' => 'Pelatihan olimpiade matematika 5 hari dengan instruktur bersertifikat',
                'quantity' => 1,
                'unit' => 'paket',
                'price' => 14500000,
                'total' => 14500000,
                'description' => 'Pelatihan matematika untuk persiapan olimpiade - realisasi',
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],
            [
                'panjar_request_id' => 4,
                'item_name' => 'Buku Olimpiade Matematika Erlangga',
                'spesification' => 'Paket buku olimpiade matematika SMA tingkat nasional dan internasional',
                'quantity' => 30,
                'unit' => 'set',
                'price' => 275000,
                'total' => 8250000,
                'description' => 'Buku dan modul untuk siswa olimpiade - realisasi pembelian',
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],

            // Partial realization for other approved items (showing realistic scenarios)
            [
                'panjar_request_id' => 1,
                'item_name' => 'Kabel UTP Cat6 Belden',
                'spesification' => 'Belden Cat6 UTP Cable 305m per roll - Premium quality',
                'quantity' => 3,
                'unit' => 'roll',
                'price' => 950000,
                'total' => 2850000,
                'description' => 'Kabel untuk instalasi jaringan - realisasi sebagian (3 dari 5 roll)',
                'created_at' => Carbon::now()->subDays(23),
                'updated_at' => Carbon::now()->subDays(23),
            ],

            // Future planned realizations (showing items that will be purchased)
            [
                'panjar_request_id' => 4,
                'item_name' => 'Sertifikat dan Piagam Olimpiade',
                'spesification' => 'Sertifikat keikutsertaan pelatihan olimpiade dengan frame kayu',
                'quantity' => 25,
                'unit' => 'buah',
                'price' => 50000,
                'total' => 1250000,
                'description' => 'Sertifikat untuk peserta pelatihan olimpiade',
                'created_at' => Carbon::now()->subDays(12),
                'updated_at' => Carbon::now()->subDays(12),
            ],
        ];

        DB::table('panjar_realization_items')->insert($panjarRealizationItems);
    }
}
