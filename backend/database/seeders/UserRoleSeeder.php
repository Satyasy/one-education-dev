<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'admin', 
            'kepala-sekolah',
            'wakil-kepala-sekolah',
            'kepala-urusan',
            'kepala-administrasi',
            'staff',
            'guru',
            'wali-kelas',
            'siswa'
        ];
        
        $permissions = ['create', 'edit', 'delete', 'view'];

        // Create roles
        foreach($roles as $roleName){
            Role::firstOrCreate(['name' => $roleName]);        
        }

        // Create permissions
        foreach($permissions as $permissionName){
            Permission::firstOrCreate(['name' => $permissionName]);
        }

        // Give admin all permissions
        $adminRole = Role::where('name', 'admin')->first();
        $adminRole->givePermissionTo($permissions);

        // Create positions first (needed for user-employee relationship)
        $this->createPositions();
        
        // Create users with complete organizational data
        $this->createUsersWithEmployees();
    }

    /**
     * Create all positions with proper hierarchy
     */
    private function createPositions(): void
    {
        $positions = [
            // Top Level - Kepala Sekolah
            [
                'id' => 1,
                'name' => 'Kepala Sekolah',
                'slug' => 'kepala-sekolah',
                'unit_id' => 1, // SMK Telkom Sidoarjo
                'superior_id' => null, // No superior
            ],
            
            // Unit Administrasi Positions
            [
                'id' => 2,
                'name' => 'Kepala Administrasi',
                'slug' => 'kepala-administrasi',
                'unit_id' => 2, // Unit Administrasi
                'superior_id' => 1, // Reports to Kepala Sekolah
            ],
            [
                'id' => 3,
                'name' => 'Kepala Urusan QMR',
                'slug' => 'kepala-urusan-qmr',
                'unit_id' => 2, // Unit Administrasi
                'superior_id' => 2, // Reports to Kepala Administrasi
            ],
            [
                'id' => 4,
                'name' => 'Kepala Urusan Human Capital',
                'slug' => 'kepala-urusan-human-capital',
                'unit_id' => 2, // Unit Administrasi
                'superior_id' => 2, // Reports to Kepala Administrasi
            ],
            [
                'id' => 5,
                'name' => 'Kepala Urusan Keuangan',
                'slug' => 'kepala-urusan-keuangan',
                'unit_id' => 2, // Unit Administrasi
                'superior_id' => 2, // Reports to Kepala Administrasi
            ],
            
            // Unit Kurikulum Positions
            [
                'id' => 6,
                'name' => 'Wakil Kepala Sekolah Kurikulum',
                'slug' => 'wakil-kepala-sekolah-kurikulum',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 1, // Reports to Kepala Sekolah
            ],
            [
                'id' => 7,
                'name' => 'Kepala Urusan Pembelajaran',
                'slug' => 'kepala-urusan-pembelajaran',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 6, // Reports to Wakasek Kurikulum
            ],
            [
                'id' => 8,
                'name' => 'Kepala Urusan Pengembangan',
                'slug' => 'kepala-urusan-pengembangan',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 6, // Reports to Wakasek Kurikulum
            ],
            [
                'id' => 9,
                'name' => 'Kepala Program Studi',
                'slug' => 'kepala-program-studi',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 6, // Reports to Wakasek Kurikulum
            ],
            [
                'id' => 10,
                'name' => 'Guru Matematika',
                'slug' => 'guru-matematika',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 7, // Reports to Kepala Urusan Pembelajaran
            ],
            [
                'id' => 11,
                'name' => 'Guru Bahasa Indonesia',
                'slug' => 'guru-bahasa-indonesia',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 7, // Reports to Kepala Urusan Pembelajaran
            ],
            [
                'id' => 12,
                'name' => 'Guru TKJ',
                'slug' => 'guru-tkj',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 9, // Reports to Kepala Program Studi
            ],
            [
                'id' => 13,
                'name' => 'Guru RPL',
                'slug' => 'guru-rpl',
                'unit_id' => 3, // Unit Kurikulum
                'superior_id' => 9, // Reports to Kepala Program Studi
            ],
            
            // Unit Kesiswaan Positions
            [
                'id' => 14,
                'name' => 'Wakil Kepala Sekolah Kesiswaan',
                'slug' => 'wakil-kepala-sekolah-kesiswaan',
                'unit_id' => 4, // Unit Kesiswaan
                'superior_id' => 1, // Reports to Kepala Sekolah
            ],
            [
                'id' => 15,
                'name' => 'Kepala Urusan BK',
                'slug' => 'kepala-urusan-bk',
                'unit_id' => 4, // Unit Kesiswaan
                'superior_id' => 14, // Reports to Wakasek Kesiswaan
            ],
            [
                'id' => 16,
                'name' => 'Kepala Urusan Pembinaan Prestasi',
                'slug' => 'kepala-urusan-pembinaan-prestasi',
                'unit_id' => 4, // Unit Kesiswaan
                'superior_id' => 14, // Reports to Wakasek Kesiswaan
            ],
            [
                'id' => 17,
                'name' => 'Wali Kelas X TKJ 1',
                'slug' => 'wali-kelas-x-tkj-1',
                'unit_id' => 4, // Unit Kesiswaan
                'superior_id' => 14, // Reports to Wakasek Kesiswaan
            ],
            [
                'id' => 18,
                'name' => 'Wali Kelas XI RPL 1',
                'slug' => 'wali-kelas-xi-rpl-1',
                'unit_id' => 4, // Unit Kesiswaan
                'superior_id' => 14, // Reports to Wakasek Kesiswaan
            ],
            [
                'id' => 19,
                'name' => 'Wali Kelas XII TKJ 1',
                'slug' => 'wali-kelas-xii-tkj-1',
                'unit_id' => 4, // Unit Kesiswaan
                'superior_id' => 14, // Reports to Wakasek Kesiswaan
            ],
            
            // Unit Sarana Prasarana Positions
            [
                'id' => 20,
                'name' => 'Wakil Kepala Sekolah Sarana Prasarana',
                'slug' => 'wakil-kepala-sekolah-sarana-prasarana',
                'unit_id' => 5, // Unit Sarana Prasarana
                'superior_id' => 1, // Reports to Kepala Sekolah
            ],
            [
                'id' => 21,
                'name' => 'Kepala Urusan IT',
                'slug' => 'kepala-urusan-it',
                'unit_id' => 5, // Unit Sarana Prasarana
                'superior_id' => 20, // Reports to Wakasek Sarpras
            ],
            [
                'id' => 22,
                'name' => 'Kepala Urusan Lab',
                'slug' => 'kepala-urusan-lab',
                'unit_id' => 5, // Unit Sarana Prasarana
                'superior_id' => 20, // Reports to Wakasek Sarpras
            ],
            [
                'id' => 23,
                'name' => 'Kepala Urusan Sarana',
                'slug' => 'kepala-urusan-sarana',
                'unit_id' => 5, // Unit Sarana Prasarana
                'superior_id' => 20, // Reports to Wakasek Sarpras
            ],
            [
                'id' => 24,
                'name' => 'Staff IT Support',
                'slug' => 'staff-it-support',
                'unit_id' => 5, // Unit Sarana Prasarana
                'superior_id' => 21, // Reports to Kepala Urusan IT
            ],
            
            // Unit Hubungan Industri Positions
            [
                'id' => 25,
                'name' => 'Wakil Kepala Sekolah Hubungan Industri',
                'slug' => 'wakil-kepala-sekolah-hubungan-industri',
                'unit_id' => 6, // Unit Hubungan Industri
                'superior_id' => 1, // Reports to Kepala Sekolah
            ],
            [
                'id' => 26,
                'name' => 'Kepala Urusan PPDB',
                'slug' => 'kepala-urusan-ppdb',
                'unit_id' => 6, // Unit Hubungan Industri
                'superior_id' => 25, // Reports to Wakasek Hubin
            ],
            [
                'id' => 27,
                'name' => 'Kepala Urusan Sinergi Industri',
                'slug' => 'kepala-urusan-sinergi-industri',
                'unit_id' => 6, // Unit Hubungan Industri
                'superior_id' => 25, // Reports to Wakasek Hubin
            ],
            
            // Staff Administrasi
            [
                'id' => 28,
                'name' => 'Staff Administrasi',
                'slug' => 'staff-administrasi',
                'unit_id' => 2, // Unit Administrasi
                'superior_id' => 2, // Reports to Kepala Administrasi
            ],
            
            // System Administrator
            [
                'id' => 29,
                'name' => 'System Administrator',
                'slug' => 'system-administrator',
                'unit_id' => 1, // SMK Telkom Sidoarjo
                'superior_id' => 1, // Reports to Kepala Sekolah
            ],
        ];

        foreach ($positions as $position) {
            Position::create([
                'id' => $position['id'],
                'name' => $position['name'],
                'slug' => $position['slug'],
                'unit_id' => $position['unit_id'],
                'superior_id' => $position['superior_id'],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }

    /**
     * Create users with employees in one consistent flow
     */
    private function createUsersWithEmployees(): void
    {
        // Unified user and employee data - email, role, position_id, unit_id, nip
        $usersData = [
            // Leadership
            ['name' => 'Abror, S.Hum., M.Pd', 'email' => 'abror@smktelkom-sda.sch.id', 'role' => 'kepala-sekolah', 'position_id' => 1, 'unit_id' => 1, 'nip' => '1001001'],
            ['name' => 'Vina Rachmaya', 'email' => 'vina@smktelkom-sda.sch.id', 'role' => 'kepala-urusan', 'position_id' => 3, 'unit_id' => 2, 'nip' => '1002001'],
            
            // Tata Keuangan
            ['name' => 'Sigit Eka Prayoga', 'email' => 'sigit_eka@smktelkom-sda.sch.id', 'role' => 'kepala-administrasi', 'position_id' => 2, 'unit_id' => 2, 'nip' => '1002002'],
            ['name' => 'Pratama Rangsia Alamanda', 'email' => 'manda@smktelkom-sda.sch.id', 'role' => 'kepala-urusan', 'position_id' => 4, 'unit_id' => 2, 'nip' => '1002003'],
            ['name' => 'Yunia Vita', 'email' => 'yunia29@smktelkom-sda.sch.id', 'role' => 'kepala-urusan', 'position_id' => 5, 'unit_id' => 2, 'nip' => '1002004'],
            
            // Kurikulum
            ['name' => 'Siti Sifaun Nadhiroh', 'email' => 'faun@smktelkom-sda.sch.id', 'role' => 'wakil-kepala-sekolah', 'position_id' => 6, 'unit_id' => 3, 'nip' => '1003001'],
            ['name' => 'Eliza Tyas Damayanti', 'email' => 'eliza@smktelkom-sda.sch.id', 'role' => 'kepala-urusan', 'position_id' => 7, 'unit_id' => 3, 'nip' => '1003002'],
            ['name' => 'Galuh Rahmawati', 'email' => 'grahmawati@smktelkom-sda.sch.id', 'role' => 'kepala-urusan', 'position_id' => 8, 'unit_id' => 3, 'nip' => '1003003'],
            ['name' => 'M Adi Riswanto', 'email' => 'madiris@smktelkom-sda.sch.id', 'role' => 'kepala-urusan', 'position_id' => 9, 'unit_id' => 3, 'nip' => '1003004'],
            
            // Kesiswaan
            ['name' => 'Maulana Ghofiqi', 'email' => 'maulana@smktelkom-sda.sch.id', 'role' => 'wakil-kepala-sekolah', 'position_id' => 14, 'unit_id' => 4, 'nip' => '1004001'],
            ['name' => 'Rachel Aprilliani', 'email' => 'rachel@smktelkom-sda.sch.id', 'role' => 'kepala-urusan', 'position_id' => 15, 'unit_id' => 4, 'nip' => '1004002'],
            ['name' => 'Misbakhul Abid', 'email' => 'abid@smktelkom-sda.sch.id', 'role' => 'kepala-urusan', 'position_id' => 16, 'unit_id' => 4, 'nip' => '1004003'],
            
            // Sarana Prasarana
            ['name' => 'Achmad Rifai', 'email' => 'rifai@smktelkom-sda.sch.id', 'role' => 'wakil-kepala-sekolah', 'position_id' => 20, 'unit_id' => 5, 'nip' => '1005001'],
            ['name' => 'Novra Edi Pratama', 'email' => 'novra@smktelkom-sda.sch.id', 'role' => 'kepala-urusan', 'position_id' => 21, 'unit_id' => 5, 'nip' => '1005002'],
            ['name' => 'David Wahyu', 'email' => 'david@smktelkom-sda.sch.id', 'role' => 'kepala-urusan', 'position_id' => 22, 'unit_id' => 5, 'nip' => '1005003'],
            ['name' => 'Fajar Trihadmoko', 'email' => 'ftrihadmoko@smktelkom-sda.sch.id', 'role' => 'kepala-urusan', 'position_id' => 23, 'unit_id' => 5, 'nip' => '1005004'],
            ['name' => 'Staff IT Support', 'email' => 'staff.it@smktelkom-sda.sch.id', 'role' => 'staff', 'position_id' => 24, 'unit_id' => 5, 'nip' => '1005010'],
            
            // Hubungan Industri
            ['name' => 'Eka Prasetia Purnawati Iswardiani', 'email' => 'ekap@smktelkom-sda.sch.id', 'role' => 'wakil-kepala-sekolah', 'position_id' => 25, 'unit_id' => 6, 'nip' => '1006001'],
            ['name' => 'Shandi Pratama', 'email' => 'shandi@smktelkom-sda.sch.id', 'role' => 'kepala-urusan', 'position_id' => 26, 'unit_id' => 6, 'nip' => '1006002'],
            ['name' => 'Indra Hadi Pranata', 'email' => 'indra@smktelkom-sda.sch.id', 'role' => 'kepala-urusan', 'position_id' => 27, 'unit_id' => 6, 'nip' => '1006003'],
            
            // Staff Administrasi
            ['name' => 'Staff Administrasi 1', 'email' => 'staff.admin1@smktelkom-sda.sch.id', 'role' => 'staff', 'position_id' => 28, 'unit_id' => 2, 'nip' => '2002001'],
            ['name' => 'Staff Administrasi 2', 'email' => 'staff.admin2@smktelkom-sda.sch.id', 'role' => 'staff', 'position_id' => 28, 'unit_id' => 2, 'nip' => '2002002'],

                       
            // Guru di Kurikulum
            ['name' => 'Guru Matematika', 'email' => 'guru.matematika@smktelkom-sda.sch.id', 'role' => 'guru', 'position_id' => 10, 'unit_id' => 3, 'nip' => '1003010'],
            ['name' => 'Guru Bahasa Indonesia', 'email' => 'guru.bahasa@smktelkom-sda.sch.id', 'role' => 'guru', 'position_id' => 11, 'unit_id' => 3, 'nip' => '1003011'],
            ['name' => 'Guru TKJ', 'email' => 'guru.tkj@smktelkom-sda.sch.id', 'role' => 'guru', 'position_id' => 12, 'unit_id' => 3, 'nip' => '1003012'],
            ['name' => 'Guru RPL', 'email' => 'guru.rpl@smktelkom-sda.sch.id', 'role' => 'guru', 'position_id' => 13, 'unit_id' => 3, 'nip' => '1003013'],
   
            // Wali Kelas di Kesiswaan
            ['name' => 'Wali Kelas X TKJ 1', 'email' => 'wali.x.tkj1@smktelkom-sda.sch.id', 'role' => 'wali-kelas', 'position_id' => 17, 'unit_id' => 4, 'nip' => '1004010'],
            ['name' => 'Wali Kelas XI RPL 1', 'email' => 'wali.xi.rpl1@smktelkom-sda.sch.id', 'role' => 'wali-kelas', 'position_id' => 18, 'unit_id' => 4, 'nip' => '1004011'],
            ['name' => 'Wali Kelas XII TKJ 1', 'email' => 'wali.xii.tkj1@smktelkom-sda.sch.id', 'role' => 'wali-kelas', 'position_id' => 19, 'unit_id' => 4, 'nip' => '1004012'],
            
            // Admin System
            ['name' => 'System Administrator', 'email' => 'admin@smktelkom-sda.sch.id', 'role' => 'admin', 'position_id' => 29, 'unit_id' => 1, 'nip' => '9999001'],
        ];

        foreach($usersData as $userData){
            // Create User
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'email' => $userData['email'],
                    'password' => bcrypt('password123'),
                ]
            );
            
            // Assign Role
            $user->assignRole($userData['role']);
            
            // Create Employee record
            Employee::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'user_id' => $user->id,
                    'unit_id' => $userData['unit_id'],
                    'position_id' => $userData['position_id'],
                    'nip' => $userData['nip'],
                ]
            );
        }
    }
}
