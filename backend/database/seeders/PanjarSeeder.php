<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PanjarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert Panjar Requests
        $panjarRequests = [
            [
                'id' => 1,
                'unit_id' => 5, // Unit Sarana Prasarana
                'budget_item_id' => 10, // Budget Item: Pengadaan Peralatan Lab
                'created_by' => 15, // Sari Kepala Lab
                'verified_by' => 13, // Ir. Wati Wakasek Sarpras
                'approved_by' => 1, // Dr. Ahmad Kepala Sekolah
                'status' => 'approved',
                'total_amount' => 181250000,
                'request_date' => Carbon::now()->subDays(30),
                'created_at' => Carbon::now()->subDays(30),
                'updated_at' => Carbon::now()->subDays(25),
            ],
            [
                'id' => 2,
                'unit_id' => 3, // Unit Kurikulum
                'budget_item_id' => 6, // Budget Item: Workshop dan Pelatihan Guru
                'created_by' => 9, // Rudi Kepala Prodi
                'verified_by' => 6, // Prof. Rina Wakasek Kurikulum
                'approved_by' => null,
                'status' => 'verified',
                'total_amount' => 16250000,
                'request_date' => Carbon::now()->subDays(15),
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(10),
            ],
            [
                'id' => 3,
                'unit_id' => 6, // Unit Hubungan Industri
                'budget_item_id' => 12, // Budget Item: Program PPDB
                'created_by' => 18, // Eko Kepala PPDB
                'verified_by' => null,
                'approved_by' => null,
                'status' => 'pending',
                'total_amount' => 33750000,
                'request_date' => Carbon::now()->subDays(5),
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ],
            [
                'id' => 4,
                'unit_id' => 4, // Unit Kesiswaan
                'budget_item_id' => 8, // Budget Item: Program Pembinaan Prestasi
                'created_by' => 12, // Tono Kepala Prestasi
                'verified_by' => 10, // Drs. Hadi Wakasek Kesiswaan
                'approved_by' => 1, // Dr. Ahmad Kepala Sekolah
                'status' => 'approved',
                'total_amount' => 22500000,
                'request_date' => Carbon::now()->subDays(20),
                'created_at' => Carbon::now()->subDays(20),
                'updated_at' => Carbon::now()->subDays(15),
            ],
        ];

        DB::table('panjar_requests')->insert($panjarRequests);

        // Insert Panjar Items
        $panjarItems = [
            // Items for Panjar Request 1 (Pengadaan Peralatan Lab Komputer)
            [
                'panjar_request_id' => 1,
                'item_name' => 'Komputer Desktop All-in-One',
                'spesification' => 'Processor Intel Core i5, RAM 8GB, SSD 256GB, Monitor 21 inch',
                'quantity' => 20,
                'unit' => 'unit',
                'price' => 8500000,
                'total' => 170000000,
                'description' => 'Untuk lab komputer baru',
                'status' => 'approved',
                'created_at' => Carbon::now()->subDays(30),
                'updated_at' => Carbon::now()->subDays(30),
            ],
            [
                'panjar_request_id' => 1,
                'item_name' => 'Switch Network 24 Port',
                'spesification' => 'Gigabit Ethernet, Managed Switch, PoE+',
                'quantity' => 2,
                'unit' => 'unit',
                'price' => 3500000,
                'total' => 7000000,
                'description' => 'Untuk koneksi jaringan lab',
                'status' => 'approved',
                'created_at' => Carbon::now()->subDays(30),
                'updated_at' => Carbon::now()->subDays(30),
            ],
            [
                'panjar_request_id' => 1,
                'item_name' => 'Kabel UTP Cat6',
                'spesification' => 'Cable UTP Cat6 305 meter per roll',
                'quantity' => 5,
                'unit' => 'roll',
                'price' => 850000,
                'total' => 4250000,
                'description' => 'Untuk instalasi jaringan',
                'status' => 'approved',
                'created_at' => Carbon::now()->subDays(30),
                'updated_at' => Carbon::now()->subDays(30),
            ],

            // Items for Panjar Request 2 (Workshop Guru TKJ)
            [
                'panjar_request_id' => 2,
                'item_name' => 'Sewa Venue Workshop',
                'spesification' => 'Hotel meeting room kapasitas 50 orang, 2 hari',
                'quantity' => 2,
                'unit' => 'hari',
                'price' => 2500000,
                'total' => 5000000,
                'description' => 'Tempat pelaksanaan workshop',
                'status' => 'verified',
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],
            [
                'panjar_request_id' => 2,
                'item_name' => 'Konsumsi Workshop',
                'spesification' => 'Makan siang dan coffee break untuk 50 peserta',
                'quantity' => 50,
                'unit' => 'paket',
                'price' => 75000,
                'total' => 3750000,
                'description' => 'Konsumsi peserta workshop',
                'status' => 'verified',
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],
            [
                'panjar_request_id' => 2,
                'item_name' => 'Materi Training Kit',
                'spesification' => 'Modul, tas, alat tulis, flashdisk 16GB',
                'quantity' => 50,
                'unit' => 'paket',
                'price' => 150000,
                'total' => 7500000,
                'description' => 'Kit untuk peserta workshop',
                'status' => 'verified',
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],

            // Items for Panjar Request 3 (PPDB 2025)
            [
                'panjar_request_id' => 3,
                'item_name' => 'Spanduk dan Banner Promosi',
                'spesification' => 'Spanduk 3x2m dan banner 1x2m dengan design profesional',
                'quantity' => 25,
                'unit' => 'buah',
                'price' => 350000,
                'total' => 8750000,
                'description' => 'Media promosi PPDB',
                'status' => 'pending',
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ],
            [
                'panjar_request_id' => 3,
                'item_name' => 'Brosur dan Flyer',
                'spesification' => 'Cetak brosur A4 dan flyer A5 full color',
                'quantity' => 10000,
                'unit' => 'lembar',
                'price' => 2500,
                'total' => 25000000,
                'description' => 'Materi promosi untuk dibagikan',
                'status' => 'pending',
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ],

            // Items for Panjar Request 4 (Pembinaan Prestasi)
            [
                'panjar_request_id' => 4,
                'item_name' => 'Pelatihan Intensive Matematika',
                'spesification' => 'Pelatihan 5 hari untuk persiapan olimpiade',
                'quantity' => 1,
                'unit' => 'paket',
                'price' => 15000000,
                'total' => 15000000,
                'description' => 'Pelatihan untuk siswa olimpiade matematika',
                'status' => 'approved',
                'created_at' => Carbon::now()->subDays(20),
                'updated_at' => Carbon::now()->subDays(20),
            ],
            [
                'panjar_request_id' => 4,
                'item_name' => 'Buku dan Modul Olimpiade',
                'spesification' => 'Buku soal olimpiade matematika dan fisika',
                'quantity' => 30,
                'unit' => 'set',
                'price' => 250000,
                'total' => 7500000,
                'description' => 'Materi belajar untuk siswa',
                'status' => 'approved',
                'created_at' => Carbon::now()->subDays(20),
                'updated_at' => Carbon::now()->subDays(20),
            ],
        ];

        DB::table('panjar_items')->insert($panjarItems);
    }
}
