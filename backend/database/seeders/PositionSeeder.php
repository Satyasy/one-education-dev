<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\Employee;
use App\Models\Position;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Store existing relationships to recreate them later
        $positionUserMappings = [];
        if (Schema::hasColumn('positions', 'user_id')) {
            $positionUserMappings = DB::table('positions')
                ->whereNotNull('user_id')
                ->select('id', 'user_id')
                ->get()
                ->keyBy('id')
                ->toArray();
        }
        
        // Insert positions in hierarchical order to avoid foreign key issues
        
        // Level 0 - Top Level positions (no superior)
        Position::create([
            'id' => 1,
            'name' => 'Kepala Sekolah',
            'slug' => 'kepala-sekolah',
            'unit_id' => 1, // SMK Telkom Sidoarjo
            'superior_id' => null, // No superior
        ]);
        
        // Level 1 - Direct reports to Kepala Sekolah
        Position::create([
            'id' => 3,
            'name' => 'Kepala Administrasi',
            'slug' => 'kepala-administrasi',
            'unit_id' => 2, // Unit Administrasi
            'superior_id' => 1, // Reports to Kepala Sekolah
        ]);
        
        Position::create([
            'id' => 6,
            'name' => 'Wakil Kepala Sekolah Kurikulum',
            'slug' => 'wakil-kepala-sekolah-kurikulum',
            'unit_id' => 3, // Unit Kurikulum
            'superior_id' => 1, // Reports to Kepala Sekolah
        ]);
        
        Position::create([
            'id' => 14,
            'name' => 'Wakil Kepala Sekolah Kesiswaan',
            'slug' => 'wakil-kepala-sekolah-kesiswaan',
            'unit_id' => 4, // Unit Kesiswaan
            'superior_id' => 1, // Reports to Kepala Sekolah
        ]);
        
        Position::create([
            'id' => 20,
            'name' => 'Wakil Kepala Sekolah Sarana Prasarana',
            'slug' => 'wakil-kepala-sekolah-sarana-prasarana',
            'unit_id' => 5, // Unit Sarana Prasarana
            'superior_id' => 1, // Reports to Kepala Sekolah
        ]);
        
        Position::create([
            'id' => 25,
            'name' => 'Wakil Kepala Sekolah Hubungan Industri',
            'slug' => 'wakil-kepala-sekolah-hubungan-industri',
            'unit_id' => 6, // Unit Hubungan Industri
            'superior_id' => 1, // Reports to Kepala Sekolah
        ]);
        
        Position::create([
            'id' => 30,
            'name' => 'System Administrator',
            'slug' => 'system-administrator',
            'unit_id' => 1, // SMK Telkom Sidoarjo
            'superior_id' => 1, // Reports to Kepala Sekolah
        ]);
        
        // Level 2 - Reports to Kepala Administrasi
        Position::create([
            'id' => 2,
            'name' => 'Kepala Urusan QMR',
            'slug' => 'kepala-urusan-qmr',
            'unit_id' => 2, // Administrasi
            'superior_id' => 3, // Reports to Kepala Administrasi
        ]);
        
        Position::create([
            'id' => 4,
            'name' => 'Kepala Urusan Human Capital',
            'slug' => 'kepala-urusan-human-capital',
            'unit_id' => 2, // Unit Administrasi
            'superior_id' => 3, // Reports to Kepala Administrasi
        ]);
        
        Position::create([
            'id' => 5,
            'name' => 'Kepala Urusan Keuangan',
            'slug' => 'kepala-urusan-keuangan',
            'unit_id' => 2, // Unit Administrasi
            'superior_id' => 3, // Reports to Kepala Administrasi
        ]);
            
            // Unit Administrasi Positions
            [
                'id' => 3,
                'name' => 'Kepala Administrasi',
                'slug' => 'kepala-administrasi',
                'unit_id' => 2, // Unit Administrasi
                'superior_id' => 1, // Reports to Kepala Sekolah
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 4,
                'name' => 'Kepala Urusan Human Capital',
                'slug' => 'kepala-urusan-human-capital',
                'unit_id' => 2, // Unit Administrasi
                'superior_id' => 3, // Reports to Kepala Administrasi
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 5,
                'name' => 'Kepala Urusan Keuangan',
                'slug' => 'kepala-urusan-keuangan',
                'unit_id' => 2, // Unit Administrasi
                'superior_id' => 3, // Reports to Kepala Administrasi
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Unit Kurikulum Positions
            [
                'id' => 6,
                'name' => 'Wakil Kepala Sekolah Kurikulum',
                'slug' => 'wakil-kepala-sekolah-kurikulum',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 1, // Reports to Kepala Sekolah
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 7,
                'name' => 'Kepala Urusan Pembelajaran',
                'slug' => 'kepala-urusan-pembelajaran',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 6, // Reports to Wakasek Kurikulum
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 8,
                'name' => 'Kepala Urusan Pengembangan',
                'slug' => 'kepala-urusan-pengembangan',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 6, // Reports to Wakasek Kurikulum
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 9,
                'name' => 'Kepala Program Studi',
                'slug' => 'kepala-program-studi',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 6, // Reports to Wakasek Kurikulum
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 10,
                'name' => 'Guru Matematika',
                'slug' => 'guru-matematika',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 7, // Reports to Kepala Urusan Pembelajaran
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 11,
                'name' => 'Guru Bahasa Indonesia',
                'slug' => 'guru-bahasa-indonesia',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 7, // Reports to Kepala Urusan Pembelajaran
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 12,
                'name' => 'Guru TKJ',
                'slug' => 'guru-tkj',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 9, // Reports to Kepala Program Studi
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 13,
                'name' => 'Guru RPL',
                'slug' => 'guru-rpl',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 9, // Reports to Kepala Program Studi
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Unit Kesiswaan Positions
            [
                'id' => 14,
                'name' => 'Wakil Kepala Sekolah Kesiswaan',
                'slug' => 'wakil-kepala-sekolah-kesiswaan',
                'unit_id' => 4, // Unit Kesiswaan
                'superior_id' => 1, // Reports to Kepala Sekolah
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 15,
                'name' => 'Kepala Urusan BK',
                'slug' => 'kepala-urusan-bk',
                'unit_id' => 4, // Unit Kesiswaan
                'superior_id' => 14, // Reports to Wakasek Kesiswaan
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 16,
                'name' => 'Kepala Urusan Pembinaan Prestasi',
                'slug' => 'kepala-urusan-pembinaan-prestasi',
                'unit_id' => 4, // Unit Kesiswaan
                'superior_id' => 14, // Reports to Wakasek Kesiswaan
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 17,
                'name' => 'Wali Kelas X TKJ 1',
                'slug' => 'wali-kelas-x-tkj-1',
                'unit_id' => 4, // Unit Kesiswaan
                'superior_id' => 14, // Reports to Wakasek Kesiswaan
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 18,
                'name' => 'Wali Kelas XI RPL 1',
                'slug' => 'wali-kelas-xi-rpl-1',
                'unit_id' => 4, // Unit Kesiswaan
                'superior_id' => 14, // Reports to Wakasek Kesiswaan
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 19,
                'name' => 'Wali Kelas XII TKJ 1',
                'slug' => 'wali-kelas-xii-tkj-1',
                'unit_id' => 4, // Unit Kesiswaan
                'superior_id' => 14, // Reports to Wakasek Kesiswaan
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Unit Sarana Prasarana Positions
            [
                'id' => 20,
                'name' => 'Wakil Kepala Sekolah Sarana Prasarana',
                'slug' => 'wakil-kepala-sekolah-sarana-prasarana',
                'unit_id' => 5, // Unit Sarana Prasarana
                'superior_id' => 1, // Reports to Kepala Sekolah
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 21,
                'name' => 'Kepala Urusan IT',
                'slug' => 'kepala-urusan-it',
                'unit_id' => 5, // Unit Sarana Prasarana
                'superior_id' => 20, // Reports to Wakasek Sarpras
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 22,
                'name' => 'Kepala Urusan Lab',
                'slug' => 'kepala-urusan-lab',
                'unit_id' => 5, // Unit Sarana Prasarana
                'superior_id' => 20, // Reports to Wakasek Sarpras
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 23,
                'name' => 'Kepala Urusan Sarana',
                'slug' => 'kepala-urusan-sarana',
                'unit_id' => 5, // Unit Sarana Prasarana
                'superior_id' => 20, // Reports to Wakasek Sarpras
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 24,
                'name' => 'Staff IT Support',
                'slug' => 'staff-it-support',
                'unit_id' => 5, // Unit Sarana Prasarana
                'superior_id' => 21, // Reports to Kepala Urusan IT
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Unit Hubungan Industri Positions
            [
                'id' => 25,
                'name' => 'Wakil Kepala Sekolah Hubungan Industri',
                'slug' => 'wakil-kepala-sekolah-hubungan-industri',
                'unit_id' => 6, // Unit Hubungan Industri
                'superior_id' => 1, // Reports to Kepala Sekolah
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 26,
                'name' => 'Kepala Urusan PPDB',
                'slug' => 'kepala-urusan-ppdb',
                'unit_id' => 6, // Unit Hubungan Industri
                'superior_id' => 25, // Reports to Wakasek Hubin
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 27,
                'name' => 'Kepala Urusan Sinergi Industri',
                'slug' => 'kepala-urusan-sinergi-industri',
                'unit_id' => 6, // Unit Hubungan Industri
                'superior_id' => 25, // Reports to Wakasek Hubin
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Staff Administrasi
            [
                'id' => 28,
                'name' => 'Staff Administrasi',
                'slug' => 'staff-administrasi',
                'unit_id' => 2, // Unit Administrasi
                'superior_id' => 3, // Reports to Kepala Administrasi
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 29,
                'name' => 'Staff Administrasi',
                'slug' => 'staff-administrasi',
                'unit_id' => 2, // Unit Administrasi
                'superior_id' => 3, // Reports to Kepala Administrasi
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // System Administrator
            [
                'id' => 30,
                'name' => 'System Administrator',
                'slug' => 'system-administrator',
                'unit_id' => 1, // SMK Telkom Sidoarjo
                'superior_id' => 1, // Reports to Kepala Sekolah
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
        
        // Now recreate the employee-position relationship
        foreach ($positionUserMappings as $positionId => $mapping) {
            $user = User::find($mapping->user_id);
            if ($user && $user->employee) {
                $user->employee->update(['position_id' => $positionId]);
            }
        }
    }
}
