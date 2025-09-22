<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('units')->insert([
            // Root - Sekolah
            [
                'id' => 1, 
                'name' => 'SMK Telkom Sidoarjo', 
                'code' => 'SEKOLAH',
                'parent_id' => null, 
                'head_id' => null, // Will be updated after users are created
                'description' => 'Unit utama sekolah',
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Unit Administrasi
            [
                'id' => 2, 
                'name' => 'Administrasi', 
                'code' => 'ADMIN',
                'parent_id' => 1, 
                'head_id' => null, // Will be updated after users are created
                'description' => 'Unit Administrasi dan Tata Keuangan',
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Unit Kurikulum
            [
                'id' => 3, 
                'name' => 'Kurikulum', 
                'code' => 'KURIKULUM',
                'parent_id' => 1, 
                'head_id' => null, // Will be updated after users are created
                'description' => 'Unit Kurikulum',
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Unit Kesiswaan
            [
                'id' => 4, 
                'name' => 'Kesiswaan', 
                'code' => 'KESISWAAN',
                'parent_id' => 1, 
                'head_id' => null, // Will be updated after users are created
                'description' => 'Unit Kesiswaan',
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Unit Sarana Prasarana
            [
                'id' => 5, 
                'name' => 'Sarana Prasarana', 
                'code' => 'SARPRAS',
                'parent_id' => 1, 
                'head_id' => null, // Will be updated after users are created
                'description' => 'Unit Sarana Prasarana',
                'created_at' => now(),
                'updated_at' => now()
            ],
            
            // Unit Hubungan Industri
            [
                'id' => 6, 
                'name' => 'Hubungan Industri', 
                'code' => 'HUBIN',
                'parent_id' => 1, 
                'head_id' => null, // Will be updated after users are created
                'description' => 'Unit Hubungan Industri',
                'created_at' => now(),
                'updated_at' => now()
            ],
            
        ]);
    }
}
