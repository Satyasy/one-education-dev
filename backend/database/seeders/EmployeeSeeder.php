<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Data mapping untuk user dengan unit dan position
        $employeeData = [
            // Leadership
            ['email' => 'abror@smktelkom-sda.sch.id', 'unit_id' => 1, 'position_id' => 1, 'nip' => '1001001'], // Kepala Sekolah
            ['email' => 'vina@smktelkom-sda.sch.id', 'unit_id' => 1, 'position_id' => 2, 'nip' => '1001002'], // QMR
            
            // Tata Keuangan
            ['email' => 'sigit_eka@smktelkom-sda.sch.id', 'unit_id' => 2, 'position_id' => 3, 'nip' => '1002001'], // Kepala Administrasi
            ['email' => 'manda@smktelkom-sda.sch.id', 'unit_id' => 2, 'position_id' => 4, 'nip' => '1002002'], // Kepala HC
            ['email' => 'yunia29@smktelkom-sda.sch.id', 'unit_id' => 2, 'position_id' => 5, 'nip' => '1002003'], // Kepala Keuangan
            
            // Kurikulum
            ['email' => 'faun@smktelkom-sda.sch.id', 'unit_id' => 3, 'position_id' => 6, 'nip' => '1003001'], // Wakasek Kurikulum
            ['email' => 'eliza@smktelkom-sda.sch.id', 'unit_id' => 3, 'position_id' => 7, 'nip' => '1003002'], // Kepala Pembelajaran
            ['email' => 'grahmawati@smktelkom-sda.sch.id', 'unit_id' => 3, 'position_id' => 8, 'nip' => '1003003'], // Kepala Pengembangan
            ['email' => 'madiris@smktelkom-sda.sch.id', 'unit_id' => 3, 'position_id' => 9, 'nip' => '1003004'], // Kepala Prodi
            
            // Guru di Kurikulum
            ['email' => 'guru.matematika@smktelkom-sda.sch.id', 'unit_id' => 3, 'position_id' => 10, 'nip' => '1003010'],
            ['email' => 'guru.bahasa@smktelkom-sda.sch.id', 'unit_id' => 3, 'position_id' => 11, 'nip' => '1003011'],
            ['email' => 'guru.tkj@smktelkom-sda.sch.id', 'unit_id' => 3, 'position_id' => 12, 'nip' => '1003012'],
            ['email' => 'guru.rpl@smktelkom-sda.sch.id', 'unit_id' => 3, 'position_id' => 13, 'nip' => '1003013'],
            
            // Kesiswaan
            ['email' => 'maulana@smktelkom-sda.sch.id', 'unit_id' => 4, 'position_id' => 14, 'nip' => '1004001'], // Wakasek Kesiswaan
            ['email' => 'rachel@smktelkom-sda.sch.id', 'unit_id' => 4, 'position_id' => 15, 'nip' => '1004002'], // Kepala BK
            ['email' => 'abid@smktelkom-sda.sch.id', 'unit_id' => 4, 'position_id' => 16, 'nip' => '1004003'], // Kepala Prestasi
            
            // Wali Kelas di Kesiswaan
            ['email' => 'wali.x.tkj1@smktelkom-sda.sch.id', 'unit_id' => 4, 'position_id' => 17, 'nip' => '1004010'],
            ['email' => 'wali.xi.rpl1@smktelkom-sda.sch.id', 'unit_id' => 4, 'position_id' => 18, 'nip' => '1004011'],
            ['email' => 'wali.xii.tkj1@smktelkom-sda.sch.id', 'unit_id' => 4, 'position_id' => 19, 'nip' => '1004012'],
            
            // Sarana Prasarana
            ['email' => 'rifai@smktelkom-sda.sch.id', 'unit_id' => 5, 'position_id' => 20, 'nip' => '1005001'], // Wakasek Sarpras
            ['email' => 'novra@smktelkom-sda.sch.id', 'unit_id' => 5, 'position_id' => 21, 'nip' => '1005002'], // Kepala IT
            ['email' => 'david@smktelkom-sda.sch.id', 'unit_id' => 5, 'position_id' => 22, 'nip' => '1005003'], // Kepala Lab
            ['email' => 'ftrihadmoko@smktelkom-sda.sch.id', 'unit_id' => 5, 'position_id' => 23, 'nip' => '1005004'], // Kepala Sarana
            ['email' => 'staff.it@smktelkom-sda.sch.id', 'unit_id' => 5, 'position_id' => 24, 'nip' => '1005010'],
            
            // Hubungan Industri
            ['email' => 'ekap@smktelkom-sda.sch.id', 'unit_id' => 6, 'position_id' => 25, 'nip' => '1006001'], // Wakasek Hubin
            ['email' => 'shandi@smktelkom-sda.sch.id', 'unit_id' => 6, 'position_id' => 26, 'nip' => '1006002'], // Kepala PPDB
            ['email' => 'indra@smktelkom-sda.sch.id', 'unit_id' => 6, 'position_id' => 27, 'nip' => '1006003'], // Kepala Sinergi
            
            // Staff Administrasi - sekarang menggunakan position_id dari PositionSeeder
            ['email' => 'staff.admin1@smktelkom-sda.sch.id', 'unit_id' => 2, 'position_id' => 28, 'nip' => '2002001'],
            ['email' => 'staff.admin2@smktelkom-sda.sch.id', 'unit_id' => 2, 'position_id' => 29, 'nip' => '2002002'],
            
            // Admin System
            ['email' => 'admin@smktelkom-sda.sch.id', 'unit_id' => 1, 'position_id' => 30, 'nip' => '9999001'],
        ];
        
        foreach ($employeeData as $data) {
            $user = User::where('email', $data['email'])->first();
            
            if ($user) {
                Employee::create([
                    'user_id' => $user->id,
                    'unit_id' => $data['unit_id'],
                    'position_id' => $data['position_id'],
                    'nip' => $data['nip'],
                ]);
            }
        }
    }
} 