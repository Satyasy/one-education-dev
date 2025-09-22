<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PanjarItemHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert Panjar Item Histories - history of revisions made by verifiers and approvers
        $panjarItemHistories = [
            // History for Panjar Item 1 (Komputer Desktop All-in-One) - Original revision by verifier
            [
                'panjar_item_id' => 1,
                'note' => 'Spesifikasi ditingkatkan oleh verifier dari Intel Core i3 ke i5, RAM dari 4GB ke 8GB, dan HDD ke SSD untuk kebutuhan yang lebih optimal',
                'reviewed_by' => 13, // Ir. Wati Wakasek Sarpras
                'status' => 'revision',
                'reviewer_role' => 'verifier',
                'created_at' => Carbon::now()->subDays(32),
                'updated_at' => Carbon::now()->subDays(32),
            ],
            // History for Panjar Item 1 - Final approval
            [
                'panjar_item_id' => 1,
                'note' => 'Revisi spesifikasi disetujui untuk standar yang lebih tinggi dengan upgrade ke All-in-One',
                'reviewed_by' => 1, // Dr. Ahmad Kepala Sekolah
                'status' => 'approved',
                'reviewer_role' => 'approver',
                'created_at' => Carbon::now()->subDays(30),
                'updated_at' => Carbon::now()->subDays(30),
            ],

            // History for Panjar Item 4 (Sewa Venue Workshop) - Revision by verifier
            [
                'panjar_item_id' => 4,
                'note' => 'Venue dipindah dari ruang meeting di kampus ke hotel untuk kenyamanan dan fasilitas yang lebih lengkap. Biaya naik dari 1.5jt/hari ke 2.5jt/hari',
                'reviewed_by' => 6, // Prof. Rina Wakasek Kurikulum
                'status' => 'revision',
                'reviewer_role' => 'verifier',
                'created_at' => Carbon::now()->subDays(16),
                'updated_at' => Carbon::now()->subDays(16),
            ],
            // History for Panjar Item 4 - Final verification
            [
                'panjar_item_id' => 4,
                'note' => 'Revisi venue workshop diverifikasi dan disetujui untuk dilanjutkan ke tahap approval',
                'reviewed_by' => 6, // Prof. Rina Wakasek Kurikulum
                'status' => 'verified',
                'reviewer_role' => 'verifier',
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],

            // History for Panjar Item 5 (Konsumsi Workshop) - Revision by verifier
            [
                'panjar_item_id' => 5,
                'note' => 'Konsumsi ditingkatkan dari snack dan minum (25rb/paket) menjadi paket lengkap dengan makan siang (75rb/paket)',
                'reviewed_by' => 6, // Prof. Rina Wakasek Kurikulum
                'status' => 'revision',
                'reviewer_role' => 'verifier',
                'created_at' => Carbon::now()->subDays(16),
                'updated_at' => Carbon::now()->subDays(16),
            ],
            // History for Panjar Item 5 - Final verification
            [
                'panjar_item_id' => 5,
                'note' => 'Revisi konsumsi workshop diverifikasi dan disetujui untuk dilanjutkan ke tahap approval',
                'reviewed_by' => 6, // Prof. Rina Wakasek Kurikulum
                'status' => 'verified',
                'reviewer_role' => 'verifier',
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],

            // History for Panjar Item 6 (Materi Training Kit) - Revision by verifier
            [
                'panjar_item_id' => 6,
                'note' => 'Kit pelatihan ditingkatkan dengan menambahkan flashdisk 16GB dan upgrade kualitas tas serta alat tulis',
                'reviewed_by' => 6, // Prof. Rina Wakasek Kurikulum
                'status' => 'revision',
                'reviewer_role' => 'verifier',
                'created_at' => Carbon::now()->subDays(16),
                'updated_at' => Carbon::now()->subDays(16),
            ],
            // History for Panjar Item 6 - Final verification
            [
                'panjar_item_id' => 6,
                'note' => 'Revisi materi training kit diverifikasi dan disetujui untuk dilanjutkan ke tahap approval',
                'reviewed_by' => 6, // Prof. Rina Wakasek Kurikulum
                'status' => 'verified',
                'reviewer_role' => 'verifier',
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],

            // History for Panjar Item 9 (Pelatihan Intensive Matematika) - Revision by verifier
            [
                'panjar_item_id' => 7,
                'note' => 'Durasi pelatihan diperpanjang dari 3 hari menjadi 5 hari untuk hasil optimal. Anggaran naik dari 9jt menjadi 15jt',
                'reviewed_by' => 10, // Drs. Hadi Wakasek Kesiswaan
                'status' => 'revision',
                'reviewer_role' => 'verifier',
                'created_at' => Carbon::now()->subDays(22),
                'updated_at' => Carbon::now()->subDays(22),
            ],
            // History for Panjar Item 9 - Final approval
            [
                'panjar_item_id' => 7,
                'note' => 'Disetujui dengan durasi dan anggaran yang telah direvisi untuk pelatihan intensive 5 hari',
                'reviewed_by' => 1, // Dr. Ahmad Kepala Sekolah
                'status' => 'approved',
                'reviewer_role' => 'approver',
                'created_at' => Carbon::now()->subDays(20),
                'updated_at' => Carbon::now()->subDays(20),
            ]
        ];

        DB::table('panjar_item_histories')->insert($panjarItemHistories);
    }
}
