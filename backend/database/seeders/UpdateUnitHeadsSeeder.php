<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateUnitHeadsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Update unit heads after users are created
        DB::table('units')->where('id', 1)->update(['head_id' => 1]); // SMK Telkom Sidoarjo - Kepala Sekolah
        DB::table('units')->where('id', 2)->update(['head_id' => 3]); // Administrasi - Kepala Administrasi
        DB::table('units')->where('id', 3)->update(['head_id' => 6]); // Kurikulum - Wakasek Kurikulum
        DB::table('units')->where('id', 4)->update(['head_id' => 10]); // Kesiswaan - Wakasek Kesiswaan
        DB::table('units')->where('id', 5)->update(['head_id' => 13]); // Sarpras - Wakasek Sarpras
        DB::table('units')->where('id', 6)->update(['head_id' => 17]); // Hubin - Wakasek Hubin
        DB::table('units')->where('id', 7)->update(['head_id' => 10]); // Akademik - Wakasek Kesiswaan
    }
}
